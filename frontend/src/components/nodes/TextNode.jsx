import React, { useState, useRef, useEffect } from "react";
import { Handle, Position, NodeResizer, NodeToolbar } from "reactflow";
import { NODE_COLORS } from "./nodeColors";

const TextNode = ({ id, data, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label);
  const inputRef = useRef();
  const nodeColor = data.color || "transparent";

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
      setLabel(data.label);
      setIsEditing(false);
    }
  };

  return (
    <div
      className="rounded text-white text-sm font-medium text-center border transition-all duration-150"
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: nodeColor,
        borderColor: selected && nodeColor === "transparent" ? "rgba(255,255,255,0.2)" : (nodeColor === "transparent" ? "transparent" : "rgba(255,255,255,0.25)"),
        borderStyle: nodeColor === "transparent" ? "dashed" : "solid",
      }}
    >
      {!data.readOnly && (
        <NodeResizer
          isVisible={selected}
          minWidth={110}
          minHeight={50}
          onResizeEnd={(event, params) =>
            data.onResize?.(id, params.width, params.height)
          }
        />
      )}
      {!data.readOnly && (
        <NodeToolbar isVisible={selected} position={Position.Top} align="center">
          <div className="flex flex-col gap-2 bg-neutral-900/95 border border-white/10 rounded-xl px-3 py-2 shadow-2xl">
            {/* Background Color */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-white/50 uppercase tracking-wider font-semibold mr-1">Fill</span>
              {/* Transparent Button */}
              <button
                type="button"
                className={`h-5 w-5 rounded-full border flex items-center justify-center transition-transform relative overflow-hidden bg-neutral-950 ${
                  nodeColor === "transparent"
                    ? "border-white scale-110"
                    : "border-white/20 hover:scale-105"
                }`}
                onClick={(event) => {
                  event.stopPropagation();
                  data.onColorChange?.(id, "transparent");
                }}
                title="Transparent (Direct Text)"
                aria-label="Set transparent background"
              >
                <div className="absolute inset-0 bg-[linear-gradient(45deg,#525252_25%,transparent_25%,transparent_75%,#525252_75%),linear-gradient(45deg,#525252_25%,transparent_25%,transparent_75%,#525252_75%)] bg-[size:6px_6px] bg-[position:0_0,3px_3px] opacity-20" />
                <div className="w-full h-0.5 bg-red-500 transform rotate-45 z-10" />
              </button>

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
                  aria-label={`Set color ${color}`}
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
      <Handle
        type="target"
        position={Position.Top}
        className={`w-3 h-3 ${data.readOnly ? "opacity-0 pointer-events-none" : ""}`}
      />
      <div
        className="flex items-center justify-center h-full px-2"
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
            placeholder="Enter text..."
          />
        ) : (
          <div className="cursor-pointer font-medium max-w-[90%] break-all">{label}</div>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className={`w-3 h-3 ${data.readOnly ? "opacity-0 pointer-events-none" : ""}`}
      />
    </div>
  );
};

export default TextNode;
