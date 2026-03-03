import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  IoHomeOutline as HomeIcon,
  IoDocumentTextOutline as DocumentTextIcon,
  IoTimeOutline as ClockIcon,
  IoSaveOutline as SaveIcon,
  IoCheckmarkCircle as CheckIcon,
  IoWarningOutline as WarningIcon,
  IoSearchOutline as SearchIcon,
  IoCloseOutline as CloseIcon,
  IoShapesOutline as ShapesIcon,
  IoAppsOutline as AppsIcon,
  IoMenuOutline as MenuIcon,
  IoChevronDownOutline as ChevronDownIcon,
  IoChevronUpOutline as ChevronUpIcon,
} from "react-icons/io5";
import { ICONS, searchIcons } from "../../data/icons";

const Sidebar = ({ currentProject, saveStatus, onManualSave }) => {
  const [iconSearchQuery, setIconSearchQuery] = useState("");
  const [mobileTab, setMobileTab] = useState("shapes"); // 'shapes', 'icons', 'info'
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);

  const symbols = [
    { id: "rectangle", type: "rectangle", label: "Rectangle", icon: "⬜" },
    { id: "circle", type: "circle", label: "Circle", icon: "⚪" },
    { id: "diamond", type: "diamond", label: "Diamond", icon: "♦️" },
    { id: "textNode", type: "textNode", label: "Text Box", icon: "📝" },
  ];

  // Filter icons based on search query
  const filteredIcons = useMemo(() => {
    return searchIcons(iconSearchQuery);
  }, [iconSearchQuery]);

  const onDragStart = (event, nodeType, iconData = null) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    if (iconData) {
      event.dataTransfer.setData(
        "application/icon-data",
        JSON.stringify(iconData),
      );
    }
    event.dataTransfer.effectAllowed = "move";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSaveStatusInfo = () => {
    switch (saveStatus) {
      case "saving":
        return {
          icon: (
            <div className="animate-spin h-4 w-4 border-2 border-blue-400 border-t-transparent rounded-full"></div>
          ),
          text: "Saving...",
          color: "text-blue-400",
        };
      case "saved":
        return {
          icon: <CheckIcon className="h-4 w-4" />,
          text: "Saved",
          color: "text-green-400",
        };
      case "unsaved":
        return {
          icon: <WarningIcon className="h-4 w-4" />,
          text: "Unsaved",
          color: "text-yellow-400",
        };
      default:
        return null;
    }
  };

  const statusInfo = getSaveStatusInfo();

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div className="hidden md:flex w-64 bg-neutral-900 border-r border-white/10 p-4 flex-col h-full">
      {/* Header with Project Info */}
      <div className="mb-6 pb-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-3">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
            title="Back to Dashboard"
          >
            <HomeIcon className="h-4 w-4" />
            Dashboard
          </Link>
        </div>

        {currentProject && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <DocumentTextIcon className="h-5 w-5 text-blue-400" />
              <h1
                className="text-lg font-semibold text-white truncate"
                title={currentProject.title}
              >
                {currentProject.title}
              </h1>
            </div>

            <div className="flex items-center gap-1 text-xs text-white/50">
              <ClockIcon className="h-3 w-3" />
              Last modified: {formatDate(currentProject.lastModified)}
            </div>

            <div className="flex gap-4 text-xs text-white/60">
              <span>{(currentProject.data?.nodes || []).length} nodes</span>
              <span>
                {(currentProject.data?.edges || []).length} connections
              </span>
            </div>

            {/* Save Status and Button */}
            <div className="flex items-center justify-between pt-2">
              {statusInfo && (
                <div
                  className={`flex items-center gap-2 text-xs ${statusInfo.color}`}
                >
                  {statusInfo.icon}
                  <span>{statusInfo.text}</span>
                </div>
              )}

              <button
                onClick={onManualSave}
                disabled={saveStatus === "saving" || saveStatus === "saved"}
                className={`
                  flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg transition-colors
                  ${
                    saveStatus === "unsaved"
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-neutral-700 text-white/60 cursor-not-allowed"
                  }
                `}
                title={
                  saveStatus === "saved"
                    ? "All changes saved"
                    : "Save changes manually"
                }
              >
                <SaveIcon className="h-4 w-4" />
                Save
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Components Section */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-white mb-4">Components</h2>
        <div className="space-y-2">
          {symbols.map((symbol) => (
            <div
              key={symbol.id}
              className="flex items-center gap-3 p-3 bg-neutral-800 rounded-lg border border-white/10 cursor-grab hover:bg-neutral-700 transition-colors active:cursor-grabbing"
              draggable
              onDragStart={(event) => onDragStart(event, symbol.type)}
              title={`Drag to add ${symbol.label}`}
            >
              <span className="text-xl">{symbol.icon}</span>
              <span className="text-sm font-medium text-white/80">
                {symbol.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Icons Section with Search */}
      <div className="flex-1 flex flex-col min-h-0">
        <h2 className="text-lg font-semibold text-white mb-3">Icons</h2>

        {/* Search Input */}
        <div className="relative mb-3">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            type="text"
            value={iconSearchQuery}
            onChange={(e) => setIconSearchQuery(e.target.value)}
            placeholder="Search icons..."
            className="w-full pl-9 pr-8 py-2 bg-neutral-800 border border-white/10 rounded-lg text-sm text-white placeholder-white/40 focus:outline-none focus:border-blue-500 transition-colors"
          />
          {iconSearchQuery && (
            <button
              onClick={() => setIconSearchQuery("")}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-white/10 rounded transition-colors"
            >
              <CloseIcon className="h-4 w-4 text-white/40" />
            </button>
          )}
        </div>

        {/* Icons Grid */}
        <div className="flex-1 overflow-y-auto">
          {filteredIcons.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {filteredIcons.map((iconItem) => (
                <div
                  key={iconItem.id}
                  className="flex flex-col items-center gap-1 p-2 bg-neutral-800 rounded-lg border border-white/10 cursor-grab hover:bg-neutral-700 hover:border-blue-500/50 transition-all active:cursor-grabbing"
                  draggable
                  onDragStart={(event) =>
                    onDragStart(event, "iconNode", iconItem)
                  }
                  title={`Drag to add ${iconItem.name}`}
                >
                  <img
                    src={iconItem.icon}
                    alt={iconItem.name}
                    className="w-8 h-8 object-contain pointer-events-none"
                    draggable={false}
                  />
                  <span className="text-[10px] font-medium text-white/70 text-center truncate w-full">
                    {iconItem.name}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-white/40">
              <SearchIcon className="h-8 w-8 mb-2" />
              <p className="text-sm">No icons found</p>
              <p className="text-xs mt-1">Try a different search term</p>
            </div>
          )}
        </div>

        {/* Icon count */}
        <div className="mt-2 text-xs text-white/40 text-center">
          {filteredIcons.length} of {ICONS.length} icons
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-4 border-t border-white/10 text-xs text-white/40">
        <p>💡 Drag components to the canvas</p>
      </div>
    </div>
  );

  // Mobile Bottom Bar
  const MobileBottomBar = () => (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-neutral-900 border-t border-white/10">
      {/* Expanded Panel */}
      {isMobileExpanded && (
        <div className="max-h-[60vh] overflow-y-auto p-4 border-b border-white/10">
          {/* Tab Content */}
          {mobileTab === "shapes" && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white/80 mb-3">
                Shapes
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {symbols.map((symbol) => (
                  <div
                    key={symbol.id}
                    className="flex flex-col items-center gap-1 p-3 bg-neutral-800 rounded-lg border border-white/10 cursor-grab hover:bg-neutral-700 active:bg-neutral-600 transition-colors"
                    draggable
                    onDragStart={(event) => onDragStart(event, symbol.type)}
                  >
                    <span className="text-2xl">{symbol.icon}</span>
                    <span className="text-[10px] font-medium text-white/70 text-center">
                      {symbol.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {mobileTab === "icons" && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white/80">Icons</h3>
              {/* Search */}
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
                <input
                  type="text"
                  value={iconSearchQuery}
                  onChange={(e) => setIconSearchQuery(e.target.value)}
                  placeholder="Search icons..."
                  className="w-full pl-9 pr-8 py-2 bg-neutral-800 border border-white/10 rounded-lg text-sm text-white placeholder-white/40 focus:outline-none focus:border-blue-500 transition-colors"
                />
                {iconSearchQuery && (
                  <button
                    onClick={() => setIconSearchQuery("")}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-white/10 rounded transition-colors"
                  >
                    <CloseIcon className="h-4 w-4 text-white/40" />
                  </button>
                )}
              </div>
              {/* Icons Grid */}
              {filteredIcons.length > 0 ? (
                <div className="grid grid-cols-5 gap-2">
                  {filteredIcons.map((iconItem) => (
                    <div
                      key={iconItem.id}
                      className="flex flex-col items-center gap-1 p-2 bg-neutral-800 rounded-lg border border-white/10 cursor-grab hover:bg-neutral-700 active:bg-neutral-600 transition-all"
                      draggable
                      onDragStart={(event) =>
                        onDragStart(event, "iconNode", iconItem)
                      }
                    >
                      <img
                        src={iconItem.icon}
                        alt={iconItem.name}
                        className="w-8 h-8 object-contain pointer-events-none"
                        draggable={false}
                      />
                      <span className="text-[9px] font-medium text-white/70 text-center truncate w-full">
                        {iconItem.name}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-white/40">
                  <SearchIcon className="h-6 w-6 mb-2" />
                  <p className="text-xs">No icons found</p>
                </div>
              )}
              <div className="text-xs text-white/40 text-center">
                {filteredIcons.length} of {ICONS.length} icons
              </div>
            </div>
          )}

          {mobileTab === "info" && currentProject && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <DocumentTextIcon className="h-5 w-5 text-blue-400" />
                <h3 className="text-sm font-semibold text-white truncate">
                  {currentProject.title}
                </h3>
              </div>
              <div className="space-y-2 text-xs text-white/60">
                <div className="flex items-center gap-2">
                  <ClockIcon className="h-3 w-3" />
                  <span>
                    Modified: {formatDate(currentProject.lastModified)}
                  </span>
                </div>
                <div className="flex gap-4">
                  <span>{(currentProject.data?.nodes || []).length} nodes</span>
                  <span>
                    {(currentProject.data?.edges || []).length} connections
                  </span>
                </div>
              </div>
              {/* Save Button */}
              <button
                onClick={onManualSave}
                disabled={saveStatus === "saving" || saveStatus === "saved"}
                className={`
                  w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium rounded-lg transition-colors
                  ${
                    saveStatus === "unsaved"
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-neutral-700 text-white/60 cursor-not-allowed"
                  }
                `}
              >
                {statusInfo?.icon}
                <span>{statusInfo?.text || "Saved"}</span>
              </button>
              <Link
                to="/dashboard"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-medium text-white/70 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors"
              >
                <HomeIcon className="h-4 w-4" />
                Back to Dashboard
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab Bar */}
      <div className="flex items-center justify-around px-2 py-2 safe-area-pb">
        <button
          onClick={() => {
            if (mobileTab === "shapes" && isMobileExpanded) {
              setIsMobileExpanded(false);
            } else {
              setMobileTab("shapes");
              setIsMobileExpanded(true);
            }
          }}
          className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
            mobileTab === "shapes" && isMobileExpanded
              ? "bg-blue-600/20 text-blue-400"
              : "text-white/60 hover:text-white hover:bg-white/5"
          }`}
        >
          <ShapesIcon className="h-5 w-5" />
          <span className="text-[10px] font-medium">Shapes</span>
        </button>

        <button
          onClick={() => {
            if (mobileTab === "icons" && isMobileExpanded) {
              setIsMobileExpanded(false);
            } else {
              setMobileTab("icons");
              setIsMobileExpanded(true);
            }
          }}
          className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
            mobileTab === "icons" && isMobileExpanded
              ? "bg-blue-600/20 text-blue-400"
              : "text-white/60 hover:text-white hover:bg-white/5"
          }`}
        >
          <AppsIcon className="h-5 w-5" />
          <span className="text-[10px] font-medium">Icons</span>
        </button>

        <button
          onClick={() => {
            if (mobileTab === "info" && isMobileExpanded) {
              setIsMobileExpanded(false);
            } else {
              setMobileTab("info");
              setIsMobileExpanded(true);
            }
          }}
          className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors relative ${
            mobileTab === "info" && isMobileExpanded
              ? "bg-blue-600/20 text-blue-400"
              : "text-white/60 hover:text-white hover:bg-white/5"
          }`}
        >
          <MenuIcon className="h-5 w-5" />
          <span className="text-[10px] font-medium">Info</span>
          {saveStatus === "unsaved" && (
            <span className="absolute top-1 right-2 w-2 h-2 bg-yellow-400 rounded-full"></span>
          )}
        </button>

        {/* Collapse/Expand indicator */}
        <button
          onClick={() => setIsMobileExpanded(!isMobileExpanded)}
          className="flex flex-col items-center gap-1 px-3 py-2 text-white/40 hover:text-white/60 transition-colors"
        >
          {isMobileExpanded ? (
            <ChevronDownIcon className="h-5 w-5" />
          ) : (
            <ChevronUpIcon className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileBottomBar />
    </>
  );
};

export default Sidebar;
