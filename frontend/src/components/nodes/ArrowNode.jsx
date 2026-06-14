import React, { useState, useRef, useEffect } from "react";
import { Handle, Position, NodeResizer, NodeToolbar } from "reactflow";
import { NODE_COLORS } from "./nodeColors";

const ArrowNode = ({ id, data, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label || "");
  const inputRef = useRef();
  const nodeColor = data.color || "#0284c7"; // Default sky blue color
  const arrowType = data.arrowType || "right"; // right, left, straight, breaking

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    if (data.readOnly) return;
    setIsEditing(true);
  };

  const handleSubmit = () => {
    setIsEditing(false);
    if (data.onLabelChange) {
      data.onLabelChange(id, label);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    } else if (e.key === "Escape") {
      setLabel(data.label || "");
      setIsEditing(false);
    }
  };

  // Select SVG path based on arrow type
  const renderSvg = () => {
    switch (arrowType) {
      case "left":
        return (
          <svg viewBox="0 0 100 100" width="100%" height="100%" preserveAspectRatio="none" className="w-full h-full">
            <path d="M 100,30 L 40,30 L 40,10 L 0,50 L 40,90 L 40,70 L 100,70 Z" fill={nodeColor} stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
          </svg>
        );
      case "straight":
        return (
          <svg viewBox="0 0 100 100" width="100%" height="100%" preserveAspectRatio="none" className="w-full h-full">
            <path d="M 0,50 L 25,25 L 25,40 L 75,40 L 75,25 L 100,50 L 75,75 L 75,60 L 25,60 L 25,75 Z" fill={nodeColor} stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
          </svg>
        );
      case "breaking":
        return (
          <svg viewBox="0 0 100 100" width="100%" height="100%" preserveAspectRatio="none" className="w-full h-full">
            <path d="M 10,25 L 60,25 L 60,65 L 45,65 L 70,95 L 95,65 L 80,65 L 80,10 L 10,10 Z" fill={nodeColor} stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
          </svg>
        );
      case "right":
      default:
        return (
          <svg viewBox="0 0 100 100" width="100%" height="100%" preserveAspectRatio="none" className="w-full h-full">
            <path d="M 0,30 L 60,30 L 60,10 L 100,50 L 60,90 L 60,70 L 0,70 Z" fill={nodeColor} stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
          </svg>
        );
    }
  };

  return (
    <div className="relative w-full h-full select-none">
      {!data.readOnly && (
        <NodeResizer
          isVisible={selected}
          minWidth={100}
          minHeight={60}
          onResizeEnd={(event, params) =>
            data.onResize?.(id, params.width, params.height)
          }
        />
      )}
      {!data.readOnly && (
        <NodeToolbar isVisible={selected} position={Position.Top} align="center">
          <div className="flex flex-col gap-2 bg-neutral-900/95 border border-white/10 rounded-xl px-3 py-2 shadow-2xl">
            {/* Color Selector */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-white/50 uppercase tracking-wider font-semibold mr-1">Fill</span>
              {NODE_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`h-5 w-5 rounded-full border transition-transform ${
                    nodeColor === color
                      ? "border-white scale-110"
                      : "border-white/20 hover:scale-105"
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={(event) => {
                    event.stopPropagation();
                    data.onColorChange?.(id, color);
                  }}
                />
              ))}
            </div>

            <div className="border-t border-white/5 my-1" />

            {/* Text Style Selector */}
            <div className="flex items-center gap-3">
              {/* Text Size */}
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-white/50 uppercase tracking-wider font-semibold mr-1">Size</span>
                {[
                  { label: "S", value: "12px" },
                  { label: "M", value: "16px" },
                  { label: "L", value: "20px" },
                  { label: "XL", value: "28px" },
                ].map((sz) => (
                  <button
                    key={sz.value}
                    type="button"
                    className={`h-6 w-6 text-xs font-bold rounded flex items-center justify-center border transition-all ${
                      (data.fontSize || "14px") === sz.value
                        ? "bg-blue-600 border-blue-500 text-white"
                        : "bg-neutral-800 border-white/10 text-white/60 hover:text-white"
                    }`}
                    onClick={(event) => {
                      event.stopPropagation();
                      data.onFontSizeChange?.(id, sz.value);
                    }}
                  >
                    {sz.label}
                  </button>
                ))}
              </div>

              <div className="h-4 w-px bg-white/10" />

              {/* Text Color */}
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-white/50 uppercase tracking-wider font-semibold mr-1">Color</span>
                {[
                  { name: "White", value: "#ffffff" },
                  { name: "Gray", value: "#a3a3a3" },
                  { name: "Yellow", value: "#facc15" },
                  { name: "Blue", value: "#3b82f6" },
                  { name: "Green", value: "#22c55e" },
                  { name: "Red", value: "#ef4444" },
                ].map((tc) => (
                  <button
                    key={tc.value}
                    type="button"
                    className={`h-5 w-5 rounded-full border flex items-center justify-center transition-transform ${
                      (data.textColor || "#ffffff") === tc.value
                        ? "border-white scale-110"
                        : "border-white/20 hover:scale-105"
                    }`}
                    style={{ backgroundColor: tc.value }}
                    onClick={(event) => {
                      event.stopPropagation();
                      data.onTextColorChange?.(id, tc.value);
                    }}
                    title={tc.name}
                  >
                    <span className="text-[9px] font-bold text-neutral-900 mix-blend-difference">A</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </NodeToolbar>
      )}

      {/* Handles around shape edges */}
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className={`w-2.5 h-2.5 !bg-neutral-400 ${data.readOnly ? "opacity-0 pointer-events-none" : ""}`}
      />
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className={`w-2.5 h-2.5 !bg-neutral-400 ${data.readOnly ? "opacity-0 pointer-events-none" : ""}`}
      />

      {/* Renders the SVG shape body */}
      <div className="w-full h-full flex items-center justify-center relative">
        <div className="absolute inset-0 z-0">
          {renderSvg()}
        </div>

        {/* Text Area */}
        <div
          className="relative z-10 flex items-center justify-center w-full h-full px-8 text-center"
          onDoubleClick={handleDoubleClick}
          style={{
            color: data.textColor || "#ffffff",
            fontSize: data.fontSize || "14px",
          }}
        >
          {isEditing ? (
            <input
              ref={inputRef}
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              onBlur={handleSubmit}
              onKeyDown={handleKeyDown}
              className="bg-transparent border-none outline-none text-center w-full focus:ring-0 focus:outline-none"
              style={{
                color: data.textColor || "#ffffff",
                fontSize: data.fontSize || "14px",
              }}
              placeholder="Text..."
            />
          ) : (
            <div className="cursor-pointer font-medium max-w-[80%] break-all">
              {label || (selected ? "Text..." : "")}
            </div>
          )}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className={`w-2.5 h-2.5 !bg-neutral-400 ${data.readOnly ? "opacity-0 pointer-events-none" : ""}`}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className={`w-2.5 h-2.5 !bg-neutral-400 ${data.readOnly ? "opacity-0 pointer-events-none" : ""}`}
      />
    </div>
  );
};

export default ArrowNode;
