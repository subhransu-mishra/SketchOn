import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  IoDocumentTextOutline as DocumentIcon,
  IoLockClosedOutline as LockIcon,
  IoHomeOutline as HomeIcon,
} from "react-icons/io5";
import { useDiagramService } from "../services/diagramService";
import CanvasSurface from "../components/CanvasSurface";

const SharePage = () => {
  const { projectId } = useParams();
  const { diagramService } = useDiagramService();
  const [projectData, setProjectData] = useState(null);
  const [projectTitle, setProjectTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSharedProject = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await diagramService.getPublicDiagram(projectId);
        
        if (response.success && response.data) {
          const diagram = response.data;
          setProjectTitle(diagram.title);
          setProjectData({
            nodes: diagram.nodes || [],
            edges: diagram.edges || [],
          });
        } else {
          setError("Diagram not found or not shared publicly");
        }
      } catch (err) {
        console.error("Error loading public project:", err);
        setError(err.message || "Failed to load project");
      } finally {
        setIsLoading(false);
      }
    };

    if (projectId) {
      fetchSharedProject();
    }
  }, [projectId, diagramService]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white antialiased flex flex-col items-center justify-center">
        <div className="animate-spin h-10 w-10 border-2 border-purple-500 border-t-transparent rounded-full mb-4"></div>
        <p className="text-white/60 font-medium">Loading whiteboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white antialiased flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-neutral-900 border border-white/10 rounded-2xl p-8 text-center shadow-2xl">
          <div className="h-16 w-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <LockIcon className="h-8 w-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Whiteboard Unavailable</h2>
          <p className="text-white/60 mb-8 leading-relaxed">
            The whiteboard you are trying to view does not exist, or has not been shared publicly by its owner.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              to="/"
              className="flex items-center justify-center gap-2 w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30"
            >
              <HomeIcon className="h-4 w-4" />
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-neutral-950 text-white flex flex-col overflow-hidden">
      {/* Header */}
      <header className="border-b border-white/5 bg-neutral-900/80 backdrop-blur-md px-6 py-4 flex items-center justify-between z-10 flex-shrink-0">
        <div className="flex items-center gap-3">
          <DocumentIcon className="h-5 w-5 text-purple-400" />
          <div>
            <h1 className="text-base font-semibold text-white truncate max-w-[200px] sm:max-w-[400px]">
              {projectTitle}
            </h1>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-semibold">
              Sketch On Public View
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] font-semibold text-purple-400 bg-purple-400/10 border border-purple-400/20 rounded-full px-2.5 py-1">
            👁️ Read-Only
          </span>
          <Link
            to="/dashboard"
            className="text-xs text-white/60 hover:text-white border border-white/10 hover:bg-white/5 rounded-lg px-3 py-1.5 transition-all"
          >
            Dashboard
          </Link>
        </div>
      </header>

      {/* Canvas */}
      <div className="flex-1 h-full relative">
        <CanvasSurface projectData={projectData} readOnly={true} />
      </div>
    </div>
  );
};

export default SharePage;
