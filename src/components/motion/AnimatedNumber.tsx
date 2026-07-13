import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";
import { cn } from "../../lib/utils";

interface AnimatedNumberProps {
  value: number;
  className?: string;
  format?: "number" | "currency" | "compact";
  prefix?: string;
  suffix?: string;
  decimals?: number;
  padZero?: boolean;
}

export function AnimatedNumber({
  value,
  className,
  format = "number",
  prefix = "",
  suffix = "",
  decimals = 0,
  padZero = false,
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
    mass: 1,
  });
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [motionValue, isInView, value]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) {
        let formattedValue = "";
        
        if (padZero && latest < 10) {
          formattedValue = Math.floor(latest).toString().padStart(2, "0");
        } else {
          const formatter = new Intl.NumberFormat("en-US", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
            notation: format === "compact" ? "compact" : "standard",
          });
          formattedValue = formatter.format(latest);
        }

        if (format === "currency") {
          formattedValue = "$" + formattedValue;
        }

        ref.current.textContent = prefix + formattedValue + suffix;
      }
    });
  }, [springValue, format, decimals, prefix, suffix, padZero]);

  return <span ref={ref} className={cn("tabular-nums", className)} />;
}
