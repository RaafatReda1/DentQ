import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createBanner,
  updateBanner,
  deleteBanner,
  activateBannerExclusive,
} from "../actions";
import toast from "react-hot-toast";

export const useBannerMutations = () => {
  const queryClient = useQueryClient();
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["banners"] });

  const createMutation = useMutation({
    mutationFn: createBanner,
    onSuccess: () => { invalidate(); toast.success("Banner created!"); },
    onError: () => toast.error("Failed to create banner"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }) => updateBanner(id, updates),
    onSuccess: () => { invalidate(); toast.success("Banner saved!"); },
    onError: () => toast.error("Failed to update banner"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteBanner(id),
    onSuccess: () => { invalidate(); toast.success("Banner deleted"); },
    onError: () => toast.error("Failed to delete banner"),
  });

  const activateMutation = useMutation({
    mutationFn: (id) => activateBannerExclusive(id),
    onSuccess: () => { invalidate(); toast.success("Banner activated!"); },
    onError: () => toast.error("Failed to activate banner"),
  });

  return { createMutation, updateMutation, deleteMutation, activateMutation };
};
