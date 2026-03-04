import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import {
  IoAddCircleOutline as PlusCircleIcon,
  IoDocumentTextOutline as DocumentIcon,
  IoTimeOutline as ClockIcon,
  IoEllipsisVertical as EllipsisVerticalIcon,
  IoTrashOutline as TrashIcon,
  IoPencilOutline as PencilIcon,
} from "react-icons/io5";
import { useDiagramService } from "../services/diagramService";
import { loadingManager } from "../services/apiUtils";

const Dashboard = () => {
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();
  const { diagramService, isReady, isLoaded } = useDiagramService();
  const [projects, setProjects] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // Load projects from API on component mount
  useEffect(() => {
    const loadProjects = async () => {
      // Wait for all dependencies to be ready
      if (!isLoaded || !isSignedIn || !user || !isReady) {
        if (isLoaded && !isSignedIn) {
          navigate("/");
        }
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        loadingManager.startLoading("dashboard-projects");

        const response = await diagramService.getAllDiagrams();
        const diagrams = response.data || [];

        // Transform API data to match existing project structure
        const transformedProjects = diagrams.map((diagram) => ({
          id: diagram._id,
          title: diagram.title,
          createdAt: diagram.createdAt,
          lastModified: diagram.updatedAt || diagram.lastModified,
          data: {
            nodes: diagram.nodes || [],
            edges: diagram.edges || [],
          },
          nodeCount: (diagram.nodes || []).length,
          edgeCount: (diagram.edges || []).length,
        }));

        setProjects(transformedProjects);
        setRetryCount(0); // Reset retry count on success
      } catch (err) {
        const errorMsg = err.message || "Failed to load projects";

        // Handle specific error types
        if (errorMsg.includes("Unauthorized") || errorMsg.includes("sign in")) {
          setError("Authentication failed. Please sign in again.");
          setTimeout(() => navigate("/"), 2000);
        } else if (errorMsg.includes("timed out")) {
          setError(
            "Request timed out. The server may be waking up - please retry.",
          );
        } else if (
          err.name === "TypeError" ||
          errorMsg.includes("Failed to fetch")
        ) {
          setError(
            "Unable to connect to server. Please check your connection.",
          );
        } else {
          setError(errorMsg);
        }
      } finally {
        setIsLoading(false);
        loadingManager.stopLoading("dashboard-projects");
      }
    };

    loadProjects();
  }, [
    isLoaded,
    isSignedIn,
    user,
    isReady,
    diagramService,
    navigate,
    retryCount,
  ]);

  const handleRetry = () => {
    setRetryCount((c) => c + 1);
  };

  const handleNewProject = () => {
    navigate("/canvas?new=true");
  };

  const handleOpenProject = (projectId) => {
    navigate(`/canvas?project=${projectId}`);
  };

  const handleDeleteProject = async (projectId) => {
    try {
      loadingManager.startLoading(`delete-project-${projectId}`);
      await diagramService.deleteDiagram(projectId);

      // Update local state
      const updatedProjects = projects.filter(
        (project) => project.id !== projectId,
      );
      setProjects(updatedProjects);
      setShowDeleteConfirm(null);
    } catch (err) {
      console.error("Error deleting project:", err);
      alert("Failed to delete project: " + (err.message || "Unknown error"));
    } finally {
      loadingManager.stopLoading(`delete-project-${projectId}`);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white antialiased flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Access Restricted</h2>
          <p className="text-white/70">
            Please sign in to access your dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white antialiased">
      {/* Header */}
      <header className="border-b border-white/5 bg-neutral-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="h-9 w-12 rounded-lg " aria-hidden="true" />
            <img
              src="/logo.png"
              alt="Sketch On Logo"
              className="h-9 w-10 rounded-lg"
            />
            <div>
              <p className="text-xl font-semibold">Sketch On</p>
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                Dashboard
              </p>
            </div>
          </div>
          <Link
            to="/"
            className="text-sm text-white/60 hover:text-white transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-2">
            {/* Welcome back, {user?.firstName || user?.username || "User"}! 👋 */}
            Start designing your next project
          </h1>
          <p className="text-white/60">
            Continue working on your projects or start a new one.
          </p>
        </div>

        {/* New Project Button */}
        <div className="mb-8">
          <button
            onClick={handleNewProject}
            className="inline-flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-white/20 bg-white/5 px-6 py-4 text-left transition hover:border-white/40 hover:bg-white/10"
          >
            <PlusCircleIcon className="h-8 w-8 text-blue-400" />
            <div>
              <p className="font-semibold text-white">Start a new project</p>
              <p className="text-sm text-white/60">
                Create a new whiteboard canvas
              </p>
            </div>
          </button>
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-white/60">Loading your projects...</p>
            {retryCount > 0 && (
              <p className="text-white/40 text-sm mt-2">
                Attempt {retryCount + 1}...
              </p>
            )}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-400 mb-4">⚠️ Error loading projects</div>
            <p className="text-white/60 mb-4">{error}</p>
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            {error.includes("timed out") && (
              <p className="text-white/40 text-xs mt-3">
                Free-tier servers may take 30-60s to wake up on first request.
              </p>
            )}
          </div>
        ) : projects.length > 0 ? (
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <DocumentIcon className="h-5 w-5" />
              Your Projects ({projects.length})
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="group relative rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-white/20 hover:bg-white/10"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                        {project.title}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-white/50 mt-1">
                        <ClockIcon className="h-3 w-3" />
                        {formatDate(project.lastModified)}
                      </div>
                    </div>

                    {/* Dropdown Menu */}
                    <div className="relative">
                      <button
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDeleteConfirm(
                            showDeleteConfirm === project.id
                              ? null
                              : project.id,
                          );
                        }}
                      >
                        <EllipsisVerticalIcon className="h-4 w-4" />
                      </button>

                      {showDeleteConfirm === project.id && (
                        <div className="absolute right-0 top-8 z-10 rounded-lg border border-white/20 bg-neutral-800 p-2 shadow-xl">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteProject(project.id);
                            }}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-400/10 rounded transition-colors"
                          >
                            <TrashIcon className="h-4 w-4" />
                            Delete Project
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-sm text-white/60">
                      {project.nodeCount || 0} nodes • {project.edgeCount || 0}{" "}
                      connections
                    </p>
                  </div>

                  <button
                    onClick={() => handleOpenProject(project.id)}
                    className="w-full cursor-pointer rounded-lg border border-white/15 bg-white/5 py-2 text-sm font-medium text-white transition hover:border-white/30 hover:bg-white/10"
                  >
                    Open Project
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <DocumentIcon className="h-16 w-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white/80 mb-2">
              No projects yet
            </h3>
            <p className="text-white/50 mb-6">
              Start your first whiteboard project to get started.
            </p>
            <button
              onClick={handleNewProject}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white text-neutral-950 px-6 py-3 text-sm font-semibold transition hover:-translate-y-0.5 hover:bg-white/90"
            >
              <PlusCircleIcon className="h-4 w-4" />
              Create Your First Project
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
