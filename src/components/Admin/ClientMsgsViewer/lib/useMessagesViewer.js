import { useState, useMemo, useEffect, useRef } from "react";
import { useContactMessages, useUpdateMessage, useDeleteMessage } from "../../CMS/hooks/cmsHooks";
import { MARKERS as getMarkers } from "./constants";

export const useMessagesViewer = (styles) => {
  const markers = useMemo(() => getMarkers(styles), [styles]);
  const { data: messages, isLoading } = useContactMessages();
  const { mutate: update } = useUpdateMessage();
  const { mutate: remove } = useDeleteMessage();

  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); 
  const [sortBy, setSortBy] = useState("newest");
  const [markerMenuOpen, setMarkerMenuOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });
  const markerRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (markerRef.current && !markerRef.current.contains(e.target)) setMarkerMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const processedMessages = useMemo(() => {
    if (!messages) return [];
    let result = messages.filter(m => {
      const matchesSearch = [m.full_name, m.email_address, m.phone_number, m.message]
        .some(field => field?.toString().toLowerCase().includes(search.toLowerCase()));
      const matchesFilter = filter === "all" ? true :
        filter === "unread" ? !m.seen :
        markers.some(mk => mk.id === filter) ? m.mark === filter : true;
      return matchesSearch && matchesFilter;
    });

    return result.sort((a, b) => {
      switch (sortBy) {
        case "newest": return new Date(b.created_at) - new Date(a.created_at);
        case "oldest": return new Date(a.created_at) - new Date(b.created_at);
        case "name":   return (a.full_name || "").localeCompare(b.full_name || "");
        case "marker": return (a.mark || "zzz").localeCompare(b.mark || "zzz");
        case "unread": return (a.seen === b.seen) ? 0 : a.seen ? 1 : -1;
        default: return 0;
      }
    });
  }, [messages, search, filter, sortBy, markers]);

  const handleSelect = (msg) => {
    setSelectedId(msg.id);
    if (!msg.seen) update({ id: msg.id, payload: { seen: true } });
  };

  const handleSetMarker = (msgId, markerId) => {
    update({ id: msgId, payload: { mark: markerId } });
    setMarkerMenuOpen(false);
  };

  const confirmDelete = () => {
    if (deleteModal.id) {
      remove(deleteModal.id);
      if (selectedId === deleteModal.id) setSelectedId(null);
    }
  };

  return {
    messages, isLoading, processedMessages, selectedId, setSelectedId,
    search, setSearch, filter, setFilter, sortBy, setSortBy,
    markerMenuOpen, setMarkerMenuOpen, deleteModal, setDeleteModal, markerRef,
    handleSelect, handleSetMarker, confirmDelete, markers
  };
};
