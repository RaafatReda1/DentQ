import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createShippingRate, updateShippingRate, deleteShippingRate } from "../api/marketingApi";
import toast from "react-hot-toast";

export const useShippingMutations = () => {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: createShippingRate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shippingRates"] });
      toast.success("Shipping rate added successfully");
    },
    onError: (err) => toast.error(`Error: ${err.message}`),
  });

  const update = useMutation({
    mutationFn: ({ id, updates }) => updateShippingRate(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shippingRates"] });
      toast.success("Shipping rate updated");
    },
    onError: (err) => toast.error(`Error: ${err.message}`),
  });

  const remove = useMutation({
    mutationFn: deleteShippingRate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shippingRates"] });
      toast.success("Shipping rate deleted");
    },
    onError: (err) => toast.error(`Error: ${err.message}`),
  });

  return { create, update, remove };
};
