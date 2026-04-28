import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getStoreSettings,
  updateStoreSettings,
} from "../components/Invoice/actions";
import toast from "react-hot-toast";

export const useStoreSettings = () => {
  return useQuery({
    queryKey: ["storeSettings"],
    queryFn: getStoreSettings,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useUpdateStoreSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => updateStoreSettings(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["storeSettings"] });
      toast.success("Store settings updated successfully");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to update store settings");
    },
  });
};
