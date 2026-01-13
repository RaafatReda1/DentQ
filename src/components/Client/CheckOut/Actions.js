import { supabase } from "../../../utils/SupabaseClient";

/**
 * Fetch all governorates for shipping
 */
export const fetchGovernorates = async () => {
    const { data, error } = await supabase
        .from("GovernoratesShipping")
        .select("*")
        .order("governorateEn", { ascending: true });

    if (error) {
        console.error("Error fetching governorates:", error);
        return [];
    }
    return data;
};

/**
 * Calculate shipping fee based on governorate ID
 */
export const calculateShipping = (governorateId, governorates) => {
    if (!governorateId || !governorates) return 0;

    const governorate = governorates.find(g => g.id === parseInt(governorateId));
    return governorate ? governorate.shippingPrice : 0;
};

