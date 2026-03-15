import { supabase } from "../../../utils/SupabaseClient";

/* ======================================
   Fetch Contact Info Data
====================================== */

export const fetchContactData = async () => {
    const { data, error } = await supabase
        .from("ContactData")
        .select("*")
    if (error) {
        console.error("Error fetching contact data:", error.message);
        return null;
    }

    return data;
};

/* ======================================
   Submit Form Action
====================================== */

export const submitContactMessage = async (formData) => {
    const { data, error } = await supabase
        .from("ContactForm")
        .insert([
            {
                full_name: formData.full_name,
                email_address: formData.email_address,
                phone_number: formData.phone_number,
                message: formData.message,
                client: formData.client_id,
            }
        ])
        .select();

    if (error) {
        console.error("Error submitting contact form:", error.message);
        return { success: false, error: error.message };
    }

    return { success: true, data };
};
