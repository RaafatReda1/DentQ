import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './Pagination.module.css';

/**
 * Pagination — Shared page controls used by Table and Grid views.
 * 
 * Props:
 *   - currentPage (0-indexed)
 *   - totalCount (total items)
 *   - pageSize (items per page)
 *   - onPageChange(pageIndex) callback
 */
const Pagination = ({ currentPage, totalCount, pageSize, onPageChange }) => {
    const totalPages = Math.ceil(totalCount / pageSize);
    const from = currentPage * pageSize + 1;
    const to = Math.min((currentPage + 1) * pageSize, totalCount);

    if (totalCount === 0) return null;

    // Build page numbers array (show max 5 pages around current)
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        let start = Math.max(0, currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages - 1, start + maxVisible - 1);

        // Adjust start if we're near the end
        if (end - start < maxVisible - 1) {
            start = Math.max(0, end - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    };

    return (
        <div className={styles.pagination}>
            <span className={styles.info}>
                Showing {from}–{to} of {totalCount}
            </span>

            <div className={styles.controls}>
                <button
                    className={styles.pageBtn}
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                >
                    <ChevronLeft size={16} />
                    <span>Prev</span>
                </button>

                {getPageNumbers().map((page) => (
                    <button
                        key={page}
                        className={`${styles.pageBtn} ${styles.pageNum} ${page === currentPage ? styles.activePage : ''}`}
                        onClick={() => onPageChange(page)}
                    >
                        {page + 1}
                    </button>
                ))}

                <button
                    className={styles.pageBtn}
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages - 1}
                >
                    <span>Next</span>
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};

export default Pagination;
