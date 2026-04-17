import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, ShoppingBag, Truck, PieChart, Settings, Home, ChevronLeft, Boxes } from 'lucide-react';
import styles from './Sidebar.module.css';

const Sidebar = () => {
    const { t } = useTranslation();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const navLinks = [
        { path: '/admin', icon: <LayoutDashboard size={22} />, label: t('admin.sidebar.dashboard'), end: true },
        { path: '/admin/products', icon: <ShoppingBag size={22} />, label: t('admin.sidebar.products'), end: false },
        { path: '/admin/catalogs', icon: <Boxes size={22} />, label: t('admin.sidebar.catalogs'), end: false },
        { path: '/admin/orders', icon: <Truck size={22} />, label: t('admin.sidebar.orders'), end: false },
        { path: '/admin/marketing', icon: <PieChart size={22} />, label: t('admin.sidebar.marketing'), end: false },
        { path: '/admin/cms', icon: <Settings size={22} />, label: t('admin.sidebar.cms'), end: false },
    ];

    return (
        <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
            <div className={styles.logoContainer}>
                <div className={styles.logoWrapper}>
                    <img src="/logo.png" alt="DentQ" className={styles.logoImage} />
                </div>
                <button 
                    className={styles.toggleBtn} 
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    <ChevronLeft size={22} className={styles.toggleIcon} />
                </button>
            </div>

            <nav className={styles.navMenu}>
                {navLinks.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        end={link.end}
                        className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
                        title={isCollapsed ? link.label : ""}
                    >
                        <span className={styles.icon}>{link.icon}</span>
                        <span className={styles.label}>{link.label}</span>
                        <span className={styles.notch}></span>
                    </NavLink>
                ))}
            </nav>

            <div className={styles.bottomLink}>
                <Link to="/" className={styles.navItem} title={isCollapsed ? "Back to Store" : ""}>
                    <span className={styles.icon}><Home size={22} /></span>
                    <span className={styles.label}>Back to Store</span>
                </Link>
            </div>
        </aside>
    );
};

export default Sidebar;
