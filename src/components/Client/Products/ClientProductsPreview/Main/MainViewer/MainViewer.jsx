import { useEffect, useState } from "react";
import HeroSection from "../HeroSection/HeroSection";
import Slider from "../Slider/Slider";
import fetchBanners, { fetchCategories } from "../HeroSection/Actions";

const MainViewer = () => {

  // state for banners and categories
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);

  // get main banner
  const mainBanner = banners.find(b => b.slug === "main");

  // get banners except the main one
  const otherBanners = banners.filter(b => b.slug !== "main");

  // create set of category IDs already used by banners
  const usedCatIds = new Set(banners.map(b => b.related_cat_id));

  // categories that are NOT linked to any banner
  const catsWithoutBanner = categories.filter(
    cat => !usedCatIds.has(cat.id)
  );

  useEffect(() => {

    // load banners
    const loadBanners = async () => {
      const data = await fetchBanners();
      if (data?.length) setBanners(data);
    };

    // load categories
    const loadCategories = async () => {
      const data = await fetchCategories();
      if (data?.length) setCategories(data);
    };

    loadBanners();
    loadCategories();

  }, []);

  return (
    <>
      {/* Main banner */}
      <HeroSection Banner={mainBanner} />
      <Slider CatId={mainBanner?.related_cat_id} />

      {/* Other banners */}
      {otherBanners.map(banner => (
        <div key={banner.id}>
          <HeroSection Banner={banner} />
          <Slider CatId={banner.related_cat_id} />
        </div>
      ))}

      {/* Categories without banners */}
      {catsWithoutBanner.map(cat => (
        <Slider key={cat.id} CatId={cat.id} />
      ))}
    </>
  );
};

export default MainViewer;