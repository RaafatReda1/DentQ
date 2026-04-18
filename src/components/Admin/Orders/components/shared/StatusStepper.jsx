import React from 'react';
import { ORDER_STATUSES } from '../../constants/orderStatuses';
import { Check } from 'lucide-react';
import styles from './StatusStepper.module.css';

/**
 * Visual pipeline stepper using CSS Modules.
 */
const StatusStepper = ({ currentStatus, onStatusClick }) => {
    const steps = ORDER_STATUSES.filter(s => s.id !== 'cancelled');
    const currentIndex = steps.findIndex(s => s.id === currentStatus);
    const isCancelled = currentStatus === 'cancelled';

    if (isCancelled) return <div className={styles.cancelledMsg}>This order has been CANCELLED</div>;

    return (
        <div className={styles.stepper}>
            {steps.map((step, i) => {
                const isPast = i < currentIndex;
                const isCurrent = i === currentIndex;
                
                return (
                    <React.Fragment key={step.id}>
                        <div 
                            onClick={() => onStatusClick(step.id)} 
                            className={`${styles.step} ${isPast ? styles.past : ''} ${isCurrent ? styles.current : ''}`}
                        >
                            <div className={styles.bubble}>
                                {isPast ? <Check size={18} /> : <span>{i + 1}</span>}
                            </div>
                            <span className={styles.label}>{step.label}</span>
                        </div>
                        {i < steps.length - 1 && (
                            <div className={`${styles.line} ${isPast ? styles.active : ''}`} />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default StatusStepper;
