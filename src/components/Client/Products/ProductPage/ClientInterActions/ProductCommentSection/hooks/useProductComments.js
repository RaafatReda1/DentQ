import { useState, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import { userContext } from "../../../../../../../utils/AppContexts";
import { fetchUserProfiles, updateCommentsInDB } from "../utils/commentService";
import "react-confirm-alert/src/react-confirm-alert.css";
import { confirmAlert } from "react-confirm-alert";

export const useProductComments = (product) => {
  const { t } = useTranslation();
  const [user] = useContext(userContext);
  const [comments, setComments] = useState(product.comments || []); //stores the comments from the realtime comments recieved from the parent
  const [loading, setLoading] = useState(false); //set a loading state which is true when a comment is being added to DB
  const [editingCommentId, setEditingCommentId] = useState(null); //stores the comment id of the comment being edited
  const [userProfiles, setUserProfiles] = useState({}); //stores the profiles of the users who commented (from Clients table)

  // Sync comments if product updates (e.g. real-time)
  useEffect(() => {
    setComments(product.comments || []);
  }, [product.comments]);

  // Fetch profiles when comments change
  useEffect(() => {
    const loadProfiles = async () => {
      const clientIds = comments.map((c) => c.clientId);
      const { data, error } = await fetchUserProfiles(clientIds); //implented function from commentService that fetches user profiles who commented from Clients table returns {id: "client_id", fullName: "name", avatarUrl: "url" }

      if (error) {
        console.log("error Loading profiles:", error);
      } else if (data) {
        //data from the DB is fetched as an object of keys (client_id) and values (name and avatarUrl)
        const profilesMap = {};
        data.forEach((profile) => {
          profilesMap[profile.id] = profile; //in profilesMap object store the values for each profile (Name, Url) in a key named (that profileId)
        });
        setUserProfiles((prev) => ({ ...prev, ...profilesMap })); //then store this object in userProfiles
      }
    };

    loadProfiles();
  }, [comments]); //runs when comments change

  const addComment = async (text) => {
    if (!text?.trim()) return; //if text.trim() === null or "" then return and don't proceed
    setLoading(true);

    const newComment = {
      id: crypto.randomUUID(),
      clientId: user.id || "guest",
      clientName: user.fullName || "User",
      avatarUrl: user.avatarUrl,
      comment: text,
      date: new Date().toISOString(),
    };

    const updatedComments = [...comments, newComment];
    setComments(updatedComments); // Optimistic

    const { error } = await updateCommentsInDB(product.id, updatedComments); //another function from commentService that uploads the new comment to the database
    if (error) {
      console.error("Error adding comment:", error);
      toast.error(t("comments.failed_msg"));
      setComments(comments); // Revert
    } else {
      toast.success(t("comments.success_msg") || "Comment posted!");
    }
    setLoading(false);
    return !error;
  };

  const deleteComment = async (commentId) => {
    confirmAlert({//this's a preformed component in "react-confirm-alert" 
      title: t("comments.delete_title"),
      message: t("comments.delete_msg"),
      buttons: [
        {
          label: t("comments.yes"),
          onClick: async () => {
            const updatedComments = comments.filter((c) => c.id !== commentId);
            const oldComments = [...comments];

            setComments(updatedComments); // Optimistic

            const { error } = await updateCommentsInDB(
              product.id,
              updatedComments
            );
            if (error) {
              console.error("Error deleting comment:", error);
              toast.error(t("comments.failed_msg"));
              setComments(oldComments);
            } else {
              toast.success(t("comments.deleted_msg") || "Comment deleted");
            }
          },
        },
        {
          label: t("comments.no"),
          onClick: () => console.log("Delete comment is Cancelled"),
        },
      ],
    });
  };

  const editComment = async (commentId, newText) => {
    const updatedComments = comments.map((c) => {
      if (c.id === commentId) {
        return {
          ...c,
          comment: newText,
          updatedAt: new Date().toISOString(),
        };
      }
      return c;
    });

    const oldComments = [...comments];
    setComments(updatedComments); // Optimistic
    setEditingCommentId(null);

    const { error } = await updateCommentsInDB(product.id, updatedComments);
    if (error) {
      console.error("Error editing comment:", error);
      toast.error(t("comments.failed_msg"));
      setComments(oldComments);
    } else {
      toast.success(t("comments.updated_msg") || "Comment updated");
    }
  };

  return {
    comments,
    loading,
    userProfiles,
    user,
    editingCommentId,
    setEditingCommentId,
    addComment,
    deleteComment,
    editComment,
    t,
  };
};
