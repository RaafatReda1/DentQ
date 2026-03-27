import { supabase } from "../../../utils/SupabaseClient";

export const resetPasswordAction = async (email) => {
    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (err) {
        return { success: false, error: "An unexpected error occurred." };
    }
};
