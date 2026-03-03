import React, { useState, useMemo, useEffect } from "react";
import {
  IoCloseOutline as CloseIcon,
  IoSearchOutline as SearchIcon,
  IoGridOutline as GridIcon,
  IoImageOutline as ImageIcon,
} from "react-icons/io5";
import { ICONS, searchIcons, getCategories } from "../data/icons";

const IconSelectorModal = ({ isOpen, onClose, onSelectIcon }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [imageErrors, setImageErrors] = useState({});

  const categories = useMemo(() => ["all", ...getCategories()], []);

  const filteredIcons = useMemo(() => {
    let icons = searchQuery ? searchIcons(searchQuery) : ICONS;

    if (selectedCategory !== "all") {
      icons = icons.filter((icon) => icon.category === selectedCategory);
    }

    return icons;
  }, [searchQuery, selectedCategory]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      setSelectedCategory("all");
      setImageErrors({});
    }
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleIconSelect = (iconItem) => {
    onSelectIcon(iconItem);
    onClose();
  };

  const handleImageError = (iconId) => {
    setImageErrors((prev) => ({ ...prev, [iconId]: true }));
  };

  const getCategoryLabel = (category) => {
    const labels = {
      all: "All Icons",
      cloud: "Cloud",
      backend: "Backend",
      frontend: "Frontend",
      database: "Database",
      infrastructure: "Infrastructure",
      language: "Languages",
      general: "General",
    };
    return labels[category] || category;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-neutral-900 border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 border border-purple-500/20 rounded-xl">
              <GridIcon className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Select Icon</h2>
              <p className="text-sm text-white/50">
                Choose an icon for your diagram
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            <CloseIcon className="h-5 w-5 text-white/60" />
          </button>
        </div>

        {/* Search and Filter */}
        <div className="p-4 border-b border-white/10 space-y-3">
          {/* Search Input */}
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search icons by name, category, or keyword..."
              className="w-full pl-12 pr-4 py-3 bg-neutral-800 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <CloseIcon className="h-4 w-4 text-white/40" />
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? "bg-purple-600 text-white"
                    : "bg-neutral-800 text-white/60 hover:bg-neutral-700 hover:text-white"
                }`}
              >
                {getCategoryLabel(category)}
              </button>
            ))}
          </div>
        </div>

        {/* Icons Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredIcons.length > 0 ? (
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
              {filteredIcons.map((iconItem) => (
                <button
                  key={iconItem.id}
                  onClick={() => handleIconSelect(iconItem)}
                  className="group flex flex-col items-center gap-2 p-3 bg-neutral-800 rounded-xl border border-white/10 hover:bg-neutral-700 hover:border-purple-500/50 hover:scale-105 transition-all duration-200"
                  title={iconItem.name}
                >
                  <div className="w-12 h-12 flex items-center justify-center bg-neutral-700/50 rounded-lg p-1.5">
                    {imageErrors[iconItem.id] ? (
                      <ImageIcon className="w-8 h-8 text-white/30" />
                    ) : (
                      <img
                        src={iconItem.icon}
                        alt={iconItem.name}
                        className="w-full h-full object-contain"
                        onError={() => handleImageError(iconItem.id)}
                        loading="lazy"
                      />
                    )}
                  </div>
                  <span className="text-xs font-medium text-white/70 group-hover:text-white text-center truncate w-full">
                    {iconItem.name}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-white/40">
              <SearchIcon className="h-12 w-12 mb-4 opacity-50" />
              <p className="text-lg font-medium">No icons found</p>
              <p className="text-sm mt-1">
                Try a different search term or category
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-white/10 bg-neutral-800/50">
          <span className="text-sm text-white/50">
            {filteredIcons.length} of {ICONS.length} icons
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default IconSelectorModal;
