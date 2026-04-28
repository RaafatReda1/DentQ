import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPromoCode, updatePromoCode, deletePromoCode } from "../api/marketingApi";
import toast from "react-hot-toast";

export const usePromoCodeMutations = () => {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["promoCodes"] });

  const createMutation = useMutation({
    mutationFn: createPromoCode,
    onSuccess: () => {
      invalidate();
      toast.success("Promo code created!");
    },
    onError: (err) => toast.error(err.message || "Failed to create promo code"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }) => updatePromoCode(id, updates),
    onSuccess: () => {
      invalidate();
      toast.success("Promo code updated!");
    },
    onError: () => toast.error("Failed to update promo code"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deletePromoCode(id),
    onSuccess: () => {
      invalidate();
      toast.success("Promo code deleted");
    },
    onError: () => toast.error("Failed to delete promo code"),
  });

  return { createMutation, updateMutation, deleteMutation };
};
