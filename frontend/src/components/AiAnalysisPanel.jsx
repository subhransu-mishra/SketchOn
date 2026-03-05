import React from "react";
import {
  IoCloseOutline as XMarkIcon,
  IoCheckmarkCircle,
  IoWarning,
  IoAlertCircle,
  IoShield,
  IoSpeedometer,
  IoExpand,
  IoServer,
  IoChatbubbles,
  IoAdd,
} from "react-icons/io5";

const sectionConfig = [
  {
    key: "architecture_summary",
    title: "Architecture Summary",
    icon: IoServer,
    color: "blue",
    type: "text",
  },
  {
    key: "strengths",
    title: "Strengths",
    icon: IoCheckmarkCircle,
    color: "green",
    type: "list",
  },
  {
    key: "bottlenecks",
    title: "Bottlenecks",
    icon: IoWarning,
    color: "yellow",
    type: "list",
  },
  {
    key: "missing_components",
    title: "Missing Components",
    icon: IoAlertCircle,
    color: "red",
    type: "list",
  },
  {
    key: "scalability_improvements",
    title: "Scalability Improvements",
    icon: IoExpand,
    color: "purple",
    type: "list",
  },
  {
    key: "reliability_improvements",
    title: "Reliability Improvements",
    icon: IoShield,
    color: "indigo",
    type: "list",
  },
  {
    key: "performance_optimizations",
    title: "Performance Optimizations",
    icon: IoSpeedometer,
    color: "cyan",
    type: "list",
  },
  {
    key: "security_improvements",
    title: "Security Improvements",
    icon: IoShield,
    color: "orange",
    type: "list",
  },
  {
    key: "interview_feedback",
    title: "Interview Feedback",
    icon: IoChatbubbles,
    color: "pink",
    type: "text",
  },
  {
    key: "suggested_components",
    title: "Suggested Components",
    icon: IoAdd,
    color: "teal",
    type: "components",
  },
];

const colorMap = {
  blue: "bg-blue-500/10 border-blue-500/20 text-blue-400",
  green: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
  yellow: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
  red: "bg-red-500/10 border-red-500/20 text-red-400",
  purple: "bg-purple-500/10 border-purple-500/20 text-purple-400",
  indigo: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400",
  cyan: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400",
  orange: "bg-orange-500/10 border-orange-500/20 text-orange-400",
  pink: "bg-pink-500/10 border-pink-500/20 text-pink-400",
  teal: "bg-teal-500/10 border-teal-500/20 text-teal-400",
};

const AiAnalysisPanel = ({ analysis, isLoading, error, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-lg h-full bg-neutral-900 border-l border-white/10 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 border border-purple-500/20 rounded-lg">
              <svg
                className="h-5 w-5 text-purple-400"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">AI Analysis</h2>
              <p className="text-xs text-white/50">System Design Review</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <XMarkIcon className="h-5 w-5 text-white/60" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <div className="relative">
                <div className="animate-spin h-10 w-10 border-3 border-purple-500/30 border-t-purple-400 rounded-full"></div>
              </div>
              <div className="text-center">
                <p className="text-white/80 font-medium">
                  Analyzing your architecture...
                </p>
                <p className="text-white/40 text-sm mt-1">
                  This may take a few seconds
                </p>
              </div>
            </div>
          )}

          {error && !isLoading && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <IoAlertCircle className="h-5 w-5 text-red-400" />
                <p className="text-red-400 font-medium">Analysis Failed</p>
              </div>
              <p className="text-red-300/80 text-sm">{error}</p>
            </div>
          )}

          {analysis &&
            !isLoading &&
            sectionConfig.map((section) => {
              const data = analysis[section.key];
              if (!data || (Array.isArray(data) && data.length === 0))
                return null;

              const colors = colorMap[section.color];
              const Icon = section.icon;

              return (
                <div
                  key={section.key}
                  className="bg-white/3 border border-white/6 rounded-lg overflow-hidden"
                >
                  <div className="flex items-center gap-2 p-3 border-b border-white/6">
                    <div className={`p-1.5 rounded-md border ${colors}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <h3 className="text-sm font-semibold text-white">
                      {section.title}
                    </h3>
                  </div>

                  <div className="p-3">
                    {section.type === "text" && (
                      <p className="text-sm text-white/70 leading-relaxed">
                        {data}
                      </p>
                    )}

                    {section.type === "list" && (
                      <ul className="space-y-2">
                        {data.map((item, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-sm text-white/70"
                          >
                            <span className="text-white/30 mt-0.5 shrink-0">
                              •
                            </span>
                            <span className="leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {section.type === "components" && (
                      <div className="space-y-2">
                        {data.map((item, idx) => (
                          <div
                            key={idx}
                            className="bg-white/3 border border-white/6 rounded-md p-2.5"
                          >
                            <p className="text-sm font-medium text-white/90">
                              {item.component}
                            </p>
                            <p className="text-xs text-white/50 mt-1 leading-relaxed">
                              {item.reason}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default AiAnalysisPanel;
