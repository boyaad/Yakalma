// useOrderNotifications is now a no-op.
// All seller realtime logic (data refresh + toast notifications) has been
// consolidated into SellerInfoContext to avoid duplicate Supabase Realtime
// channels on the same table/filter, which can cause missed events.
//
// This hook is kept as an empty stub so existing imports in MainLayout don't break.
export function useOrderNotifications() {
  // Intentionally empty — see SellerInfoContext.jsx
}
