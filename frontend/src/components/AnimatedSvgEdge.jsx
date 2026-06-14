import React from "react";
import { getBezierPath } from "reactflow";

export default function AnimatedSvgEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <defs>
        <filter id="edge-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="edge-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#c084fc" />
        </linearGradient>
      </defs>

      {/* Outer thick neon glow path */}
      <path
        d={edgePath}
        fill="none"
        stroke="url(#edge-gradient)"
        strokeWidth="6"
        className="opacity-20 cursor-pointer pointer-events-auto"
        filter="url(#edge-glow)"
      />

      {/* Intermediary neon accent line */}
      <path
        d={edgePath}
        fill="none"
        stroke="#c084fc"
        strokeWidth="3"
        className="opacity-40 cursor-pointer pointer-events-auto"
      />

      {/* Main interactive connection path */}
      <path
        id={id}
        style={{ ...style, stroke: "#a855f7", strokeWidth: 2 }}
        className="react-flow__edge-path cursor-pointer pointer-events-auto transition-colors duration-200"
        d={edgePath}
        markerEnd={markerEnd}
      />

      {/* Animated Glowing Particles Trail */}
      <g>
        {/* Leading particle */}
        <circle r="4.5" fill="#f472b6" filter="url(#edge-glow)">
          <animateMotion dur="2.5s" repeatCount="indefinite" path={edgePath} />
        </circle>
        
        {/* Mid-trail particle (offset in timing) */}
        <circle r="3.5" fill="#3b82f6" opacity="0.8" filter="url(#edge-glow)">
          <animateMotion dur="2.5s" begin="0.4s" repeatCount="indefinite" path={edgePath} />
        </circle>
        
        {/* Outer tail particle */}
        <circle r="2.5" fill="#a855f7" opacity="0.6">
          <animateMotion dur="2.5s" begin="0.8s" repeatCount="indefinite" path={edgePath} />
        </circle>
      </g>
    </>
  );
}
