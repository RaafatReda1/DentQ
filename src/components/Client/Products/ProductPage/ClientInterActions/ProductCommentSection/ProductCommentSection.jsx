import React, { useState, useContext, useEffect } from "react";
import styles from "./ProductCommentSection.module.css";
import { userContext } from "../../../../../../utils/AppContexts";
import { supabase } from "../../../../../../utils/SupabaseClient";

const ProductCommentSection = ({ product }) => {
  const [user] = useContext(userContext);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(product.comments || []);
  const [loading, setLoading] = useState(false);

  // Sync comments if product updates
  useEffect(() => {
    setComments(product.comments || []);
  }, [product.comments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setLoading(true);

    const newComment = {
      id: crypto.randomUUID(),
      clientId: user.id,
      clientName: user.fullName || "User",
      avatarUrl: user.avatarUrl, // Might be empty
      comment: commentText,
      date: new Date().toISOString(),
    };

    // Optimistic update
    const updatedComments = [...comments, newComment];
    setComments(updatedComments);

    // Update DB
    const { error } = await supabase
      .from("Products")
      .update({ comments: updatedComments })
      .eq("id", product.id);

    if (error) {
      console.error("Error updating comments:", error);
      alert("Failed to post comment.");
      setComments(comments); // Revert
    } else {
      setCommentText("");
    }
    setLoading(false);
  };

  return (
    <div className={styles.sectionContainer} id="comment-section">
      <h3 className={styles.title}>Comments ({comments.length})</h3>

      <div className={styles.commentsList}>
        {comments.map((c) => (
          <div key={c.id || Math.random()} className={styles.commentItem}>
            <img
              src={c.avatarUrl || "https://via.placeholder.com/40"}
              alt={c.clientName}
              className={styles.avatar}
              onError={(e) => e.currentTarget.src = "https://via.placeholder.com/40"}
            />
            <div className={styles.commentContent}>
              <div className={styles.header}>
                <span className={styles.clientName}>{c.clientName}</span>
                <span className={styles.date}>{new Date(c.date).toLocaleDateString()}</span>
              </div>
              <p className={styles.text}>{c.comment}</p>
            </div>
          </div>
        ))}
        {comments.length === 0 && <p style={{ color: '#999' }}>No comments yet. Be the first!</p>}
      </div>

      {(user.type === "client" || user.type === "admin") ? (
        <form className={styles.formContainer} onSubmit={handleSubmit}>
          <textarea
            className={styles.textarea}
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Posting..." : "Post Comment"}
          </button>
        </form>
      ) : (
        <div className={styles.signInMsg}>
          Please sign in to leave a comment.
        </div>
      )}
    </div>
  );
};

export default ProductCommentSection;