import { useEffect } from "react";
import { supabase } from "./SupabaseClient";
const useRealtimeSubscription = (channelName, table, filter, callback, event = '*', schema = 'public') => {
    useEffect(() => {
        if (!channelName || !table) return;

        const channel = supabase
            .channel(channelName)
            .on(
                "postgres_changes",
                {
                    event: event,
                    schema: schema,
                    table: table,
                    filter: filter,
                },
                (payload) => {
                    console.log(`Real-time update received for ${table}:`, payload);
                    callback(payload);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [channelName, table, filter, event, schema]); // Callback excluded to avoid re-subscribing on every render if callback isn't memoized
};

export default useRealtimeSubscription;
