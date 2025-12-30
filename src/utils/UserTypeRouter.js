import { GetCookie, MakeCookie, DeleteCookie } from "./GuestIdCookie";
import { supabase } from "./SupabaseClient";

/* =========================
   Helper: Transfer Guest Cart
========================= */
const transferGuestCart = async (clientId) => {
  const guestId = GetCookie();
  if (!guestId) return;

  console.log(`🛒 Found guest_id cookie: ${guestId}. Attempting to transfer cart to Client ${clientId}...`);

  // 1. Fetch Guest Cart
  const { data: guestCart } = await supabase
    .from("Carts")
    .select("*")
    .eq("guest_id", guestId)
    .maybeSingle();

  if (guestCart && guestCart.items?.length > 0) {
    // 2. Check if Client ALREADY has a cart
    const { data: clientCart } = await supabase
      .from("Carts")
      .select("*")
      .eq("client_id", clientId)
      .maybeSingle();

    let finalItems = [...guestCart.items];

    if (clientCart && clientCart.items?.length > 0) {
      console.log("🔄 Client already has a cart. Merging items...");

      // Merge logic: Start with client items
      const merged = [...clientCart.items];

      guestCart.items.forEach(gItem => {
        // Find if this variant exists in client cart
        const index = merged.findIndex(cItem =>
          cItem.id === gItem.id &&
          cItem.size === gItem.size &&
          cItem.color === gItem.color
        );

        if (index !== -1) {
          // Exists -> Sum quantity
          merged[index].qty += gItem.qty;
        } else {
          // New variant -> Add to list
          merged.push(gItem);
        }
      });
      finalItems = merged;

      // 3. Update Client's existing cart
      const { error: updateError } = await supabase
        .from("Carts")
        .update({ items: finalItems })
        .eq("id", clientCart.id);

      if (updateError) {
        console.error("❌ Error merging into client cart:", updateError);
        return;
      }

      // 4. Delete the guest cart record (cleanup)
      await supabase.from("Carts").delete().eq("id", guestCart.id);
    } else {
      // Client has no cart: Move guest cart to client
      const { error: moveError } = await supabase
        .from("Carts")
        .update({
          guest_id: null,
          client_id: clientId
        })
        .eq("id", guestCart.id);

      if (moveError) {
        console.error("❌ Error moving guest cart to client:", moveError);
        return;
      }
    }

    console.log("✅ Cart transfer/merge completed successfully.");
    DeleteCookie(); // Clear the guest cookie
  } else {
    // Guest has no cart or empty cart, just delete the unused cookie
    if (guestCart) await supabase.from("Carts").delete().eq("id", guestCart.id);
    DeleteCookie();
  }
};

const UserTypeRouter = async (user, setUser) => {
  try {
    // set loading state
    setUser({ ...user, loadingState: true });
    // 1️⃣ Get current session
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error("Session Error:", error);
      setUser({ type: "error", error: error.message, session: false });
      return;
    }

    const session = data.session;

    // 2️⃣ Handle no session (logged out)
    if (!session) {
      if (!GetCookie()) { MakeCookie(30) }//make a guest_id cookie that persists for 30 days
      setUser({ type: "guest", fullName: "", email: "", session: false, guest_id: GetCookie() });//Storing the guest_id in the user object as a cookie
      return;
    }

    // 3️⃣ Validate email exists
    const email = session.user.email;
    if (!email) {
      console.error("No email found in session");
      setUser((prev) => ({
        ...prev,
        type: "guest",
        fullName: session.user.user_metadata?.name || "",
        email: "",
        session,
        avatarUrl: session.user.user_metadata?.avatarUrl || ""
      }));
      return;
    }

    const avatarUrl = session.user.user_metadata?.avatar_url ||
      session.user.user_metadata?.avatarUrl ||
      "";
    const fullName = session.user.user_metadata?.full_name ||
      session.user.user_metadata?.name ||
      "";

    console.log("Session found for:", email);

    // 4️⃣ Check Admins first
    const { data: adminData, error: adminError } = await supabase
      .from("Admins")
      .select("fullName, email, avatarUrl")
      .eq("email", email)
      .maybeSingle();

    if (adminError) {
      console.error("Admin check error:", adminError);
    }

    if (adminData) {
      console.log("✅ Admin found:", adminData);
      setUser((prev) => ({
        ...prev,
        type: "admin",
        id: adminData.id,
        fullName: adminData.fullName || fullName,
        nickName: adminData.nickName,
        email: adminData.email,
        session,
        avatarUrl: adminData.avatarUrl || avatarUrl,
      }));
      return;
    }

    // 5️⃣ Check if Client exists
    const { data: clientData, error: clientError } = await supabase
      .from("Clients")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (clientError) {
      console.error("Client check error:", clientError);
    }

    if (clientData) {
      console.log("✅ Client found:", clientData);

      // Attempt Cart Transfer
      await transferGuestCart(clientData.id);

      setUser((prev) => ({
        ...prev,
        type: "client",
        id: clientData.id,
        fullName: clientData.fullName || fullName,
        nickName: clientData.nickName,
        email: clientData.email,
        session,
        avatarUrl: clientData.avatarUrl || avatarUrl,
      }));
      return;
    }

    // 6️⃣ Auto-register new user as Client
    console.log("📝 No user record found, auto-registering as client...");

    const { data: newClient, error: insertError } = await supabase
      .from("Clients")
      .insert({
        fullName: fullName,
        email: email,
        avatarUrl: avatarUrl
      })
      .select("id, fullName, email, avatarUrl")
      .single();

    if (insertError) {
      console.error("❌ Client registration error:", insertError);

      // Fallback to guest if registration fails
      setUser((prev) => ({
        ...prev,
        type: "guest",
        fullName: fullName,
        email: email,
        session,
        avatarUrl: avatarUrl,
      }));
      return;
    }

    if (newClient) {
      console.log("✅ New client registered:", newClient);

      // Attempt Cart Transfer for new client too
      await transferGuestCart(newClient.id);

      setUser((prev) => ({
        ...prev,
        type: "client",
        id: newClient.id,
        fullName: newClient.fullName || fullName,
        email: newClient.email,
        session,
        avatarUrl: newClient.avatarUrl || avatarUrl,
      }));
      return;
    }

    // 7️⃣ Final fallback (should rarely reach here)
    console.log("⚠️ Fallback: Setting as guest");
    setUser((prev) => ({
      ...prev,
      type: "guest",
      fullName: fullName,
      email: email,
      session,
      avatarUrl: avatarUrl,
    }));

  } catch (unexpectedError) {
    console.error("💥 Unexpected error in UserTypeRouter:", unexpectedError);
    setUser((prev) => ({
      ...prev,
      type: "error",
      error: unexpectedError.message,
      session: false
    }));
  } finally {
    // 8️⃣ Set loading state to false
    setUser((prev) => ({ ...prev, loadingState: false }));
  }
};

export default UserTypeRouter;