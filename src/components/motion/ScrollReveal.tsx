import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface ScrollRevealProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  width?: "fit-content" | "100%";
  delay?: number;
  staggerChildren?: boolean;
  staggerDelay?: number;
}

export function ScrollReveal({ 
  children, 
  width = "100%", 
  className,
  delay = 0,
  staggerChildren = false,
  staggerDelay = 0.1,
  ...props 
}: ScrollRevealProps) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const containerVariants = {
    hidden: { 
      opacity: prefersReducedMotion ? 1 : 0, 
      y: prefersReducedMotion ? 0 : 24,
      filter: prefersReducedMotion ? 'blur(0px)' : 'blur(10px)'
    },
    visible: { 
      opacity: 1, 
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number], // Custom ease-out curve (similar to Vercel/Linear)
        delay: delay,
        ...(staggerChildren && {
          staggerChildren: staggerDelay
        })
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10%" }}
      className={cn(className)}
      style={{ width }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function ScrollRevealItem({ children, className, ...props }: HTMLMotionProps<"div">) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const itemVariants = {
    hidden: { 
      opacity: prefersReducedMotion ? 1 : 0, 
      y: prefersReducedMotion ? 0 : 20,
      filter: prefersReducedMotion ? 'blur(0px)' : 'blur(8px)'
    },
    visible: { 
      opacity: 1, 
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number]
      }
    }
  };

  return (
    <motion.div variants={itemVariants} className={className} {...props}>
      {children}
    </motion.div>
  );
}
