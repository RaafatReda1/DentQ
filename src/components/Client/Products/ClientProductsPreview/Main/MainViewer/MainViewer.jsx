import { useEffect, useState, useMemo } from "react";
import HeroSection from "../HeroSection/HeroSection";
import Slider from "../Slider/Slider";
import fetchBanners, { fetchCategories } from "../HeroSection/Actions";
import CategoriesPreview from "../CategoriesPreview/CategoriesPreview";
import { Loader2 } from "lucide-react";

const MainViewer = () => {
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    
    const loadContent = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const [bannersData, categoriesData] = await Promise.all([
          fetchBanners(),
          fetchCategories()
        ]);
        
        if (isMounted) {
          if (bannersData) setBanners(bannersData);
          if (categoriesData) setCategories(categoriesData);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error loading MainViewer content:", err);
          setError("Failed to load store content. Please try again.");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadContent();
    return () => { isMounted = false; };
  }, []);

  const { mainBanner, otherBanners } = useMemo(() => {
    const main = banners.find(b => b.slug === "main");
    const others = banners.filter(b => b.slug !== "main").sort((a,b) => a.id - b.id);
    return { mainBanner: main, otherBanners: others };
  }, [banners]);

  const catsWithoutBanner = useMemo(() => {
    const usedCatIds = new Set(banners.filter(b => b.related_cat_id).map(b => b.related_cat_id));
    return categories.filter(cat => 
      !cat.parent_id && 
      !usedCatIds.has(cat.id) &&
      cat.is_active !== false
    ).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  }, [categories, banners]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', color: 'var(--primary-hover, #0096c7)' }}>
        <Loader2 size={48} className="animate-spin" style={{ animation: 'spin 1.5s linear infinite' }} />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <p style={{ color: '#d9534f', marginBottom: '15px', fontWeight: '500' }}>{error}</p>
        <button onClick={() => window.location.reload()} style={{ padding: '10px 24px', cursor: 'pointer', background: 'var(--primary-hover, #0096c7)', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <CategoriesPreview categories={categories} />

      {/* Main banner */}
      {mainBanner && (
        <>
          <HeroSection Banner={mainBanner} />
          {mainBanner.related_cat_id && <Slider CatId={mainBanner.related_cat_id} />}
        </>
      )}

      {/* Other banners */}
      {otherBanners.map(banner => (
        <div key={banner.id}>
          <HeroSection Banner={banner} />
          {banner.related_cat_id && <Slider CatId={banner.related_cat_id} />}
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