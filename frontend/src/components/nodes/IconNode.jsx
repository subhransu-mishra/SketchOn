import React, { useState, useRef, useEffect } from "react";
import { Handle, Position } from "reactflow";

const IconNode = ({ id, data }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label || data.name || "Icon");
  const inputRef = useRef();

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
      setLabel(data.label || data.name);
      setIsEditing(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-2 bg-neutral-800 border border-white/20 rounded-lg min-w-[80px]">
      <Handle type="target" position={Position.Top} className="w-3 h-3" />

      {/* Icon Image */}
      <div className="w-12 h-12 flex items-center justify-center mb-2">
        <img
          src={data.icon}
          alt={data.name || label}
          className="w-10 h-10 object-contain"
          draggable={false}
        />
      </div>

      {/* Label */}
      <div onDoubleClick={handleDoubleClick} className="w-full text-center">
        {isEditing ? (
          <input
            ref={inputRef}
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onBlur={handleSubmit}
            onKeyDown={handleKeyDown}
            className="bg-transparent border-none outline-none text-center w-full text-white text-xs placeholder-white/50"
            placeholder="Enter label..."
          />
        ) : (
          <div className="cursor-pointer text-white text-xs font-medium truncate">
            {label}
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
};

export default IconNode;
