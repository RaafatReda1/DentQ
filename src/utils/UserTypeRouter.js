import { supabase } from "./SupabaseClient";

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
      setUser({ type: "guest", fullName: "", email: "", session: false });
      return;
    }

    // 3️⃣ Validate email exists
    const email = session.user.email;
    if (!email) {
      console.error("No email found in session");
      setUser((prev)=>({
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
      setUser((prev)=>({
        ...prev,
        type: "admin",
        fullName: adminData.fullName || fullName,
        nickName:adminData.nickName,
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
      setUser((prev)=>({
        ...prev,
        type: "client",
        fullName: clientData.fullName || fullName,
        nickName:clientData.nickName,
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
      .select("fullName, email, avatarUrl")
      .single();

    if (insertError) {
      console.error("❌ Client registration error:", insertError);
      
      // Fallback to guest if registration fails
      setUser((prev)=>({
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
      setUser((prev)=>({
        ...prev,
        type: "client",
        fullName: newClient.fullName || fullName,
        email: newClient.email,
        session,
        avatarUrl: newClient.avatarUrl || avatarUrl,
      }));
      return;
    }

    // 7️⃣ Final fallback (should rarely reach here)
    console.log("⚠️ Fallback: Setting as guest");
    setUser((prev)=>({
      ...prev,
      type: "guest",
      fullName: fullName,
      email: email,
      session,
      avatarUrl: avatarUrl,
    }));

  } catch (unexpectedError) {
    console.error("💥 Unexpected error in UserTypeRouter:", unexpectedError);
    setUser((prev)=>({ 
      ...prev,
      type: "error", 
      error: unexpectedError.message,
      session: false 
    }));
  }finally{
    // 8️⃣ Set loading state to false
    setUser((prev)=>({...prev, loadingState: false}));
  }
};

export default UserTypeRouter;