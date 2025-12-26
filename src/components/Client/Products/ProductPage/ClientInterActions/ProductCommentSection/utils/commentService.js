import { supabase } from "../../../../../../../utils/SupabaseClient";

/**
 * Fetches user profiles from the Clients table based on a list of IDs.
 * @param {string[]} clientIds - Array of client IDs to fetch.
 * @returns {Promise<{data: object[], error: object}>}
 */
export const fetchUserProfiles = async (clientIds) => {
    if (!clientIds || clientIds.length === 0) return { data: [], error: null };

    // Filter out 'guest' and nulls
    const uniqueIds = [...new Set(clientIds.filter(id => id && id !== 'guest'))];
    if (uniqueIds.length === 0) return { data: [], error: null };

    return await supabase
        .from('Clients')
        .select('id, fullName, avatarUrl')
        .in('id', uniqueIds);
};

/**
 * Updates the comments JSONB column for a specific product.
 * @param {string} productId - The product ID.
 * @param {object[]} updatedComments - The new array of comment objects.
 * @returns {Promise<{error: object}>}
 */
export const updateCommentsInDB = async (productId, updatedComments) => {
    const { error } = await supabase
        .from("Products")
        .update({ comments: updatedComments })
        .eq("id", productId);
    return { error };
};
