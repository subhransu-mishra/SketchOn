import React, { useState, useRef, useEffect } from "react";
import { Handle, Position, NodeResizer } from "reactflow";
import { IoImageOutline as ImageIcon } from "react-icons/io5";

const IconNode = ({ id, data, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label || data.name || "Icon");
  const [imageError, setImageError] = useState(false);
  const inputRef = useRef();

  // Update label when data changes
  useEffect(() => {
    if (data.label || data.name) {
      setLabel(data.label || data.name);
    }
  }, [data.label, data.name]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    if (data.readOnly) return;
    setIsEditing(true);
  };

  const handleSubmit = () => {
    setIsEditing(false);
    if (data.onLabelChange && label.trim()) {
      data.onLabelChange(id, label.trim());
    }
  };

  const handleKeyDown = (e) => {
    e.stopPropagation();
    if (e.key === "Enter") {
      handleSubmit();
    } else if (e.key === "Escape") {
      setLabel(data.label || data.name);
      setIsEditing(false);
    }
  };

  return (
    <div
      className={`flex flex-col items-center p-3 bg-neutral-800 rounded-xl shadow-lg transition-all ${
        selected
          ? "ring-2 ring-blue-500 border-blue-500/50"
          : "border border-white/20"
      }`}
      style={{ width: "100%", height: "100%" }}
    >
      {!data.readOnly && (
        <NodeResizer
          isVisible={selected}
          minWidth={110}
          minHeight={140}
          onResizeEnd={(event, params) =>
            data.onResize?.(id, params.width, params.height)
          }
        />
      )}
      <Handle
        type="target"
        position={Position.Top}
        className={`w-3! h-3! bg-blue-500! border-2! border-neutral-800! ${
          data.readOnly ? "opacity-0 pointer-events-none" : ""
        }`}
        style={{ top: -6 }}
      />

      {/* Icon Image */}
      <div className="flex-1 w-full flex items-center justify-center mb-2 bg-neutral-700/50 rounded-lg p-2">
        {imageError ? (
          <ImageIcon className="w-10 h-10 text-white/30" />
        ) : (
          <img
            src={data.icon}
            alt={data.name || label}
            className="max-w-full max-h-full object-contain pointer-events-none"
            draggable={false}
            onError={() => setImageError(true)}
            loading="lazy"
          />
        )}
      </div>

      {/* Label */}
      <div
        onDoubleClick={handleDoubleClick}
        className="w-full text-center px-1"
      >
        {isEditing ? (
          <input
            ref={inputRef}
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onBlur={handleSubmit}
            onKeyDown={handleKeyDown}
            onClick={(e) => e.stopPropagation()}
            className="bg-neutral-700 border border-blue-500/50 rounded px-1 py-0.5 outline-none text-center w-full text-white text-xs placeholder-white/50"
            placeholder="Enter label..."
          />
        ) : (
          <div
            className="cursor-text text-white text-xs font-medium leading-tight wrap-break-word"
            title={label}
          >
            {label}
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className={`w-3! h-3! bg-blue-500! border-2! border-neutral-800! ${
          data.readOnly ? "opacity-0 pointer-events-none" : ""
        }`}
        style={{ bottom: -6 }}
      />

      {/* Left and Right handles for more connection options */}
      <Handle
        type="source"
        position={Position.Left}
        id="left"
        className={`w-3! h-3! bg-green-500! border-2! border-neutral-800! ${
          data.readOnly ? "opacity-0 pointer-events-none" : ""
        }`}
        style={{ left: -6 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className={`w-3! h-3! bg-green-500! border-2! border-neutral-800! ${
          data.readOnly ? "opacity-0 pointer-events-none" : ""
        }`}
        style={{ right: -6 }}
      />
    </div>
  );
};

export default IconNode;
