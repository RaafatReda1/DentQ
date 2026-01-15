import toast from "react-hot-toast";
import { applyPromoCode } from "../../../utils/CheckPromoCodeValidity";
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

    const governorate = governorates.find(
        (g) => g.id === parseInt(governorateId)
    );
    return governorate ? governorate.shippingPrice : 0;
};

//Conifrm Order Action

export const confirmOrder = async (FormData) => {
    if (FormData.promocode_id) {
        console.log(FormData.promocode_id);
        await applyPromoCode(
            FormData.promocode_id,
            FormData.client_id || FormData.guest_id
        );
    }
    const { data, error } = await supabase
        .from("Orders")
        .insert({ ...FormData, status: "pending" });
    if (error) {
        console.error(error);
        return [];
    } else{
        toast.success("Order confirmed!");
    }
};
