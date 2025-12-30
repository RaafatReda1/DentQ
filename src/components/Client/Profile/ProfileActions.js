import { supabase } from "../../../utils/SupabaseClient";
import toast from "react-hot-toast";

/**
 * Fetch client data from Supabase
 * @param {string} clientId 
 */
export const fetchClientData = async (clientId) => {
    if (!clientId) return null;
    const { data, error } = await supabase
        .from("Clients")
        .select("*")
        .eq("id", clientId)
        .maybeSingle();

    if (error) {
        console.error("Error fetching client data:", error);
        return null;
    }
    return data;
};

/**
 * Update client data in Supabase
 * @param {string} clientId 
 * @param {object} updates 
 */
export const updateClientData = async (clientId, updates) => {
    const { data, error } = await supabase
        .from("Clients")
        .update(updates)
        .eq("id", clientId)
        .select()
        .single();

    if (error) {
        console.error("Error updating client data:", error);
        toast.error("Failed to update profile");
        return null;
    }

    toast.success("Profile updated successfully!");
    return data;
};

/**
 * Upload profile picture to Supabase Storage
 * Folder structure: profiles/{id}_{fullName}/{filename}
 */
export const uploadProfilePicture = async (clientId, fullName, file) => {
    try {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        // Sanitize fullName for folder name (remove special characters)
        const sanitizedName = fullName.replace(/[^a-zA-Z0-9]/g, "_");
        const filePath = `profiles/${clientId}_${sanitizedName}/${fileName}`;

        // 1. Upload the file
        const { error: uploadError } = await supabase.storage
            .from("avatars") // Assuming bucket name is 'avatars', adjust if needed
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        // 2. Get the public URL
        const { data: { publicUrl } } = supabase.storage
            .from("avatars")
            .getPublicUrl(filePath);

        return publicUrl;
    } catch (error) {
        console.error("Error uploading profile picture:", error);
        toast.error("Failed to upload image");
        return null;
    }
};
