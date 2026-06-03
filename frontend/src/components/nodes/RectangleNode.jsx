import React, { useState, useRef, useEffect } from "react";
import { Handle, Position, NodeResizer, NodeToolbar } from "reactflow";
import { NODE_COLORS } from "./nodeColors";

const RectangleNode = ({ id, data, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label);
  const inputRef = useRef();
  const nodeColor = data.color || "#2563eb";

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
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
      className="rounded-lg text-white text-sm font-medium text-center border"
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: nodeColor,
        borderColor: "rgba(255,255,255,0.25)",
      }}
    >
      <NodeResizer
        isVisible={selected}
        minWidth={120}
        minHeight={70}
        onResizeEnd={(event, params) =>
          data.onResize?.(id, params.width, params.height)
        }
      />
      <NodeToolbar isVisible={selected} position={Position.Top} align="center">
        <div className="flex items-center gap-2 bg-neutral-900/95 border border-white/10 rounded-lg px-2 py-1">
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
      </NodeToolbar>
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <div
        className="flex items-center justify-center h-full px-3"
        onDoubleClick={handleDoubleClick}
      >
        {isEditing ? (
          <input
            ref={inputRef}
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onBlur={handleSubmit}
            onKeyDown={handleKeyDown}
            className="bg-transparent border-none outline-none text-center w-full text-white placeholder-white/70"
            placeholder="Enter text..."
          />
        ) : (
          <div className="cursor-pointer">{label}</div>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
};

export default RectangleNode;
