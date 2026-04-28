import { useQuery } from "@tanstack/react-query";
import { getBanners } from "../actions";

export const useBannersQuery = () => {
  return useQuery({
    queryKey: ["banners"],
    queryFn: getBanners,
    staleTime: 1000 * 60 * 5,
  });
};
