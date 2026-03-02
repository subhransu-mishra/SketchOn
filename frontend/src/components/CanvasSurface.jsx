import React, { useCallback, useEffect, useRef } from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  Controls,
  Background,
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

const CanvasSurface = ({ projectData, onDataChange }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const isLoadingData = useRef(false);
  const initialLoadComplete = useRef(false);

  // Load project data when component mounts or projectData changes
  useEffect(() => {
    if (projectData && projectData.nodes && projectData.edges) {
      isLoadingData.current = true;
      setNodes(projectData.nodes);
      setEdges(projectData.edges);

      // Mark initial load as complete and reset loading flag
      setTimeout(() => {
        isLoadingData.current = false;
        initialLoadComplete.current = true;
      }, 50);
    }
  }, [projectData, setNodes, setEdges]);

  // Notify parent component when data changes (only after user interactions)
  useEffect(() => {
    // Don't trigger onDataChange during initial load or when loading data from parent
    if (onDataChange && initialLoadComplete.current && !isLoadingData.current) {
      onDataChange(nodes, edges);
    }
  }, [nodes, edges, onDataChange]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
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

  // Wrap onNodesChange to track user interactions
  const handleNodesChange = useCallback(
    (changes) => {
      onNodesChange(changes);
    },
    [onNodesChange],
  );

  // Wrap onEdgesChange to track user interactions
  const handleEdgesChange = useCallback(
    (changes) => {
      onEdgesChange(changes);
    },
    [onEdgesChange],
  );

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");
      const iconDataStr = event.dataTransfer.getData("application/icon-data");

      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      let newNode;

      if (type === "iconNode" && iconDataStr) {
        // Handle icon node with icon data
        try {
          const iconData = JSON.parse(iconDataStr);
          newNode = {
            id: getId(),
            type: "iconNode",
            position,
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
        newNode = {
          id: getId(),
          type,
          position,
          data: { label: `${type} node`, onLabelChange: onNodeLabelChange },
        };
      }

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes, onNodeLabelChange],
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  return (
    <div className="flex-1 h-full">
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
        nodeTypes={nodeTypes}
        fitView
        className="bg-neutral-950"
      >
        <Controls className="bg-neutral-800 border border-white/10" />
        <Background color="#404040" />
      </ReactFlow>
    </div>
  );
};

export default CanvasSurface;
