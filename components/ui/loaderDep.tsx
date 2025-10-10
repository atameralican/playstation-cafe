"use client";

import { motion, useAnimationControls, Variants } from "motion/react";
import { useEffect, useRef } from "react";

interface LoaderDeplasmanProps {
  visible?: boolean;
}

export default function LoaderDeplasman({ visible = true }: LoaderDeplasmanProps) {
  const c1 = useAnimationControls();
  const l1 = useAnimationControls();
  const l2 = useAnimationControls();
  const r1 = useAnimationControls();
  const tri = useAnimationControls();
  
  const isCancelledRef = useRef(false);
  const isRunningRef = useRef(false);

  useEffect(() => {
    isCancelledRef.current = false;

    if (!visible) {
      c1.stop();
      l1.stop();
      l2.stop();
      r1.stop();
      tri.stop();
      return;
    }

    if (isRunningRef.current) return;

    const runSequence = async () => {
      isRunningRef.current = true;

      try {
        while (!isCancelledRef.current) {
          await Promise.all([
            c1.start("hidden"),
            l1.start("hidden"),
            l2.start("hidden"),
            r1.start("hidden"),
            tri.start("hidden"),
          ]);

          if (isCancelledRef.current) break;

          await c1.start("visible");
          if (isCancelledRef.current) break;

          await l1.start("visible");
          if (isCancelledRef.current) break;

          await l2.start("visible");
          if (isCancelledRef.current) break;

          await r1.start("visible");
          if (isCancelledRef.current) break;

          await tri.start("visible");
          if (isCancelledRef.current) break;

          await new Promise(resolve => setTimeout(resolve, 300));
        }
      } catch (error) {
        console.log("Animation cancelled");
      } finally {
        isRunningRef.current = false;
      }
    };

    runSequence();

    return () => {
      isCancelledRef.current = true;
      isRunningRef.current = false;
      
      c1.stop();
      l1.stop();
      l2.stop();
      r1.stop();
      tri.stop();
    };
  }, [visible, c1, l1, l2, r1, tri]);

  if (!visible) return null;

  return (
    <div style={backdrop}>
      <motion.svg
        width="400"
        height="120"
        viewBox="0 0 400 120"
        style={svgStyle}
      >
        {/* yuvarlak */}
        <motion.circle
          cx="40"
          cy="60"
          r="25"
          stroke="#FF0000"
          variants={draw}
          initial="hidden"
          animate={c1}
          style={shape}
        />

        {/* X */}
        <motion.line
          x1="100"
          y1="35"
          x2="130"
          y2="85"
          stroke="#0070DD"
          variants={draw}
          initial="hidden"
          animate={l1}
          style={shape}
        />
        <motion.line
          x1="130"
          y1="35"
          x2="100"
          y2="85"
          stroke="#0070DD"
          variants={draw}
          initial="hidden"
          animate={l2}
          style={shape}
        />

        {/* kare */}
        <motion.rect
          width="50"
          height="50"
          x="160"
          y="35"
          rx="10"
          stroke="#FF00FF"
          variants={draw}
          initial="hidden"
          animate={r1}
          style={shape}
        />

        {/* ucgen */}
        <motion.path
          d="M260 35 L235 85 L285 85 Z"
          stroke="#00FF00"
          variants={draw}
          initial="hidden"
          animate={tri}
          style={shape}
        />
      </motion.svg>
    </div>
  );
}

/* Styles */
const backdrop: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 50,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backdropFilter: "blur(8px)",
  backgroundColor: "rgba(0,0,0,0.3)",
};

const svgStyle: React.CSSProperties = {
  maxWidth: "300px",
  maxHeight: "120px",
};

const shape: React.CSSProperties = {
  strokeWidth: 6,
  strokeLinecap: "round",
  fill: "transparent",
};

/* Variants */
const draw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { type: "spring", duration: 0.5, bounce: 0 },
      opacity: { duration: 0.5 },
    },
  },
};