import { supabase } from "../../../utils/SupabaseClient";

export const signInAction = async (email, password) => {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            if (error.message.includes("Invalid login credentials")) {
                return { success: false, error: "Invalid email or password." };
            }
            return { success: false, error: error.message };
        }

        return { success: true, user: data.user, session: data.session };
    } catch (err) {
        return { success: false, error: err.message };
    }
};
