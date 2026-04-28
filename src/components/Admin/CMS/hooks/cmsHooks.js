import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  getStoreSettings, upsertStoreSettings,
  getFooter, upsertFooter,
  getAboutUsSections, getAboutStats, upsertAboutUsSections, upsertAboutStats,
  getLegalPages, upsertLegalPage,
  getNavItems, upsertNavItems, deleteNavItem,
} from "../api/cmsApi";

// ─── StoreSettings ────────────────────────────────────────────────────────────
export const useStoreSettings = () =>
  useQuery({ queryKey: ["cms-store"], queryFn: getStoreSettings, staleTime: 5 * 60 * 1000 });

export const useUpsertStoreSettings = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: upsertStoreSettings,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["cms-store"] }); toast.success("Store identity saved ✓"); },
    onError: (e) => toast.error(e.message),
  });
};

// ─── Footer ──────────────────────────────────────────────────────────────────
export const useFooter = () =>
  useQuery({ queryKey: ["cms-footer"], queryFn: getFooter, staleTime: 5 * 60 * 1000 });

export const useUpsertFooter = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: upsertFooter,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["cms-footer"] }); toast.success("Footer saved ✓"); },
    onError: (e) => toast.error(e.message),
  });
};

// ─── About Us ────────────────────────────────────────────────────────────────
export const useAboutUsSections = () =>
  useQuery({ queryKey: ["cms-about-sections"], queryFn: getAboutUsSections });

export const useAboutStats = () =>
  useQuery({ queryKey: ["cms-about-stats"], queryFn: getAboutStats });

export const useUpsertAboutUs = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ sections, stats }) =>
      Promise.all([upsertAboutUsSections(sections), upsertAboutStats(stats)]),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cms-about-sections"] });
      qc.invalidateQueries({ queryKey: ["cms-about-stats"] });
      toast.success("About Us saved ✓");
    },
    onError: (e) => toast.error(e.message),
  });
};

// ─── Legal Pages ─────────────────────────────────────────────────────────────
export const useLegalPages = () =>
  useQuery({ queryKey: ["cms-legal"], queryFn: getLegalPages });

export const useUpsertLegalPage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: upsertLegalPage,
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["cms-legal"] });
      const label = vars.page_key === "terms_of_use" ? "Terms of use" : "Privacy policy";
      toast.success(`${label} saved ✓`);
    },
    onError: (e) => toast.error(e.message),
  });
};

// ─── Navigation ──────────────────────────────────────────────────────────────
export const useNavItems = () =>
  useQuery({ queryKey: ["cms-nav"], queryFn: getNavItems });

export const useUpsertNavItems = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: upsertNavItems,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["cms-nav"] }); toast.success("Navigation saved ✓"); },
    onError: (e) => toast.error(e.message),
  });
};

export const useDeleteNavItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteNavItem,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cms-nav"] }),
    onError: (e) => toast.error(e.message),
  });
};
