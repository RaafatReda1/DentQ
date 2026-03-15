import React, { useEffect, useRef, useState } from "react";

const AnimatedCounter = ({ end, duration = 2000, suffix = "+" }) => {
    const [count, setCount] = useState(0);
    const countRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (countRef.current) observer.observe(countRef.current);

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        let startTimestamp = null;
        let animationFrameId;

        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);

            const easeProgress = 1 - Math.pow(1 - progress, 4);

            setCount(Math.floor(easeProgress * end));

            if (progress < 1) {
                animationFrameId = window.requestAnimationFrame(step);
            } else {
                setCount(end); // ensure exact end text
            }
        };

        if (isVisible) {
            animationFrameId = window.requestAnimationFrame(step);
        }

        return () => {
            if (animationFrameId) window.cancelAnimationFrame(animationFrameId);
        };
    }, [end, duration, isVisible]);

    return <span ref={countRef}>{count}{suffix}</span>;
};

export default AnimatedCounter;
