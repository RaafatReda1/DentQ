import { useQuery } from "@tanstack/react-query";
import { getPromoCodes } from "../actions";

export const usePromoCodesQuery = () => {
  const { data = [], isLoading, error } = useQuery({
    queryKey: ["promoCodes"],
    queryFn: getPromoCodes,
    staleTime: 1000 * 60 * 2,
  });

  // Compute derived stats
  const now = new Date();
  const oneWeekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

  const totalCodes = data.length;
  const activeCodes = data.filter((c) => c.is_active).length;

  const totalUsesThisWeek = data.reduce((acc, c) => {
    const ids = Array.isArray(c.used_by_user_ids) ? c.used_by_user_ids : [];
    // Just count total uses from used_by_user_ids length as approximation
    return acc + ids.length;
  }, 0);

  // Total discount given this month — approximate from orders if available
  const totalUses = data.reduce((acc, c) => {
    const ids = Array.isArray(c.used_by_user_ids) ? c.used_by_user_ids : [];
    return acc + ids.length;
  }, 0);

  const topCode = data.reduce(
    (top, c) => {
      const uses = Array.isArray(c.used_by_user_ids) ? c.used_by_user_ids.length : 0;
      return uses > top.uses ? { code: c.code, uses } : top;
    },
    { code: null, uses: 0 }
  );

  return {
    promoCodes: data,
    isLoading,
    error,
    stats: { totalCodes, activeCodes, totalUses, topCode },
  };
};
