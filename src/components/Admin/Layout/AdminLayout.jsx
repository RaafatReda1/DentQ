import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar/Sidebar';
import Header from './Header/Header';
import useUserData from '../../Storage/UserDataStorage';
import styles from './AdminLayout.module.css';

const AdminLayout = () => {
    const { user } = useUserData();

    if (user.loadingState) return <div>Loading...</div>;
    
    // Security layer 
    if (user.type !== 'admin') {
        return <Navigate to="/" />;
    }

    return (
        <div className={styles.adminWrapper}>
            <Sidebar />
            <div className={styles.mainContainer}>
                <Header />
                <main className={styles.contentArea}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
