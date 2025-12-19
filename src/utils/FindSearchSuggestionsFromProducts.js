const FindSearchSuggestionsFromProducts = (products, searchQuery) => {
  if (!searchQuery.trim()) {
    return products;
  }

  const query = searchQuery.toLowerCase();

  return products.filter((product) => {
    return (
      product.nameAr?.toLowerCase().includes(query) ||
      product.nameEn?.toLowerCase().includes(query) ||
      product.descriptionAr?.toLowerCase().includes(query) ||
      product.descriptionEn?.toLowerCase().includes(query)
    );
  });
};
export default FindSearchSuggestionsFromProducts;