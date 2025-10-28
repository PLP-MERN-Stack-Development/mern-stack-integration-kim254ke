// client/src/components/AnimatedCard.jsx
import React from "react";
import { motion } from "framer-motion";

export default function AnimatedCard({ children, className = "", i = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: i * 0.06 }}
      className={`card ${className}`}
    >
      {children}
    </motion.div>
  );
}
