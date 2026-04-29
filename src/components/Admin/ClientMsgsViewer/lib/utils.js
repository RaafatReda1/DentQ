export const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString(undefined, { 
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
  });
};
