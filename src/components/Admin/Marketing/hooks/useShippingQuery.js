import { useQuery } from "@tanstack/react-query";
import { getShippingRates } from "../api/marketingApi";

export const useShippingQuery = () => {
  return useQuery({
    queryKey: ["shippingRates"],
    queryFn: getShippingRates,
  });
};
