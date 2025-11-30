'use client';

import { motion, useScroll, useTransform } from 'framer-motion';

export default function ParallaxFloating({ children, speed = 0.2, className = '', zIndex = 0 }) {
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 1000], [0, 100 * speed]);

    return (
        <motion.div
            style={{ y, zIndex }}
            className={`pointer-events-none ${className}`}
        >
            {children}
        </motion.div>
    );
}
