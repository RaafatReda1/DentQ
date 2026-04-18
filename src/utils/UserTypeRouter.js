import { GetCookie, MakeCookie, DeleteCookie } from "./GuestIdCookie";
import { supabase } from "./SupabaseClient";
import { transferGuestCart } from "./TransferGuestCart";
import { transferGuestOrders } from "./TransferGuestOrders";

/**
 * UserTypeRouter: Determines user role and hydrates global state.
 * @param {Function} setUser - State setter from useUserData hook.
 * @param {Boolean} isInitial - If true, manages global loadingState.
 */
const UserTypeRouter = async (setUser, isInitial = false) => {
  try {
    if (isInitial) {
        setUser((prev) => ({ ...prev, loadingState: true }));
    }
    
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error("Session Error:", error);
      setUser({ type: "error", error: error.message, session: false });
      return;
    }

    const session = data.session;

    if (!session) {
      if (!GetCookie()) MakeCookie(30);
      setUser({
        type: "guest",
        fullName: "",
        email: "",
        session: false,
        guest_id: GetCookie(),
        loadingState: false
      });
      return;
    }

    const email = session.user.email;
    const avatarUrl = session.user.user_metadata?.avatar_url || session.user.user_metadata?.avatarUrl || "";
    const fullName = session.user.user_metadata?.full_name || session.user.user_metadata?.name || "";

    const adminResponse = await fetch(`https://yevtqhevspsgfhzfonlo.supabase.co/functions/v1/CheckIsAdmin`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${session.access_token}` },
        body: JSON.stringify({ email }),
    });

    const { isAdmin, admin: adminData } = await adminResponse.json();

    if (isAdmin && adminData) {
      setUser((prev) => ({
        ...prev,
        type: "admin",
        id: adminData.id,
        fullName: adminData.fullName || fullName,
        nickName: adminData.nickName,
        email: adminData.email,
        session,
        avatarUrl: adminData.avatarUrl || avatarUrl,
        loadingState: false
      }));
      return;
    }

    const { data: clientData, error: clientError } = await supabase.from("Clients").select("*").eq("email", email).maybeSingle();

    if (clientData) {
      await transferGuestOrders(clientData.id);
      await transferGuestCart(clientData.id);
      setUser((prev) => ({
        ...prev,
        type: "client",
        id: clientData.id,
        fullName: clientData.fullName || fullName,
        nickName: clientData.nickName,
        email: clientData.email,
        session,
        phone: clientData.phone,
        address: clientData.address,
        avatarUrl: clientData.avatarUrl || avatarUrl,
        governorateId: clientData.governorateId,
        loadingState: false
      }));
      return;
    }

    // Auto-register logic...
    const { data: newClient } = await supabase.from("Clients").insert({
        id: session.user.id, fullName, email, avatarUrl: avatarUrl
    }).select("*").single();

    if (newClient) {
      setUser((prev) => ({
        ...prev,
        type: "client",
        id: newClient.id,
        fullName: newClient.fullName || fullName,
        email: newClient.email,
        session,
        avatarUrl: newClient.avatarUrl || avatarUrl,
        loadingState: false
      }));
    }
  } catch (unexpectedError) {
    console.error("💥 Unexpected error in UserTypeRouter:", unexpectedError);
    setUser((prev) => ({ ...prev, type: "error", error: unexpectedError.message, loadingState: false }));
  }
};

export default UserTypeRouter;
