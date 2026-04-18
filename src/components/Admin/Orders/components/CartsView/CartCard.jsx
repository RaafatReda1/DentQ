import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, User, ExternalLink, MessageCircle, Mail, MapPin, Package, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import OrderItemsPopup from '../shared/OrderItemsPopup';
import ClientDetailModal from '../shared/ClientDetailModal';
import RenderProductNameOrDesc from '../../../../../utils/RenderProductNameOrDesc';
import styles from './CartCard.module.css';

const CartCard = ({ cart }) => {
    const { t, i18n } = useTranslation();
    const [showDetail, setShowDetail] = useState(false);
    const [showClient, setShowClient] = useState(false);

    const client = cart.Clients || {};
    const items = cart.resolvedItems || [];
    const isGuest = !cart.client_id;

    const handleWhatsApp = (e) => {
        e.stopPropagation();
        const msg = encodeURIComponent(`Hi ${client.fullName || ''}, we noticed you left some items in your cart! Can we help you?`);
        window.open(`https://wa.me/${client.phone}?text=${msg}`, '_blank');
    };

    return (
        <div className={styles.card} onClick={() => setShowDetail(true)}>
            <div className={styles.header}>
                <div 
                    className={`${styles.avatar} ${isGuest ? styles.guestAvatar : ''}`} 
                    onClick={(e) => { e.stopPropagation(); setShowClient(true); }}
                    title={t('admin.carts.view_client', 'View Client Details')}
                >
                    {client.avatarUrl ? <img src={client.avatarUrl} alt="" /> : <User size={18} />}
                </div>
                <div className={styles.userMeta} onClick={(e) => { e.stopPropagation(); setShowClient(true); }}>
                    <div className={styles.nameRow}>
                        <p className={styles.userName}>{client.fullName || t('admin.carts.guest', 'Guest User')}</p>
                        {isGuest && <span className={styles.guestBadge}>GUEST</span>}
                    </div>
                    {client.email && <p className={styles.email}><Mail size={10} /> {client.email}</p>}
                </div>
                <div className={styles.financials}>
                    <div className={styles.totalBadge}>{cart.totalValue.toLocaleString()} EGP</div>
                    <div className={styles.profitBadge}>
                        <TrendingUp size={10} /> {t('admin.carts.profit_label', 'Profit')}: {cart.totalProfit.toLocaleString()} EGP
                    </div>
                </div>
            </div>

            <div className={styles.quickLook}>
                <div className={styles.lookTitle}>
                    <Package size={12} /> <span>{t('admin.carts.containing', 'Containing:')}</span>
                </div>
                <div className={styles.previewList}>
                    {items.slice(0, 3).map((item, idx) => (
                        <div key={idx} className={styles.previewItem}>
                            <span className={styles.dot}>•</span>
                            <span className={styles.pName}>{RenderProductNameOrDesc(item.product, 'name', i18n.language)}</span>
                            <span className={styles.pQty}>x{item.quantity}</span>
                        </div>
                    ))}
                    {items.length > 3 && <p className={styles.more}>+ {items.length - 3} {t('common.more', 'more items')}</p>}
                </div>
            </div>

            <div className={styles.footer}>
                <div className={styles.locality}>
                    <MapPin size={12} /> <span>{client.address || 'Unknown Location'}</span>
                </div>
                <div className={styles.temp}>
                    <Clock size={12} /> {format(new Date(cart.updated_at), 'MMM d, HH:mm')}
                </div>
            </div>

            <div className={styles.actions}>
                {client.phone && (
                    <button onClick={handleWhatsApp} className={styles.whatsappBtn}>
                        <MessageCircle size={14} /> <span>{t('admin.carts.recover', 'Recover')}</span>
                    </button>
                )}
                <button className={styles.inspectBtn} onClick={() => setShowDetail(true)}>
                    {t('admin.carts.inspect', 'Inspect')} <ExternalLink size={12} />
                </button>
            </div>

            <OrderItemsPopup isOpen={showDetail} onClose={() => setShowDetail(false)} items={items} title={t('admin.carts.modal_title', 'Cart Breakdown')} />
            <ClientDetailModal isOpen={showClient} onClose={() => setShowClient(false)} client={client} isGuest={isGuest} />
        </div>
    );
};

export default CartCard;
