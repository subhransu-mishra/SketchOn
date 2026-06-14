import React, { useState, useEffect,useMemo, useCallback, useRef } from "react";
import { useUser } from "@clerk/clerk-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  IoCloseOutline as XMarkIcon,
  IoDocumentTextOutline as DocumentTextIcon,
  IoHelpCircleOutline as HelpIcon,
  IoWalletOutline as WalletIcon,
  IoSparklesOutline as SparklesIcon,
  IoBookOutline as BookIcon,
} from "react-icons/io5";
import Sidebar from "./Sidebar";
import CanvasSurface from "../../components/CanvasSurface";
import AiAnalysisPanel from "../../components/AiAnalysisPanel";
import StarBorder from "../../components/StarBorder";
import { useDiagramService } from "../../services/diagramService";
import { loadingManager } from "../../services/apiUtils";
import { toast } from "react-toastify";
import { searchIcons } from "../../data/icons";

const CanvasPage = () => {
  const { isSignedIn, user } = useUser();
  const { diagramService, isReady, isLoaded } = useDiagramService();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Credit and Guidance states
  const [userProfile, setUserProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [showGuidance, setShowGuidance] = useState(false);
  const [showIconsModal, setShowIconsModal] = useState(false);
  const [iconSearchQuery, setIconSearchQuery] = useState("");

  const filteredIcons = useMemo(() => {
    return searchIcons(iconSearchQuery);
  }, [iconSearchQuery]);

  const [showTitleModal, setShowTitleModal] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [projectData, setProjectData] = useState({ nodes: [], edges: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState("saved"); // 'saved', 'saving', 'unsaved'
  const isUpdatingFromParent = useRef(false);

  // Modal states
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  // AI Analysis states
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);

  const isNewProject = searchParams.get("new") === "true";
  const projectId = searchParams.get("project");

  useEffect(() => {
    if (isSignedIn && user && isReady) {
      if (isNewProject) {
        setShowTitleModal(true);
      } else if (projectId) {
        loadExistingProject(projectId);
      } else {
        // Redirect to dashboard if no project specified
        navigate("/dashboard");
      }
    }
  }, [isSignedIn, user, isReady, isNewProject, projectId, navigate]);

  // Load user profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      if (!isLoaded || !isSignedIn || !user || !isReady) {
        return;
      }
      try {
        setProfileLoading(true);
        const profileData = await diagramService.getUserProfile();
        if (profileData && profileData.success) {
          setUserProfile(profileData.data);
        }
      } catch (err) {
        console.error("Error loading user profile on canvas page:", err);
      } finally {
        setProfileLoading(false);
      }
    };
    loadProfile();
  }, [isLoaded, isSignedIn, user, isReady, diagramService]);

  // Initialize guidance state from localStorage (only show one time)
  useEffect(() => {
    const dismissed = localStorage.getItem("sketchon_guidance_dismissed");
    if (!dismissed) {
      setShowGuidance(true);
    }
  }, []);

  const loadExistingProject = async (id) => {
    try {
      setIsLoading(true);
      loadingManager.startLoading(`load-project-${id}`);

      const response = await diagramService.getDiagram(id);
      const diagram = response.data;

      const project = {
        id: diagram._id,
        title: diagram.title,
        createdAt: diagram.createdAt,
        lastModified: diagram.updatedAt || diagram.lastModified,
        data: {
          nodes: diagram.nodes || [],
          edges: diagram.edges || [],
        },
      };

      setCurrentProject(project);
      isUpdatingFromParent.current = true;
      setProjectData(project.data);
      setSaveStatus("saved");

      // Reset the flag after a short delay
      setTimeout(() => {
        isUpdatingFromParent.current = false;
      }, 100);
    } catch (error) {
      console.error("Error loading project:", error);
      alert("Failed to load project: " + (error.message || "Unknown error"));
      navigate("/dashboard");
    } finally {
      setIsLoading(false);
      loadingManager.stopLoading(`load-project-${id}`);
    }
  };

  // Modal handlers
  const handleModalSave = () => {
    if (!title.trim()) {
      setError("Project title is required");
      return;
    }

    if (title.trim().length < 3) {
      setError("Project title must be at least 3 characters long");
      return;
    }

    handleSaveProjectTitle(title.trim());
    setTitle("");
    setError("");
  };

  const handleModalClose = () => {
    setTitle("");
    setError("");
    setShowTitleModal(false);
    navigate("/dashboard");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleModalSave();
    }
  };

  const handleSaveProjectTitle = async (projectTitle) => {
    try {
      setIsLoading(true);
      loadingManager.startLoading("create-project");

      const response = await diagramService.createDiagram({
        title: projectTitle,
        nodes: [],
        edges: [],
      });

      const diagram = response.data;
      const newProject = {
        id: diagram._id,
        title: diagram.title,
        createdAt: diagram.createdAt,
        lastModified: diagram.updatedAt || diagram.createdAt,
        data: {
          nodes: diagram.nodes || [],
          edges: diagram.edges || [],
        },
      };

      setCurrentProject(newProject);
      isUpdatingFromParent.current = true;
      setProjectData(newProject.data);
      setShowTitleModal(false);
      setSaveStatus("saved");

      // Reset the flag after a short delay
      setTimeout(() => {
        isUpdatingFromParent.current = false;
      }, 100);

      // Update URL without the 'new' parameter
      const newUrl = `/#/canvas?project=${newProject.id}`;
      window.history.replaceState({}, "", newUrl);
    } catch (error) {
      console.error("Error creating project:", error);
      setError(
        "Failed to create project: " + (error.message || "Unknown error"),
      );
    } finally {
      setIsLoading(false);
      loadingManager.stopLoading("create-project");
    }
  };

  // Auto-save with debouncing
  const autoSaveTimeout = useRef(null);

  const saveProjectData = async (projectData) => {
    if (!currentProject || !currentProject.id) {
      console.warn("No current project to save");
      return;
    }

    try {
      setSaveStatus("saving");

      // Validate that we have proper data structure
      if (!projectData || (!projectData.nodes && !projectData.edges)) {
        console.warn("No valid project data to save");
        setSaveStatus("unsaved");
        return;
      }

      // Deep sanitize the data to ensure proper structure
      const sanitizeNodeOrEdge = (item) => {
        if (typeof item === "string") {
          try {
            return JSON.parse(item);
          } catch (e) {
            console.warn("Failed to parse item:", item);
            return null;
          }
        }
        return item;
      };

      const saveData = {
        nodes: Array.isArray(projectData.nodes)
          ? projectData.nodes.map(sanitizeNodeOrEdge).filter(Boolean)
          : [],
        edges: Array.isArray(projectData.edges)
          ? projectData.edges.map(sanitizeNodeOrEdge).filter(Boolean)
          : [],
      };

      console.log("Saving project data:", {
        id: currentProject.id,
        nodesCount: saveData.nodes.length,
        edgesCount: saveData.edges.length,
        sampleNode: saveData.nodes[0] || null,
        sampleEdge: saveData.edges[0] || null,
      });

      await diagramService.saveDiagram(currentProject.id, saveData);
      setSaveStatus("saved");
      console.log("Project saved successfully");
    } catch (error) {
      console.error("Auto-save error:", error);
      setSaveStatus("unsaved");

      // Show user-friendly error message for certain error types
      if (
        error.message.includes("authentication") ||
        error.message.includes("401")
      ) {
        console.error("Authentication error - user may need to sign in again");
      } else if (
        error.message.includes("network") ||
        error.message.includes("fetch")
      ) {
        console.error("Network error - check internet connection");
      }
    }
  };

  // Manual save function for save button
  const handleManualSave = async () => {
    if (!currentProject) {
      console.warn("No current project to save manually");
      return;
    }

    if (autoSaveTimeout.current) {
      clearTimeout(autoSaveTimeout.current);
    }

    try {
      await saveProjectData(projectData);
      console.log("Manual save completed");
    } catch (error) {
      console.error("Error saving diagram:", error);
      // You might want to show a toast notification or alert here
    }
  };

  // Share project handler
  const handleShare = async () => {
    if (!currentProject || !currentProject.id) {
      console.warn("No current project to share");
      return;
    }

    try {
      await diagramService.shareDiagram(currentProject.id);
      const shareUrl = `${window.location.origin}/#/share/${currentProject.id}`;
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      console.error("Error sharing project:", err);
      toast.error("Failed to share project: " + (err.message || "Unknown error"));
    }
  };

  // AI Analysis handler - clicks and triggers credit check modal
  const handleAiAnalyzeClick = () => {
    if (!projectData.nodes || projectData.nodes.length === 0) {
      setAiError("Add some components to your diagram before analyzing.");
      setShowAiPanel(true);
      return;
    }
    
    // Open the credit confirmation modal
    setShowCreditModal(true);
  };

  // Perform AI analysis after user clicks continue on the credit modal
  const handleConfirmAiAnalyze = async () => {
    setShowCreditModal(false);
    setShowAiPanel(true);
    setAiLoading(true);
    setAiError(null);
    setAiAnalysis(null);

    try {
      const result = await diagramService.analyzeDiagram({
        title: currentProject?.title || "Untitled Diagram",
        nodes: projectData.nodes,
        edges: projectData.edges,
      });

      if (result.success) {
        setAiAnalysis(result.data);
        // Update local profile credit count
        if (result.creditsRemaining !== undefined) {
          setUserProfile((prev) => prev ? { ...prev, credits: result.creditsRemaining } : null);
        } else {
          // Fallback refresh
          const profileData = await diagramService.getUserProfile();
          if (profileData && profileData.success) {
            setUserProfile(profileData.data);
          }
        }
      } else {
        setAiError(result.message || "Analysis failed");
        // Refresh profile just in case of refund
        try {
          const profileData = await diagramService.getUserProfile();
          if (profileData && profileData.success) {
            setUserProfile(profileData.data);
          }
        } catch (e) {
          console.error("Profile reload failed", e);
        }
      }
    } catch (err) {
      console.error("AI analysis error:", err);
      setAiError(err.message || "Failed to analyze diagram");
      // Refresh profile just in case of refund
      try {
        const profileData = await diagramService.getUserProfile();
        if (profileData && profileData.success) {
          setUserProfile(profileData.data);
        }
      } catch (e) {
        console.error("Profile reload failed", e);
      }
    } finally {
      setAiLoading(false);
    }
  };

  const handleProjectDataChange = useCallback(
    (nodes, edges) => {
      // Prevent circular updates
      if (isUpdatingFromParent.current) {
        return;
      }

      const updatedData = { nodes, edges };
      setProjectData(updatedData);
      setSaveStatus("unsaved");

      // Debounced auto-save to API
      if (currentProject && user) {
        if (autoSaveTimeout.current) {
          clearTimeout(autoSaveTimeout.current);
        }

        autoSaveTimeout.current = setTimeout(() => {
          saveProjectData(updatedData);
        }, 2000); // Auto-save after 2 seconds of inactivity

        // Update the current project state immediately for UI
        setCurrentProject((prev) => ({
          ...prev,
          data: updatedData,
          lastModified: new Date().toISOString(),
        }));
      }
    },
    [currentProject, user],
  );

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white antialiased flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Access Restricted</h2>
          <p className="text-white/70">Please sign in to access the canvas.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="h-screen bg-neutral-950 text-white flex md:flex-row flex-col">
        <Sidebar
          currentProject={currentProject}
          saveStatus={saveStatus}
          onManualSave={handleManualSave}
          onShare={handleShare}
          onOpenIconsModal={() => setShowIconsModal(true)}
        />
        {/* Add padding bottom on mobile for the bottom bar */}
        <div className="flex-1 h-full md:pb-0 pb-24 relative">
          <CanvasSurface
            projectData={projectData}
            onDataChange={handleProjectDataChange}
          />

          {/* AI Analyze Button - Top Right */}
          <div className="fixed top-4 right-4 z-20">
            <StarBorder
              onClick={handleAiAnalyzeClick}
              disabled={aiLoading}
              color="#e9d5ff"
              speed="4s"
              thickness={2}
              className="rounded-lg shadow-lg shadow-purple-500/20 transition-all hover:shadow-purple-500/30 hover:scale-[1.02] active:scale-[0.98]"
              innerClassName="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-2.5 rounded-[7px] flex items-center gap-2"
            >
              {aiLoading ? (
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
                <svg
                  className="h-4 w-4"
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
              )}
              {aiLoading ? "Analyzing..." : "AI Analyze"}
            </StarBorder>
          </div>
        </div>
      </div>

      {/* AI Analysis Panel */}
      {showAiPanel && (
        <AiAnalysisPanel
          analysis={aiAnalysis}
          isLoading={aiLoading}
          error={aiError}
          onClose={() => setShowAiPanel(false)}
        />
      )}

      {/* Project Title Modal */}
      {showTitleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleModalClose}
          />

          {/* Modal */}
          <div className="relative w-full max-w-md mx-4 bg-neutral-900 border border-white/10 rounded-xl shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <DocumentTextIcon className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    New Project
                  </h2>
                  <p className="text-sm text-white/60">
                    Give your whiteboard a name
                  </p>
                </div>
              </div>
              <button
                onClick={handleModalClose}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <XMarkIcon className="h-5 w-5 text-white/60" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div>
                <label
                  htmlFor="project-title"
                  className="block text-sm font-medium text-white/80 mb-2"
                >
                  Project Title
                </label>
                <input
                  id="project-title"
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (error) setError("");
                  }}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your project title..."
                  className="w-full px-4 py-3 bg-neutral-800 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                  autoFocus
                />
                {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
              </div>

              <div className="text-xs text-white/50 bg-white/5 border border-white/10 rounded-lg p-3">
                <p>
                  💡 <strong>Tip:</strong> Choose a descriptive name that helps
                  you identify this project later.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10">
              <button
                onClick={handleModalClose}
                className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleModalSave}
                disabled={!title.trim() || isLoading}
                className="px-6 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isLoading && (
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                )}
                {isLoading ? "Creating..." : "Create Project"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Credit Confirmation Modal */}
      {showCreditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowCreditModal(false)}
          />

          {/* Modal */}
          <div className="relative w-full max-w-md mx-4 bg-neutral-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    AI Design Review
                  </h2>
                  <p className="text-sm text-white/60">
                    Spend credits for analysis
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCreditModal(false)}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
              >
                <XMarkIcon className="h-5 w-5 text-white/60" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <WalletIcon className="h-5 w-5 text-white/60" />
                  <span className="text-sm text-white/80">Available balance:</span>
                </div>
                <span className="text-base font-bold text-white">
                  {profileLoading ? "..." : `${userProfile?.credits ?? 0} credits`}
                </span>
              </div>

              <div className="text-sm text-white/70 space-y-2">
                <p>
                  Running this analysis costs <strong className="text-purple-400">5 AI credits</strong>.
                </p>
                <p className="text-xs text-white/50">
                  Our AI evaluates your architecture layout, identifies potential bottlenecks, security concerns, and offers tailored system design advice.
                </p>
              </div>

              {/* Insufficient warning */}
              {!profileLoading && (userProfile?.credits ?? 0) < 5 && (
                <div className="flex gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400">
                  <span className="font-semibold">⚠️ Insufficient Credits:</span>
                  <span>You need at least 5 credits. Subscribe or purchase more credits to continue.</span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10">
              <button
                onClick={() => setShowCreditModal(false)}
                className="px-4 py-2 text-sm font-medium cursor-pointer text-white/60 hover:text-white border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              
              {(!profileLoading && (userProfile?.credits ?? 0) < 5) ? (
                <button
                  onClick={() => {
                    setShowCreditModal(false);
                    navigate("/pricing");
                  }}
                  className="px-6 py-2 text-sm font-semibold bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors cursor-pointer"
                >
                  Buy Credits / Upgrade
                </button>
              ) : (
                <StarBorder
                  onClick={handleConfirmAiAnalyze}
                  disabled={profileLoading}
                  color="#e9d5ff"
                  speed="4s"
                  thickness={2}
                  className="rounded-lg shadow-lg shadow-purple-500/20 transition-all hover:shadow-purple-500/30 hover:scale-[1.02] active:scale-[0.98]"
                  innerClassName="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-2 rounded-[7px] flex items-center gap-2 cursor-pointer"
                >
                  Continue (Spend 5 Cr)
                </StarBorder>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Instruction Guidance Panel */}
      {showGuidance && (
        <div className="fixed bottom-24 md:bottom-6 right-6 z-30 w-full max-w-[340px] bg-neutral-900 border border-white/10 rounded-xl p-5 shadow-2xl backdrop-blur-md">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <BookIcon className="h-5 w-5 text-blue-400" />
              <h4 className="text-sm font-semibold text-white">How to Use the Whiteboard</h4>
            </div>
            <button
              onClick={() => {
                setShowGuidance(false);
                localStorage.setItem("sketchon_guidance_dismissed", "true");
              }}
              className="p-1 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors cursor-pointer"
              title="Dismiss Instructions"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>

          {/* Guide Steps */}
          <div className="space-y-3 text-xs text-white/70">
            <div className="flex gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-blue-400">1</span>
              <p><strong>Drag Components:</strong> Grab shapes or tech icons from the sidebar and drag them onto the whiteboard canvas.</p>
            </div>
            <div className="flex gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-blue-400">2</span>
              <p><strong>Connections:</strong> Drag handles to connect nodes. Click a line to toggle glowing neon flow animations.</p>
            </div>
            <div className="flex gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-blue-400">3</span>
              <p><strong>Write Text & Edit:</strong> Double-click empty canvas to create text nodes. Double-click components to edit label, size, or colors.</p>
            </div>
            <div className="flex gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-blue-400">4</span>
              <p><strong>AI Analyze:</strong> Run an architect design review using the top-right button (costs 5 credits).</p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 flex justify-end">
            <StarBorder
              onClick={() => {
                setShowGuidance(false);
                localStorage.setItem("sketchon_guidance_dismissed", "true");
              }}
              color="#e9d5ff"
              speed="4s"
              thickness={2}
              className="rounded-lg shadow-lg shadow-purple-500/20 transition-all hover:shadow-purple-500/30 hover:scale-[1.02] active:scale-[0.98]"
              innerClassName="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-4 py-2 rounded-[7px] cursor-pointer"
            >
              Got it!
            </StarBorder>
          </div>
        </div>
      )}

      {/* Floating help toggle button */}
      {!showGuidance && (
        <button
          onClick={() => setShowGuidance(true)}
          className="fixed bottom-24 md:bottom-6 right-6 z-30 h-10 w-10 bg-neutral-800 hover:bg-neutral-700 border border-white/10 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all cursor-pointer hover:scale-105 active:scale-95"
          title="Show Whiteboard Instructions"
        >
          <HelpIcon className="h-5 w-5" />
        </button>
      )}

      {/* Tech Icons Search Modal */}
      {showIconsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop with blur */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => {
              setShowIconsModal(false);
              setIconSearchQuery("");
            }}
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-2xl mx-4 bg-neutral-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                  <svg className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Search Technology Icons</h2>
                  <p className="text-xs text-white/50">Browse and add custom tech icons to your canvas</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowIconsModal(false);
                  setIconSearchQuery("");
                }}
                className="p-1.5 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors cursor-pointer"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Search Input Bar */}
            <div className="p-6 pb-0">
              <div className="relative">
                <svg
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  value={iconSearchQuery}
                  onChange={(e) => setIconSearchQuery(e.target.value)}
                  placeholder="Search architecture icons (e.g. React, Node, MongoDB, AWS, Docker...)"
                  className="w-full pl-12 pr-10 py-3 bg-neutral-800 border border-white/10 rounded-xl text-sm text-white placeholder-white/40 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                  autoFocus
                />
                {iconSearchQuery && (
                  <button
                    onClick={() => setIconSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-colors cursor-pointer"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Icons Grid Content */}
            <div className="flex-1 overflow-y-auto p-6 min-h-[300px]">
              {filteredIcons.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {filteredIcons.map((iconItem) => (
                    <button
                      key={iconItem.id}
                      onClick={() => {
                        const event = new CustomEvent("addIconToCanvas", {
                          detail: iconItem,
                        });
                        window.dispatchEvent(event);
                        toast.success(`Added ${iconItem.name} to canvas!`);
                        setShowIconsModal(false);
                        setIconSearchQuery("");
                      }}
                      className="flex flex-col items-center gap-2 p-3 bg-neutral-800/40 hover:bg-neutral-850 border border-white/5 hover:border-purple-500/50 rounded-xl transition-all duration-200 group cursor-pointer hover:scale-105 active:scale-95"
                    >
                      <div className="w-12 h-12 flex items-center justify-center bg-neutral-900/50 rounded-lg p-2 border border-white/5 group-hover:border-purple-500/20">
                        <img
                          src={iconItem.icon}
                          alt={iconItem.name}
                          className="w-full h-full object-contain filter brightness-90 group-hover:brightness-100 transition-all"
                        />
                      </div>
                      <span className="text-[11px] font-medium text-white/70 group-hover:text-white text-center truncate w-full">
                        {iconItem.name}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-white/40">
                  <svg
                    className="h-12 w-12 mb-3 text-white/20"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-sm font-medium">No matching icons found</p>
                  <p className="text-xs mt-1 text-white/30 font-light">Try searching for other developer tools or platforms</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-neutral-950/60 border-t border-white/10 text-center text-[10px] text-white/40">
              Showing {filteredIcons.length} technology icons
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CanvasPage;
