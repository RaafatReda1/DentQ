import React from "react";
import { useTranslation } from "react-i18next";
import { Inbox } from "lucide-react";

// Components
import SidebarHeader from "./components/SidebarHeader";
import MessageItem from "./components/MessageItem";
import MessageDetail from "./components/MessageDetail";
import ViewerSkeleton from "./components/ViewerSkeleton";
import ConfirmModal from "./components/ConfirmModal";

// Lib
import { useMessagesViewer } from "./lib/useMessagesViewer";
import { formatDate } from "./lib/utils";
import styles from "./ClientMsgsViewer.module.css";

const ClientMsgsViewer = () => {
  const { t } = useTranslation();
  const state = useMessagesViewer(styles);
  const { messages, isLoading, processedMessages, selectedId, search, setSearch, filter, setFilter, sortBy, setSortBy, markerMenuOpen, setMarkerMenuOpen, deleteModal, setDeleteModal, markerRef, handleSelect, handleSetMarker, confirmDelete, markers } = state;

  if (isLoading) return <ViewerSkeleton />;
  const selectedMsg = messages?.find(m => m.id === selectedId);

  return (
    <div className={styles.pageWrapper}>
      <Header t={t} styles={styles} />
      <div className={styles.container}>
        <div className={styles.sidebar}>
          <SidebarHeader search={search} setSearch={setSearch} filter={filter} setFilter={setFilter} sortBy={sortBy} setSortBy={setSortBy} markers={markers} />
          <div className={styles.messageList}>
            {processedMessages.length === 0 ? <div className={styles.noMessages}>{t("admin.cms.messages.no_messages")}</div> :
              processedMessages.map(m => <MessageItem key={m.id} message={m} isSelected={selectedId === m.id} onSelect={handleSelect} activeMarker={markers.find(mk => mk.id === m.mark)} formatDate={formatDate} />)}
          </div>
        </div>
        <div className={styles.detailView}>
          {selectedMsg ? <MessageDetail message={selectedMsg} markers={markers} markerMenuOpen={markerMenuOpen} setMarkerMenuOpen={setMarkerMenuOpen} markerRef={markerRef} onSetMarker={handleSetMarker} onDelete={(id) => setDeleteModal({ isOpen: true, id })} formatDate={formatDate} /> :
            <div className={styles.emptyState}><Inbox size={48} strokeWidth={1} /><p>{t("admin.cms.messages.empty_selection")}</p></div>}
        </div>
      </div>
      <ConfirmModal isOpen={deleteModal.isOpen} onClose={() => setDeleteModal({ isOpen: false, id: null })} onConfirm={confirmDelete} title={t("admin.cms.messages.delete_title")} message={t("admin.cms.messages.delete_confirm")} confirmText={t("common.delete")} cancelText={t("common.cancel")} />
    </div>
  );
};

const Header = ({ t, styles }) => (
  <div className={styles.pageHeader}>
    <div><h1 className={styles.pageTitle}>{t("admin.cms.messages.title")}</h1><p className={styles.pageSubtitle}>{t("admin.cms.messages.subtitle")}</p></div>
  </div>
);

export default ClientMsgsViewer;
