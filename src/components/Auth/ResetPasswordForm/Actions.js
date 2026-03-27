import { supabase } from "../../../utils/SupabaseClient";

export const resetPasswordUpdateAction = async (newPassword) => {
    try {
        const { data, error } = await supabase.auth.updateUser({ password: newPassword });

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true, user: data.user };
    } catch {
        return { success: false, error: "An unexpected error occurred." };
    }
};
