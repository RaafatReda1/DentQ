import { useState, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import { userContext } from "../../../../../../../utils/AppContexts";
import { fetchUserProfiles, updateCommentsInDB } from "../utils/commentService";

export const useProductComments = (product) => {
    const { t } = useTranslation();
    const [user] = useContext(userContext);
    const [comments, setComments] = useState(product.comments || []);
    const [loading, setLoading] = useState(false);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [userProfiles, setUserProfiles] = useState({});

    // Sync comments if product updates (e.g. real-time)
    useEffect(() => {
        setComments(product.comments || []);
    }, [product.comments]);

    // Fetch profiles when comments change
    useEffect(() => {
        const loadProfiles = async () => {
            const clientIds = comments.map(c => c.clientId);
            const { data, error } = await fetchUserProfiles(clientIds); //implented function from commentService that fetches user profiles who commented from Clients table returns {id: "client_id", fullName: "name", avatarUrl: "url" }

            if (data) {
                const profilesMap = {};
                data.forEach(profile => {
                    profilesMap[profile.id] = profile;
                });
                setUserProfiles(prev => ({ ...prev, ...profilesMap }));
            }
        };

        loadProfiles();
    }, [comments]);


    const addComment = async (text) => {
        if (!text.trim()) return;
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
        if (!window.confirm(t("comments.confirm_delete_msg"))) return;

        const updatedComments = comments.filter(c => c.id !== commentId);
        const oldComments = [...comments];

        setComments(updatedComments); // Optimistic

        const { error } = await updateCommentsInDB(product.id, updatedComments);
        if (error) {
            console.error("Error deleting comment:", error);
            toast.error(t("comments.failed_msg"));
            setComments(oldComments);
        } else {
            toast.success(t("comments.deleted_msg") || "Comment deleted");
        }
    };

    const editComment = async (commentId, newText) => {
        const updatedComments = comments.map(c => {
            if (c.id === commentId) {
                return {
                    ...c,
                    comment: newText,
                    updatedAt: new Date().toISOString()
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
        t
    };
};
