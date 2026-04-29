import React, { useState, useMemo, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { 
  Search, Mail, Star, Trash2, CheckCircle, 
  Circle, Phone, Clock, ArrowUpRight,
  Inbox, AlertCircle, Flag, Check, Shield,
  ChevronDown, ArrowUpDown, Filter
} from "lucide-react";
import { Skeleton } from "@mui/material";
import { useContactMessages, useUpdateMessage, useDeleteMessage } from "../CMS/hooks/cmsHooks";
import ConfirmModal from "./components/ConfirmModal";
import styles from "./ClientMsgsViewer.module.css";

const MARKERS = [
  { id: "important", icon: Star,      color: "#f59e0b", labelKey: "important",  className: styles.badgeImportant },
  { id: "urgent",    icon: AlertCircle, color: "#ef4444", labelKey: "urgent",     className: styles.badgeUrgent },
  { id: "follow_up", icon: Clock,      color: "#3b82f6", labelKey: "follow_up",   className: styles.badgeFollowUp },
  { id: "resolved",  icon: CheckCircle, color: "#22c55e", labelKey: "resolved",    className: styles.badgeResolved },
  { id: "junk",      icon: Shield,     color: "#64748b", labelKey: "junk",        className: styles.badgeJunk },
];

const ClientMsgsViewer = () => {
  const { t } = useTranslation();
  const { data: messages, isLoading } = useContactMessages();
  const { mutate: update } = useUpdateMessage();
  const { mutate: remove } = useDeleteMessage();

  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); 
  const [sortBy, setSortBy] = useState("newest"); // newest, oldest, name, marker
  const [markerMenuOpen, setMarkerMenuOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });
  const markerRef = useRef(null);

  // Click outside to close marker menu
  useEffect(() => {
    const handleClick = (e) => {
      if (markerRef.current && !markerRef.current.contains(e.target)) setMarkerMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Filtering & Sorting Logic
  const processedMessages = useMemo(() => {
    if (!messages) return [];
    
    // 1. Filter
    let result = messages.filter(m => {
      const matchesSearch = 
        m.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        m.email_address?.toLowerCase().includes(search.toLowerCase()) ||
        m.phone_number?.toString().includes(search) ||
        m.message?.toLowerCase().includes(search.toLowerCase());
      
      const matchesFilter = 
        filter === "all" ? true :
        filter === "unread" ? !m.seen :
        MARKERS.some(mk => mk.id === filter) ? m.mark === filter : true;

      return matchesSearch && matchesFilter;
    });

    // 2. Sort
    return result.sort((a, b) => {
      if (sortBy === "newest") return new Date(b.created_at) - new Date(a.created_at);
      if (sortBy === "oldest") return new Date(a.created_at) - new Date(b.created_at);
      if (sortBy === "name")   return (a.full_name || "").localeCompare(b.full_name || "");
      if (sortBy === "marker") return (a.mark || "zzz").localeCompare(b.mark || "zzz");
      if (sortBy === "unread") return (a.seen === b.seen) ? 0 : a.seen ? 1 : -1;
      return 0;
    });
  }, [messages, search, filter, sortBy]);

  const selectedMsg = messages?.find(m => m.id === selectedId);

  const handleSelect = (msg) => {
    setSelectedId(msg.id);
    if (!msg.seen) {
      update({ id: msg.id, payload: { seen: true } });
    }
  };

  const setMarker = (msgId, markerId) => {
    update({ id: msgId, payload: { mark: markerId } });
    setMarkerMenuOpen(false);
  };

  const handleDelete = (id) => {
    setDeleteModal({ isOpen: true, id });
  };

  const confirmDelete = () => {
    if (deleteModal.id) {
      remove(deleteModal.id);
      if (selectedId === deleteModal.id) setSelectedId(null);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (isLoading) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.pageHeader}>
          <Skeleton variant="text" width={200} height={40} />
          <Skeleton variant="text" width={300} height={20} />
        </div>
        <div className={styles.container}>
          <div className={styles.sidebar}>
            <div style={{ padding: "16px" }}><Skeleton variant="rectangular" height={36} /></div>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{ padding: "16px", borderBottom: "1px solid #f1f5f9" }}>
                <Skeleton variant="text" width="60%" height={24} />
                <Skeleton variant="text" width="90%" height={16} />
              </div>
            ))}
          </div>
          <div className={styles.detailView}>
            <div style={{ padding: "40px" }}>
              <Skeleton variant="rectangular" width="100%" height={200} style={{ borderRadius: 12 }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
       {/* Standalone Page Header */}
       <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>{t("admin.cms.messages.title", "Client Messages")}</h1>
          <p className={styles.pageSubtitle}>{t("admin.cms.messages.subtitle", "Review and respond to client inquiries and contact forms.")}</p>
        </div>
      </div>

      <div className={styles.container}>
        {/* Sidebar */}
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <div className={styles.searchWrapper}>
              <Search size={14} className={styles.searchIcon} />
              <input 
                className={styles.searchInput}
                placeholder={t("admin.cms.messages.search_ph", "Search by name, email or message...")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className={styles.filterTabs}>
              <button className={`${styles.filterBtn} ${filter === "all" ? styles.activeFilter : ""}`} onClick={() => setFilter("all")}>
                {t("admin.cms.messages.all", "All")}
              </button>
              <button className={`${styles.filterBtn} ${filter === "unread" ? styles.activeFilter : ""}`} onClick={() => setFilter("unread")}>
                {t("admin.cms.messages.unread", "Unread")}
              </button>
              {MARKERS.map(m => (
                <button 
                  key={m.id} 
                  className={`${styles.filterBtn} ${filter === m.id ? styles.activeFilter : ""}`} 
                  onClick={() => setFilter(m.id)}
                >
                  {t(`admin.cms.messages.${m.labelKey}`, m.id)}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.sortWrapper}>
            <ArrowUpDown size={12} className={styles.sortLabelIcon} />
            <span className={styles.sortLabel}>SORT BY:</span>
            <select className={styles.sortSelect} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Sender Name</option>
              <option value="marker">Marker Category</option>
              <option value="unread">Unread First</option>
            </select>
          </div>

          <div className={styles.messageList}>
            {processedMessages.length === 0 ? (
              <div className={styles.noMessages}>{t("admin.cms.messages.no_messages", "No messages found.")}</div>
            ) : (
              processedMessages.map(m => {
                const activeMarker = MARKERS.find(mark => mark.id === m.mark);
                return (
                  <div 
                    key={m.id} 
                    className={`${styles.messageItem} ${selectedId === m.id ? styles.selectedItem : ""}`}
                    onClick={() => handleSelect(m)}
                  >
                    {!m.seen && <div className={styles.unreadDot} />}
                    <div className={styles.itemHeader}>
                      <span className={styles.senderName}>{m.full_name || "Anonymous"}</span>
                      <span className={styles.timestamp}>{formatDate(m.created_at)}</span>
                    </div>
                    <p className={styles.snippet}>{m.message}</p>
                    <div className={styles.itemIcons}>
                      {activeMarker && (() => {
                        const MarkerIcon = activeMarker.icon;
                        return (
                          <div className={`${styles.markerBadge} ${activeMarker.className}`}>
                            <MarkerIcon size={10} /> {t(`admin.cms.messages.${activeMarker.labelKey}`, activeMarker.id)}
                          </div>
                        );
                      })()}
                      {!m.seen && <Mail size={12} color="#3b82f6" />}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Detail View */}
        <div className={styles.detailView}>
          {selectedMsg ? (
            <>
              <div className={styles.detailHeader}>
                <div>
                  <h2 className={styles.senderTitle}>{selectedMsg.full_name || "Anonymous"}</h2>
                  <div className={styles.senderMeta}>
                    <div className={styles.metaItem}><Mail size={14} /> {selectedMsg.email_address}</div>
                    {selectedMsg.phone_number && <div className={styles.metaItem}><Phone size={14} /> {selectedMsg.phone_number}</div>}
                    <div className={styles.metaItem}><Clock size={14} /> {formatDate(selectedMsg.created_at)}</div>
                  </div>
                </div>
                <div className={styles.detailActions}>
                  <div className={styles.markerDropdown} ref={markerRef}>
                    <button 
                      className={`${styles.actionBtn} ${selectedMsg.mark ? styles.starBtnActive : ""}`}
                      onClick={() => setMarkerMenuOpen(!markerMenuOpen)}
                      title="Set Status Marker"
                    >
                      {(() => {
                        const marker = MARKERS.find(m => m.id === selectedMsg.mark);
                        const ActiveIcon = marker ? marker.icon : Flag;
                        return <ActiveIcon size={18} />;
                      })()}
                      <ChevronDown size={12} style={{ marginLeft: 4 }} />
                    </button>
                    {markerMenuOpen && (
                      <div className={styles.markerMenu}>
                        <button className={`${styles.markerOption} ${!selectedMsg.mark ? styles.activeMarker : ""}`} onClick={() => setMarker(selectedMsg.id, null)}>
                          <Check size={14} /> No Marker
                        </button>
                        {MARKERS.map(m => {
                          const MIcon = m.icon;
                          return (
                            <button key={m.id} className={`${styles.markerOption} ${selectedMsg.mark === m.id ? styles.activeMarker : ""}`} onClick={() => setMarker(selectedMsg.id, m.id)}>
                              <MIcon size={14} color={m.color} /> {t(`admin.cms.messages.${m.labelKey}`, m.id)}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => handleDelete(selectedMsg.id)}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className={styles.messageBody}>{selectedMsg.message}</div>
              <div className={styles.replyArea}>
                <a 
                  href={`mailto:${selectedMsg.email_address}?subject=Response from DentQ Support&body=Hello ${selectedMsg.full_name},%0D%0A%0D%0A Regarding your message: "${selectedMsg.message.substring(0, 50)}..."%0D%0A%0D%0A`}
                  className={styles.replyBtn}
                >
                  <ArrowUpRight size={18} /> {t("admin.cms.messages.reply", "Reply via Email")}
                </a>
              </div>
            </>
          ) : (
            <div className={styles.emptyState}>
              <Inbox size={48} strokeWidth={1} />
              <p>{t("admin.cms.messages.empty_selection", "Select a message to view details")}</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={confirmDelete}
        title={t("admin.cms.messages.delete_title", "Delete Message?")}
        message={t("admin.cms.messages.delete_confirm", "Are you sure you want to delete this message? This action cannot be undone.")}
        confirmText={t("common.delete", "Delete")}
        cancelText={t("common.cancel", "Cancel")}
        type="danger"
      />
    </div>
  );
};

export default ClientMsgsViewer;
