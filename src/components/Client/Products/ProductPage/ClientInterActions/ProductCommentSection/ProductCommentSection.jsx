import React from "react";
import styles from "./ProductCommentSection.module.css";
import { useProductComments } from "./hooks/useProductComments";
import CommentItem from "./components/CommentItem";
import CommentForm from "./components/CommentForm";

const ProductCommentSection = ({ product }) => {
  const {
    comments,
    loading,
    userProfiles,
    user,
    addComment,
    deleteComment,
    editComment,
    t
  } = useProductComments(product);

  return (
    <div className={styles.sectionContainer} id="comment-section">
      <h3 className={styles.title}>{t("comments.title")} ({comments.length})</h3>

      <div className={styles.commentsList}>
        {comments.map((c) => (
          <CommentItem
            key={c.id || Math.random()}
            comment={c}
            user={user}
            userProfile={userProfiles[c.clientId]}
            t={t}
            onEdit={editComment}
            onDelete={deleteComment}
          />
        ))}
        {comments.length === 0 && <p style={{ color: '#999' }}>{t("comments.no_comments")}</p>}
      </div>

      <CommentForm
        onSubmit={addComment}
        loading={loading}
        t={t}
        user={user}
      />
    </div>
  );
};

export default ProductCommentSection;