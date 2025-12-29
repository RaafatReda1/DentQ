import { useEffect } from "react";
import { supabase } from "./SupabaseClient";
const useRealtimeSubscription = (channelName /* name it anyhting */, table /*use the table name u want to listen*/, filter /* optional */, callback, event = '*', schema = 'public') => {
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


// examble
//   // Real-time subscription to Products table
//   useRealtimeSubscription(
//     `product-${productId}`,//channel name which can be anything
//     'Products',//table we're listening to
//     `id=eq.${productId}`,//filter for which product we need to listen
//     (payload) => {
//       console.log('Real-time update received:', payload.new);
//       setLiveProduct(prev => ({ ...prev, ...payload.new }));
//     },
//     'UPDATE'
//   );
