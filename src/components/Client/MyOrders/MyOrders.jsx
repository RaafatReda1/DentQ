import React, { useEffect, useState, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Package, ArrowLeft } from 'lucide-react';
import { supabase } from '../../../utils/SupabaseClient';
import { userContext, productsContext } from '../../../utils/AppContexts';
import { navigateToProductPage, toggleOrderExpansion } from './Actions';
import OrderCard from './SubComponents/OrderCard';
import LoadingSkeleton from './SubComponents/LoadingSkeleton';
import EmptyState from './SubComponents/EmptyState';
import GuestWarningBanner from '../../Shared/GuestWarningBanner/GuestWarningBanner';
import styles from './MyOrders.module.css';

const MyOrders = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user] = useContext(userContext);
  const [products] = useContext(productsContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState(new Set());

  // Fetch ONLY user's orders from database
  useEffect(() => {
    const fetchOrders = async () => {
      // Don't fetch if no user
      if (!user?.id && !user?.guest_id) {
        setLoading(false);
        return;
      }

      try {
        // Build query with user filter FIRST to only fetch user's orders
        const query = supabase
          .from("Orders")
          .select("*, Order_items (*)")
          .order("created_at", { ascending: false });

        // Apply user filter - CRITICAL: only fetch this user's orders
        const userFilter = user.id
          ? query.eq("client_id", user.id)
          : query.eq("guest_id", user.guest_id);

        const { data, error } = await userFilter;

        if (error) throw error;
        setOrders(data || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  // Enrich orders with product data
  const enrichedOrders = useMemo(() => {
    if (!products?.productsList?.length || !orders.length) return orders;

    return orders.map(order => ({
      ...order,
      Order_items: order.Order_items?.map(item => ({
        ...item,
        product: products.productsList.find(p => p.id === item.product_id) || null
      })) || []
    }));
  }, [orders, products]);

  // Loading state
  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <Header title={t('navbar.my_orders')} subtitle={t('orders.loading')} onBack={() => navigate(-1)} />
        <div className={styles.content}><LoadingSkeleton /></div>
      </div>
    );
  }

  // Main render
  return (
    <div className={styles.pageContainer}>
      <Header
        title={t('navbar.my_orders')}
        subtitle={enrichedOrders.length > 0 ? `${enrichedOrders.length} ${enrichedOrders.length === 1 ? t('orders.order') : t('orders.orders')}` : ''}
        badge={enrichedOrders.length}
        onBack={() => navigate(-1)}
      />

      <div className={styles.content}>
        {enrichedOrders.length === 0 ? (
          <EmptyState />
        ) : (
          <div className={styles.ordersList}>
            {enrichedOrders.map(order => (
              <OrderCard
                key={order.id}
                order={order}
                isExpanded={expandedOrders.has(order.id)}
                onToggle={() => toggleOrderExpansion(order.id, expandedOrders, setExpandedOrders)}
                onNavigateToProduct={(product) => navigateToProductPage(navigate, product)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Header component to reduce duplication
const Header = ({ title, subtitle, badge, onBack }) => {
  const { t } = useTranslation();
  return (
    <div className={styles.headerSection}>
      <div className={styles.headerContent}>
        <button className={styles.backBtn} onClick={onBack}>
          <ArrowLeft size={20} />
          <span>{t("product_page.back") || "Back"}</span>
        </button>
        <div className={styles.titleWrapper}>
          <div className={styles.iconWrapper}>
            <Package className={styles.orderIcon} size={32} />
            {badge > 0 && <span className={styles.orderBadge}>{badge}</span>}
          </div>
          <div>
            <h1 className={styles.title}>{title || 'My Orders'}</h1>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
