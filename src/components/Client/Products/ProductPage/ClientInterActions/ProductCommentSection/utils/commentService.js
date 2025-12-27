import { supabase } from "../../../../../../../utils/SupabaseClient";
export const fetchUserProfiles = async (clientIds) => {
    if (!clientIds || clientIds.length === 0) return { data: [], error: null }; //it takes the clientIds from the comments as a parameter from the hook

    // Filter out 'guest' and nulls
    const uniqueIds = [...new Set(clientIds.filter(id => id && id !== 'guest'))];//then filters them from guests and nulls
    if (uniqueIds.length === 0) return { data: [], error: null };//if the filtered array is empty return

    return await supabase
        .from('Clients')
        .select('id, fullName, avatarUrl')
        .in('id', uniqueIds);
};  //finally it returns an array of profiles with id, fullName and avatarUrl from the clients table to preview these data for each comment

export const updateCommentsInDB = async (productId, updatedComments) => { //function that udpate the new array of comment objects in the DB after recieving it's parameteres from the hook
    const { error } = await supabase
        .from("Products")
        .update({ comments: updatedComments })
        .eq("id", productId);
    return { error };
};
