import {
  FaFacebook,
  FaInstagram,
  FaXTwitter,
  FaLinkedin,
  FaYoutube,
  FaWhatsapp,
  FaTelegram,
  FaViber,
  FaSnapchat,
  FaTiktok,
  FaPinterest,
  FaDiscord,
  FaReddit,
  FaLink,
  FaEnvelope,
  FaPhone,
  FaLocationDot,
  FaGlobe,
  FaGithub,
  FaBehance,
  FaDribbble,
  FaTwitch,
  FaSpotify,
} from "react-icons/fa6";

export const ICON_REGISTRY = [
  { key: "fa:facebook", label: "Facebook", component: FaFacebook },
  { key: "fa:instagram", label: "Instagram", component: FaInstagram },
  { key: "fa:x-twitter", label: "Twitter / X", component: FaXTwitter },
  { key: "fa:linkedin", label: "LinkedIn", component: FaLinkedin },
  { key: "fa:youtube", label: "YouTube", component: FaYoutube },
  { key: "fa:whatsapp", label: "WhatsApp", component: FaWhatsapp },
  { key: "fa:telegram", label: "Telegram", component: FaTelegram },
  { key: "fa:viber", label: "Viber", component: FaViber },
  { key: "fa:snapchat", label: "Snapchat", component: FaSnapchat },
  { key: "fa:tiktok", label: "TikTok", component: FaTiktok },
  { key: "fa:pinterest", label: "Pinterest", component: FaPinterest },
  { key: "fa:discord", label: "Discord", component: FaDiscord },
  { key: "fa:reddit", label: "Reddit", component: FaReddit },
  { key: "fa:github", label: "GitHub", component: FaGithub },
  { key: "fa:behance", label: "Behance", component: FaBehance },
  { key: "fa:dribbble", label: "Dribbble", component: FaDribbble },
  { key: "fa:twitch", label: "Twitch", component: FaTwitch },
  { key: "fa:spotify", label: "Spotify", component: FaSpotify },
  { key: "fa:envelope", label: "Email", component: FaEnvelope },
  { key: "fa:phone", label: "Phone", component: FaPhone },
  { key: "fa:location", label: "Location", component: FaLocationDot },
  { key: "fa:globe", label: "Website", component: FaGlobe },
  { key: "fa:link", label: "Link", component: FaLink },
];

export const getIconByKey = (key) => {
  if (!key) return null;
  const match = ICON_REGISTRY.find((icon) => icon.key === key);
  return match ? match.component : null;
};
