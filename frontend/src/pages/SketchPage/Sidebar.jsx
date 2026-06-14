import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { Link } from "react-router-dom";
import {
  IoHomeOutline as HomeIcon,
  IoDocumentTextOutline as DocumentTextIcon,
  IoTimeOutline as ClockIcon,
  IoSaveOutline as SaveIcon,
  IoCheckmarkCircle as CheckIcon,
  IoWarningOutline as WarningIcon,
  IoShapesOutline as ShapesIcon,
  IoAppsOutline as AppsIcon,
  IoMenuOutline as MenuIcon,
  IoChevronDownOutline as ChevronDownIcon,
  IoChevronUpOutline as ChevronUpIcon,
  IoShareOutline as ShareIcon,
} from "react-icons/io5";
import StarBorder from "../../components/StarBorder";

const MIN_SIDEBAR_WIDTH = 220;
const MAX_SIDEBAR_WIDTH = 420;
const DEFAULT_SIDEBAR_WIDTH = 260;

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const DesktopSidebar = React.forwardRef(
  (
    {
      currentProject,
      saveStatus,
      onManualSave,
      onShare,
      symbols,
      onDragStart,
      statusInfo,
      sidebarWidth,
      onResizeMouseDown,
      onOpenIconsModal,
    },
    ref,
  ) => (
    <div
      ref={ref}
      className="hidden md:flex bg-neutral-900 border-r border-white/10 p-4 flex-col h-full relative flex-shrink-0 select-none"
      style={{ width: sidebarWidth }}
    >
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

            {/* Save Status and Buttons */}
            <div className="flex flex-col gap-2 pt-2">
              <div className="flex items-center justify-between">
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
                    flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer
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

              <StarBorder
                onClick={onShare}
                color="#e9d5ff"
                speed="4s"
                thickness={2}
                className="w-full rounded-lg"
                innerClassName="w-full cursor-pointer flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-[7px] bg-purple-600 hover:bg-purple-700 text-white transition-colors"
                title="Share project public link"
              >
                <ShareIcon className="h-4 w-4 cursor-pointer" />
                Share Project
              </StarBorder>
            </div>
          </div>
        )}
      </div>

      {/* Shapes & Symbols Section */}
      <div className="mb-6">
        <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Shapes & Symbols</h2>
        <div className="grid grid-cols-4 gap-2">
          {symbols.map((symbol) => (
            <div
              key={symbol.id}
              className="flex flex-col items-center justify-center p-3.5 bg-neutral-850 hover:bg-neutral-800 border border-white/5 hover:border-purple-500/30 rounded-xl cursor-grab transition-all duration-200 active:cursor-grabbing relative group shadow-md"
              draggable
              onDragStart={(event) => onDragStart(event, symbol.type, symbol.arrowType)}
            >
              <span className="text-2xl transition-transform duration-200 group-hover:scale-110 select-none">{symbol.icon}</span>
              {/* Tooltip */}
              <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-neutral-950 border border-white/15 text-white text-[10px] px-2.5 py-1.5 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 shadow-2xl">
                {symbol.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Icons Library Section */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Tech Icons</h2>
        <StarBorder
          onClick={onOpenIconsModal}
          color="#e9d5ff"
          speed="4s"
          thickness={2}
          className="w-full rounded-lg shadow-lg shadow-purple-500/20 transition-all hover:shadow-purple-500/30 hover:scale-[1.02] active:scale-[0.98]"
          innerClassName="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-4 py-2.5 rounded-[7px] flex items-center justify-center gap-2 cursor-pointer"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Search & Add Icons
        </StarBorder>
      </div>

      {/* Footer Info */}
      <div className="mt-auto pt-4 border-t border-white/10 text-xs text-white/40">
        <p>💡 Drag shapes to the canvas</p>
      </div>

      {/* Resize Handle */}
      <div
        role="separator"
        aria-orientation="vertical"
        className="absolute top-0 right-0 h-full w-1 cursor-col-resize bg-transparent hover:bg-white/10"
        onMouseDown={onResizeMouseDown}
      />
    </div>
  ),
);

DesktopSidebar.displayName = "DesktopSidebar";

const MobileBottomBar = ({
  currentProject,
  saveStatus,
  onManualSave,
  onShare,
  symbols,
  onDragStart,
  statusInfo,
  mobileTab,
  setMobileTab,
  isMobileExpanded,
  setIsMobileExpanded,
  onOpenIconsModal,
}) => (
  <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-neutral-900 border-t border-white/10">
    {/* Expanded Panel */}
    {isMobileExpanded && (
      <div className="max-h-[60vh] overflow-y-auto p-4 border-b border-white/10">
        {/* Tab Content */}
        {mobileTab === "shapes" && (
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Shapes & Symbols</h3>
            <div className="grid grid-cols-4 gap-2">
              {symbols.map((symbol) => (
                <div
                  key={symbol.id}
                  className="flex flex-col items-center justify-center p-3.5 bg-neutral-850 border border-white/5 rounded-xl cursor-grab hover:bg-neutral-800 active:bg-neutral-700 transition-all text-center relative group"
                  draggable
                  onDragStart={(event) => onDragStart(event, symbol.type, symbol.arrowType)}
                >
                  <span className="text-2xl">{symbol.icon}</span>
                  <div className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 bg-neutral-950 border border-white/10 text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                    {symbol.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {mobileTab === "icons" && (
          <div className="space-y-4 py-2">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                <svg className="h-4 w-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-white">Technology Icons</h3>
            </div>
            <p className="text-xs text-white/50 mb-3">Browse and add custom tech logos/icons directly to your diagram</p>
            <StarBorder
              onClick={() => {
                setIsMobileExpanded(false); // Auto collapse mobile panel
                onOpenIconsModal();
              }}
              color="#e9d5ff"
              speed="4s"
              thickness={2}
              className="w-full rounded-lg shadow-lg shadow-purple-500/20 transition-all hover:shadow-purple-500/30 hover:scale-[1.02] active:scale-[0.98]"
              innerClassName="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-4 py-2.5 rounded-[7px] flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Open Icons Directory
            </StarBorder>
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
                <span>Modified: {formatDate(currentProject.lastModified)}</span>
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
                w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium rounded-lg transition-colors cursor-pointer
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
            {/* Share Button */}
            <StarBorder
              onClick={onShare}
              color="#e9d5ff"
              speed="4s"
              thickness={2}
              className="w-full rounded-lg"
              innerClassName="w-full cursor-pointer flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium rounded-[7px] bg-purple-600 hover:bg-purple-700 text-white transition-colors"
            >
              <ShareIcon className="h-4 w-4 cursor-pointer" />
              <span>Share Project</span>
            </StarBorder>
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
        className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors cursor-pointer ${
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
        className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors cursor-pointer ${
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
        className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors relative cursor-pointer ${
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
        className="flex flex-col items-center gap-1 px-3 py-2 text-white/40 hover:text-white/60 transition-colors cursor-pointer"
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

const Sidebar = ({ currentProject, saveStatus, onManualSave, onShare, onOpenIconsModal }) => {
  const [mobileTab, setMobileTab] = useState("shapes"); // 'shapes', 'icons', 'info'
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR_WIDTH);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef(null);

  const symbols = [
    { id: "rectangle", type: "rectangle", label: "Rectangle", icon: "⬜" },
    { id: "circle", type: "circle", label: "Circle", icon: "⚪" },
    { id: "diamond", type: "diamond", label: "Diamond", icon: "♦️" },
    { id: "textNode", type: "textNode", label: "Text Box", icon: "📝" },
    { id: "arrow-right", type: "arrowNode", label: "Right Arrow", icon: "➡️", arrowType: "right" },
    { id: "arrow-left", type: "arrowNode", label: "Left Arrow", icon: "⬅️", arrowType: "left" },
    { id: "arrow-straight", type: "arrowNode", label: "Straight Arrow", icon: "↔️", arrowType: "straight" },
    { id: "arrow-breaking", type: "arrowNode", label: "Breaking Arrow", icon: "↩️", arrowType: "breaking" },
  ];

  const onDragStart = (event, nodeType, extraData = null) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    if (nodeType === "arrowNode") {
      event.dataTransfer.setData("application/arrow-type", extraData);
    } else if (extraData) {
      event.dataTransfer.setData(
        "application/icon-data",
        JSON.stringify(extraData),
      );
    }
    event.dataTransfer.effectAllowed = "move";
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

  const handleResizeMouseDown = useCallback((event) => {
    event.preventDefault();
    setIsResizing(true);
  }, []);

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (event) => {
      if (!sidebarRef.current) return;
      const rect = sidebarRef.current.getBoundingClientRect();
      const nextWidth = event.clientX - rect.left;
      const clampedWidth = Math.min(
        MAX_SIDEBAR_WIDTH,
        Math.max(MIN_SIDEBAR_WIDTH, nextWidth),
      );
      setSidebarWidth(clampedWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    const previousUserSelect = document.body.style.userSelect;
    document.body.style.userSelect = "none";

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = previousUserSelect;
    };
  }, [isResizing]);

  return (
    <>
      <DesktopSidebar
        ref={sidebarRef}
        currentProject={currentProject}
        saveStatus={saveStatus}
        onManualSave={onManualSave}
        onShare={onShare}
        symbols={symbols}
        onDragStart={onDragStart}
        statusInfo={statusInfo}
        sidebarWidth={sidebarWidth}
        onResizeMouseDown={handleResizeMouseDown}
        onOpenIconsModal={onOpenIconsModal}
      />
      <MobileBottomBar
        currentProject={currentProject}
        saveStatus={saveStatus}
        onManualSave={onManualSave}
        onShare={onShare}
        symbols={symbols}
        onDragStart={onDragStart}
        statusInfo={statusInfo}
        mobileTab={mobileTab}
        setMobileTab={setMobileTab}
        isMobileExpanded={isMobileExpanded}
        setIsMobileExpanded={setIsMobileExpanded}
        onOpenIconsModal={onOpenIconsModal}
      />
    </>
  );
};

export default Sidebar;
