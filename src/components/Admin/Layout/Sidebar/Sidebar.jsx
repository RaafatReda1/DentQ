import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, ShoppingBag, Truck, PieChart, Settings, Home } from 'lucide-react';
import styles from './Sidebar.module.css';

const Sidebar = () => {
    const { t } = useTranslation();

    const navLinks = [
        { path: '/admin', icon: <LayoutDashboard size={22} />, label: t('admin.sidebar.dashboard'), end: true },
        { path: '/admin/products', icon: <ShoppingBag size={22} />, label: t('admin.sidebar.products'), end: false },
        { path: '/admin/orders', icon: <Truck size={22} />, label: t('admin.sidebar.orders'), end: false },
        { path: '/admin/marketing', icon: <PieChart size={22} />, label: t('admin.sidebar.marketing'), end: false },
        { path: '/admin/cms', icon: <Settings size={22} />, label: t('admin.sidebar.cms'), end: false },
    ];

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logoContainer}>
                {/* Simulated Logo matching DentQ colors */}
                <div className={styles.logoCircle}>DQ</div>
                <h2 className={styles.logoText}>DentQ</h2>
            </div>

            <nav className={styles.navMenu}>
                {navLinks.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        end={link.end}
                        className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
                    >
                        <span className={styles.icon}>{link.icon}</span>
                        <span className={styles.label}>{link.label}</span>
                        <span className={styles.notch}></span>
                    </NavLink>
                ))}
            </nav>

            <div className={styles.bottomLink}>
                <Link to="/" className={styles.navItem}>
                    <span className={styles.icon}><Home size={22} /></span>
                    <span className={styles.label}>Back to Store</span>
                </Link>
            </div>
        </aside>
    );
};

export default Sidebar;
