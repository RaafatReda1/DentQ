import { supabase } from "../../../../../utils/SupabaseClient";
import {
    Facebook,
    Instagram,
    Linkedin,
    Twitter,
    Youtube,
    MessageCircle,
    LinkIcon
} from "lucide-react";

/* ======================================
   Fetch Footer Data
====================================== */

export const fetchFooterData = async (slugName = "main") => {
    const { data, error } = await supabase
        .from("Footer")
        .select("*")
        .eq("slug_name", slugName)
        .maybeSingle();

    if (error) {
        console.error("Error fetching footer:", error.message);
        return null;
    }

    return data;
};

/* ======================================
   Social Icon Resolver
   (returns the icon component itself)
====================================== */

const iconMap = [
    { keys: ["facebook.com", "fb.me", "fb.com"], icon: Facebook },
    { keys: ["instagram.com", "instagr.am"], icon: Instagram },
    { keys: ["linkedin.com", "lnkd.in"], icon: Linkedin },
    { keys: ["twitter.com", "x.com"], icon: Twitter },
    { keys: ["youtube.com", "youtu.be"], icon: Youtube },
    { keys: ["wa.me", "whatsapp.com"], icon: MessageCircle },
];

export const getSocialIcon = (url) => {
    if (!url) return LinkIcon;

    const lowerUrl = url.toLowerCase();

    const match = iconMap.find(item =>
        item.keys.some(key => lowerUrl.includes(key))
    );

    return match ? match.icon : LinkIcon;
};