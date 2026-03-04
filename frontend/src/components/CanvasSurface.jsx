import React, { useCallback, useEffect, useRef } from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  Controls,
  Background,
  ConnectionMode,
  useReactFlow,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";

import RectangleNode from "./nodes/RectangleNode";
import CircleNode from "./nodes/CircleNode";
import DiamondNode from "./nodes/DiamondNode";
import TextNode from "./nodes/TextNode";
import IconNode from "./nodes/IconNode";

const nodeTypes = {
  rectangle: RectangleNode,
  circle: CircleNode,
  diamond: DiamondNode,
  textNode: TextNode,
  iconNode: IconNode,
};

let id = 0;
const getId = () => `dndnode_${id++}`;

const CanvasFlow = ({ projectData, onDataChange }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const isLoadingData = useRef(false);
  const initialLoadComplete = useRef(false);
  const reactFlowWrapper = useRef(null);
  const { screenToFlowPosition } = useReactFlow();

  // Load project data when component mounts or projectData changes
  useEffect(() => {
    if (projectData && projectData.nodes && projectData.edges) {
      isLoadingData.current = true;

      // Restore nodes with their original positions and data
      const restoredNodes = projectData.nodes.map((node) => ({
        ...node,
        // Ensure position is preserved
        position: node.position || { x: 0, y: 0 },
        // Ensure data is preserved
        data: {
          ...node.data,
          onLabelChange: onNodeLabelChange,
        },
      }));

      setNodes(restoredNodes);
      setEdges(projectData.edges);

      // Update the id counter to avoid collisions
      const maxId = projectData.nodes.reduce((max, node) => {
        const nodeIdNum = parseInt(node.id.replace(/\D/g, ""), 10);
        return nodeIdNum > max ? nodeIdNum : max;
      }, 0);
      id = maxId + 1;

      // Mark initial load as complete and reset loading flag
      setTimeout(() => {
        isLoadingData.current = false;
        initialLoadComplete.current = true;
      }, 100);
    }
  }, [projectData, setNodes, setEdges]);

  // Notify parent component when data changes (only after user interactions)
  useEffect(() => {
    // Don't trigger onDataChange during initial load or when loading data from parent
    if (onDataChange && initialLoadComplete.current && !isLoadingData.current) {
      // Clean node data before sending to parent (remove function references)
      const cleanNodes = nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          onLabelChange: undefined, // Remove function reference
        },
      }));
      onDataChange(cleanNodes, edges);
    }
  }, [nodes, edges, onDataChange]);

  // Only connect when user explicitly drags from source handle to target handle
  const onConnect = useCallback(
    (params) => {
      // Validate connection - only connect if both source and target handles exist
      if (params.source && params.target && params.source !== params.target) {
        setEdges((eds) =>
          addEdge(
            {
              ...params,
              type: "default",
              animated: false,
            },
            eds,
          ),
        );
      }
    },
    [setEdges],
  );

  const onNodeLabelChange = useCallback(
    (nodeId, newLabel) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, label: newLabel } }
            : node,
        ),
      );
    },
    [setNodes],
  );

  // Custom nodes change handler - filter out automatic position changes during drag
  const handleNodesChange = useCallback(
    (changes) => {
      // Filter changes to prevent unwanted automatic movements
      const filteredChanges = changes.filter((change) => {
        // Allow all selection changes
        if (change.type === "select") return true;
        // Allow dimension changes
        if (change.type === "dimensions") return true;
        // Allow position changes (user dragging nodes)
        if (change.type === "position") return true;
        // Allow removal
        if (change.type === "remove") return true;
        // Allow add
        if (change.type === "add") return true;
        return true;
      });

      onNodesChange(filteredChanges);
    },
    [onNodesChange],
  );

  // Custom edges change handler
  const handleEdgesChange = useCallback(
    (changes) => {
      onEdgesChange(changes);
    },
    [onEdgesChange],
  );

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();

      const type = event.dataTransfer.getData("application/reactflow");
      const iconDataStr = event.dataTransfer.getData("application/icon-data");

      if (typeof type === "undefined" || !type) {
        return;
      }

      // Get the correct position using screenToFlowPosition
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      let newNode;

      if (type === "iconNode" && iconDataStr) {
        // Handle icon node with icon data
        try {
          const iconData = JSON.parse(iconDataStr);
          newNode = {
            id: getId(),
            type: "iconNode",
            position,
            draggable: true,
            selectable: true,
            data: {
              label: iconData.name,
              name: iconData.name,
              icon: iconData.icon,
              iconId: iconData.id,
              onLabelChange: onNodeLabelChange,
            },
          };
        } catch (e) {
          console.error("Error parsing icon data:", e);
          return;
        }
      } else {
        // Handle regular nodes
        const labelMap = {
          rectangle: "Rectangle",
          circle: "Circle",
          diamond: "Diamond",
          textNode: "Text",
        };

        newNode = {
          id: getId(),
          type,
          position,
          draggable: true,
          selectable: true,
          data: {
            label: labelMap[type] || type,
            onLabelChange: onNodeLabelChange,
          },
        };
      }

      setNodes((nds) => [...nds, newNode]);
    },
    [setNodes, onNodeLabelChange, screenToFlowPosition],
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = "move";
  }, []);

  // Prevent default drag behavior that might cause issues
  const onNodeDragStart = useCallback((event, node) => {
    // Just let the node drag normally, don't do anything special
  }, []);

  const onNodeDrag = useCallback((event, node) => {
    // Normal dragging behavior
  }, []);

  const onNodeDragStop = useCallback((event, node) => {
    // Node has been dropped, position will be updated automatically
  }, []);

  // Listen for custom event to add icons from modal click
  useEffect(() => {
    const handleAddIconToCanvas = (event) => {
      const iconData = event.detail;
      if (!iconData) return;

      // Add icon at center of the visible viewport
      const newNode = {
        id: getId(),
        type: "iconNode",
        position: { x: 250, y: 150 },
        draggable: true,
        selectable: true,
        data: {
          label: iconData.name,
          name: iconData.name,
          icon: iconData.icon,
          iconId: iconData.id,
          onLabelChange: onNodeLabelChange,
        },
      };

      setNodes((nds) => [...nds, newNode]);
    };

    window.addEventListener("addIconToCanvas", handleAddIconToCanvas);
    return () => {
      window.removeEventListener("addIconToCanvas", handleAddIconToCanvas);
    };
  }, [setNodes, onNodeLabelChange]);

  return (
    <div className="flex-1 h-full" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes.map((node) => ({
          ...node,
          data: { ...node.data, onLabelChange: onNodeLabelChange },
        }))}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeDragStart={onNodeDragStart}
        onNodeDrag={onNodeDrag}
        onNodeDragStop={onNodeDragStop}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        snapToGrid={true}
        snapGrid={[15, 15]}
        fitView
        fitViewOptions={{ padding: 0.2, maxZoom: 1 }}
        className="bg-neutral-950"
        deleteKeyCode={["Backspace", "Delete"]}
        selectionKeyCode={["Shift"]}
        multiSelectionKeyCode={["Meta", "Ctrl"]}
        panOnDrag={[1, 2]} // Only pan with middle mouse or right click
        selectNodesOnDrag={false}
        nodesDraggable={true}
        nodesConnectable={true}
        elementsSelectable={true}
        autoPanOnConnect={false}
        autoPanOnNodeDrag={false}
        connectOnClick={false}
        defaultEdgeOptions={{
          type: "default",
          animated: false,
        }}
      >
        <Controls className="bg-neutral-800 border border-white/10 [&>button]:bg-neutral-800 [&>button]:border-white/10 [&>button]:text-white [&>button:hover]:bg-neutral-700" />
        <Background color="#404040" gap={15} />
      </ReactFlow>
    </div>
  );
};

// Wrap with ReactFlowProvider for screenToFlowPosition to work
const CanvasSurface = ({ projectData, onDataChange }) => {
  return (
    <ReactFlowProvider>
      <CanvasFlow projectData={projectData} onDataChange={onDataChange} />
    </ReactFlowProvider>
  );
};

export default CanvasSurface;
