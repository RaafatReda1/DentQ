import { Star, AlertCircle, Clock, CheckCircle, Shield } from "lucide-react";

export const MARKERS = (styles) => [
  { id: "important", icon: Star,      color: "#f59e0b", labelKey: "important",  className: styles.badgeImportant },
  { id: "urgent",    icon: AlertCircle, color: "#ef4444", labelKey: "urgent",     className: styles.badgeUrgent },
  { id: "follow_up", icon: Clock,      color: "#3b82f6", labelKey: "follow_up",   className: styles.badgeFollowUp },
  { id: "resolved",  icon: CheckCircle, color: "#22c55e", labelKey: "resolved",    className: styles.badgeResolved },
  { id: "junk",      icon: Shield,     color: "#64748b", labelKey: "junk",        className: styles.badgeJunk },
];
