import React, { useState, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { User } from "lucide-react";
import styles from "./ProductCommentSection.module.css";
import { userContext } from "../../../../../../utils/AppContexts";
import { supabase } from "../../../../../../utils/SupabaseClient";

const ProductCommentSection = ({ product }) => {
  const { t } = useTranslation();
  const [user] = useContext(userContext);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(product.comments || []);
  const [loading, setLoading] = useState(false);

  // Edit State
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [userProfiles, setUserProfiles] = useState({});

  // Sync comments if product updates
  useEffect(() => {
    setComments(product.comments || []);
  }, [product.comments]);

  // Fetch updated profiles for comment authors
  useEffect(() => {
    const fetchProfiles = async () => {
      const uniqueIds = [...new Set(comments.map(c => c.clientId).filter(id => id && id !== 'guest'))];

      if (uniqueIds.length === 0) return;

      const { data, error } = await supabase
        .from('Clients')
        .select('id, fullName, avatarUrl')
        .in('id', uniqueIds);

      if (data) {
        const profilesMap = {};
        data.forEach(profile => {
          profilesMap[profile.id] = profile;
        });
        setUserProfiles(prev => ({ ...prev, ...profilesMap }));
      }
    };

    if (comments.length > 0) {
      fetchProfiles();
    }
  }, [comments]);

  const updateCommentsInDB = async (updatedComments) => {
    const { error } = await supabase
      .from("Products")
      .update({ comments: updatedComments })
      .eq("id", product.id);

    if (error) {
      console.error("Error updating comments:", error);
      alert(t("comments.failed_msg"));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setLoading(true);

    const newComment = {
      id: crypto.randomUUID(),
      clientId: user.id || "guest", // fallback safely
      clientName: user.fullName || "User",
      avatarUrl: user.avatarUrl,
      comment: commentText,
      date: new Date().toISOString(),
    };

    const updatedComments = [...comments, newComment];
    setComments(updatedComments); // Optimistic

    const success = await updateCommentsInDB(updatedComments);
    if (!success) setComments(comments); // Revert
    else setCommentText("");

    setLoading(false);
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm(t("comments.confirm_delete_msg"))) return;

    const updatedComments = comments.filter(c => c.id !== commentId);
    const oldComments = [...comments];

    setComments(updatedComments); // Optimistic

    const success = await updateCommentsInDB(updatedComments);
    if (!success) setComments(oldComments);
  };

  const startEdit = (comment) => {
    setEditingCommentId(comment.id);
    setEditContent(comment.comment);
  };

  const saveEdit = async () => {
    const updatedComments = comments.map(c => {
      if (c.id === editingCommentId) {
        return {
          ...c,
          comment: editContent,
          updatedAt: new Date().toISOString() // optional: track edits
        };
      }
      return c;
    });

    const oldComments = [...comments];
    setComments(updatedComments); // Optimistic
    setEditingCommentId(null);

    const success = await updateCommentsInDB(updatedComments);
    if (!success) setComments(oldComments);
  };

  return (
    <div className={styles.sectionContainer} id="comment-section">
      <h3 className={styles.title}>{t("comments.title")} ({comments.length})</h3>

      <div className={styles.commentsList}>
        {comments.map((c) => {
          const profile = userProfiles[c.clientId];
          const displayAvatar = profile?.avatarUrl || c.avatarUrl;
          const displayName = profile?.fullName || c.clientName;

          return (
            <div key={c.id || Math.random()} className={styles.commentItem}>
              <div className={styles.avatarWrapper}>
                {displayAvatar ? (
                  <>
                    <img
                      src={displayAvatar}
                      alt={displayName}
                      className={styles.avatar}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling.style.display = 'flex';
                      }}
                    />
                    <div className={`${styles.avatar} ${styles.avatarPlaceholder}`} style={{ display: 'none' }}>
                      <User size={20} color="#666" />
                    </div>
                  </>
                ) : (
                  <div className={`${styles.avatar} ${styles.avatarPlaceholder}`}>
                    <User size={20} color="#666" />
                  </div>
                )}
              </div>
              <div className={styles.commentContent}>
                <div className={styles.header}>
                  <span className={styles.clientName}>{displayName}</span>
                  <span className={styles.date}>
                    {new Date(c.date).toLocaleDateString()}
                    {c.updatedAt && <span style={{ fontSize: '0.75rem', marginLeft: '5px' }}>({t("comments.updated")})</span>}
                  </span>
                </div>

                {editingCommentId === c.id ? (
                  <div className={styles.editForm}>
                    <textarea
                      className={styles.editTextarea}
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                    />
                    <div className={styles.editButtons}>
                      <button className={styles.saveBtn} onClick={saveEdit}>{t("comments.save")}</button>
                      <button className={styles.cancelBtn} onClick={() => setEditingCommentId(null)}>{t("comments.cancel")}</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className={styles.text}>{c.comment}</p>
                    {/* Actions: check if user owns comment */}
                    {user.id === c.clientId && (
                      <div className={styles.actions}>
                        <button className={styles.actionBtn} onClick={() => startEdit(c)}>{t("comments.edit")}</button>
                        <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => handleDelete(c.id)}>{t("comments.delete")}</button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
        {comments.length === 0 && <p style={{ color: '#999' }}>{t("comments.no_comments")}</p>}
      </div>

      {(user.type === "client" || user.type === "admin") ? (
        <form className={styles.formContainer} onSubmit={handleSubmit}>
          <textarea
            className={styles.textarea}
            placeholder={t("comments.placeholder")}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? t("comments.posting") : t("comments.post_btn")}
          </button>
        </form>
      ) : (
        <div className={styles.signInMsg}>
          {t("comments.signin_msg")}
        </div>
      )}
    </div>
  );
};

export default ProductCommentSection;