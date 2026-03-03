import React, { useState, useEffect, useCallback, useRef } from "react";
import { useUser } from "@clerk/clerk-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  IoCloseOutline as XMarkIcon,
  IoDocumentTextOutline as DocumentTextIcon,
} from "react-icons/io5";
import Sidebar from "./Sidebar";
import CanvasSurface from "../../components/CanvasSurface";
import { useDiagramService } from "../../services/diagramService";
import { loadingManager } from "../../services/apiUtils";

const CanvasPage = () => {
  const { isSignedIn, user } = useUser();
  const { diagramService, isReady } = useDiagramService();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [showTitleModal, setShowTitleModal] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [projectData, setProjectData] = useState({ nodes: [], edges: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState("saved"); // 'saved', 'saving', 'unsaved'
  const isUpdatingFromParent = useRef(false);

  // Modal states
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

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
      const newUrl = `/canvas?project=${newProject.id}`;
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
        />
        {/* Add padding bottom on mobile for the bottom bar */}
        <div className="flex-1 h-full md:pb-0 pb-24">
          <CanvasSurface
            projectData={projectData}
            onDataChange={handleProjectDataChange}
          />
        </div>
      </div>

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
    </>
  );
};

export default CanvasPage;
