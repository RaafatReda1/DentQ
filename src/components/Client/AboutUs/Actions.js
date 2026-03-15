import { supabase } from "../../../utils/SupabaseClient";

/* ======================================
   Fetch About Us Data
====================================== */

export const fetchAboutUsData = async () => {
    const { data, error } = await supabase
        .from("AboutUsData")
        .select("*")
        .maybeSingle(); // Assumes one row, or filters like .eq('id', 1) if necessary

    if (error) {
        console.error("Error fetching About Us data:", error.message);
        return null;
    }

    return data;
};
