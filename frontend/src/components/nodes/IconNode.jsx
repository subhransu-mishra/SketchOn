import React, { useState, useRef, useEffect } from "react";
import { Handle, Position } from "reactflow";

const IconNode = ({ id, data, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label || data.name || "Icon");
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
      className={`flex flex-col items-center p-3 bg-neutral-800 rounded-xl min-w-22.5 max-w-30 shadow-lg transition-all ${
        selected
          ? "ring-2 ring-blue-500 border-blue-500/50"
          : "border border-white/20"
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3! h-3! bg-blue-500! border-2! border-neutral-800!"
        style={{ top: -6 }}
      />

      {/* Icon Image */}
      <div className="w-14 h-14 flex items-center justify-center mb-2 bg-neutral-700/50 rounded-lg p-2">
        <img
          src={data.icon}
          alt={data.name || label}
          className="w-full h-full object-contain pointer-events-none"
          draggable={false}
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
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
        className="w-3! h-3! bg-blue-500! border-2! border-neutral-800!"
        style={{ bottom: -6 }}
      />

      {/* Left and Right handles for more connection options */}
      <Handle
        type="source"
        position={Position.Left}
        id="left"
        className="w-3! h-3! bg-green-500! border-2! border-neutral-800!"
        style={{ left: -6 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="w-3! h-3! bg-green-500! border-2! border-neutral-800!"
        style={{ right: -6 }}
      />
    </div>
  );
};

export default IconNode;
