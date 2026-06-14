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
import ArrowNode from "./nodes/ArrowNode";
import AnimatedSvgEdge from "./AnimatedSvgEdge";

const DEFAULT_NODE_STYLES = {
  rectangle: { width: 160, height: 90, color: "#2563eb" },
  circle: { width: 120, height: 120, color: "#16a34a" },
  diamond: { width: 100, height: 100, color: "#7c3aed" },
  textNode: { width: 150, height: 70, color: "transparent" },
  iconNode: { width: 150, height: 180 },
  arrowNode: { width: 160, height: 80, color: "#c084fc" },
};

const nodeTypes = {
  rectangle: RectangleNode,
  circle: CircleNode,
  diamond: DiamondNode,
  textNode: TextNode,
  iconNode: IconNode,
  arrowNode: ArrowNode,
};

const edgeTypes = {
  animatedSvg: AnimatedSvgEdge,
};

let id = 0;
const getId = () => `dndnode_${id++}`;

const CanvasFlow = ({ projectData, onDataChange, readOnly = false }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const isLoadingData = useRef(false);
  const initialLoadComplete = useRef(false);
  const reactFlowWrapper = useRef(null);
  const { screenToFlowPosition } = useReactFlow();

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

  const onNodeColorChange = useCallback(
    (nodeId, newColor) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, color: newColor } }
            : node,
        ),
      );
    },
    [setNodes],
  );

  const onNodeResize = useCallback(
    (nodeId, width, height) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, width, height } }
            : node,
        ),
      );
    },
    [setNodes],
  );

  const onFontSizeChange = useCallback(
    (nodeId, newFontSize) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, fontSize: newFontSize } }
            : node,
        ),
      );
    },
    [setNodes],
  );

  const onTextColorChange = useCallback(
    (nodeId, newTextColor) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, textColor: newTextColor } }
            : node,
        ),
      );
    },
    [setNodes],
  );

  const onEdgeClick = useCallback(
    (event, edge) => {
      if (readOnly) return;
      setEdges((eds) =>
        eds.map((ed) =>
          ed.id === edge.id
            ? {
                ...ed,
                type: ed.type === "animatedSvg" ? "default" : "animatedSvg",
                animated: ed.type === "animatedSvg" ? false : true,
              }
            : ed,
        ),
      );
    },
    [setEdges, readOnly],
  );

  const onPaneDoubleClick = useCallback(
    (event) => {
      if (readOnly) return;

      if (!event.target.classList.contains("react-flow__pane")) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const defaults = DEFAULT_NODE_STYLES.textNode;
      const newNode = {
        id: getId(),
        type: "textNode",
        position,
        draggable: true,
        selectable: true,
        style: {
          width: defaults.width,
          height: defaults.height,
        },
        data: {
          label: "Double-click to edit text",
          onLabelChange: onNodeLabelChange,
          onColorChange: onNodeColorChange,
          onResize: onNodeResize,
          onFontSizeChange: onFontSizeChange,
          onTextColorChange: onTextColorChange,
          color: defaults.color,
          fontSize: "14px",
          textColor: "#ffffff",
          width: defaults.width,
          height: defaults.height,
        },
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [
      readOnly,
      screenToFlowPosition,
      onNodeLabelChange,
      onNodeColorChange,
      onNodeResize,
      onFontSizeChange,
      onTextColorChange,
      setNodes,
    ]
  );

  // Load project data when component mounts or projectData changes
  useEffect(() => {
    if (projectData && projectData.nodes && projectData.edges) {
      isLoadingData.current = true;

      // Restore nodes with their original positions and data
      const restoredNodes = projectData.nodes.map((node) => {
        const defaults = DEFAULT_NODE_STYLES[node.type] || {};
        const width = node.data?.width || defaults.width;
        const height = node.data?.height || defaults.height;
        const color = node.data?.color || defaults.color;

        return {
          ...node,
          // Ensure position is preserved
          position: node.position || { x: 0, y: 0 },
          style: {
            ...node.style,
            ...(width ? { width } : {}),
            ...(height ? { height } : {}),
          },
          // Ensure data is preserved
          data: {
            ...node.data,
            ...(color ? { color } : {}),
            ...(width ? { width } : {}),
            ...(height ? { height } : {}),
            onLabelChange: onNodeLabelChange,
            onColorChange: onNodeColorChange,
            onResize: onNodeResize,
            onFontSizeChange,
            onTextColorChange,
          },
        };
      });

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
  }, [projectData, setNodes, setEdges, onNodeLabelChange, onNodeColorChange, onNodeResize, onFontSizeChange, onTextColorChange]);

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
          onColorChange: undefined,
          onResize: undefined,
          onFontSizeChange: undefined,
          onTextColorChange: undefined,
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
      const arrowType = event.dataTransfer.getData("application/arrow-type");

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
          const defaults = DEFAULT_NODE_STYLES.iconNode;
          newNode = {
            id: getId(),
            type: "iconNode",
            position,
            draggable: true,
            selectable: true,
            style: {
              width: defaults.width,
              height: defaults.height,
            },
            data: {
              label: iconData.name,
              name: iconData.name,
              icon: iconData.icon,
              iconId: iconData.id,
              onLabelChange: onNodeLabelChange,
              onResize: onNodeResize,
              onFontSizeChange: onFontSizeChange,
              onTextColorChange: onTextColorChange,
              width: defaults.width,
              height: defaults.height,
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
          arrowNode: "Arrow",
        };

        const defaults = DEFAULT_NODE_STYLES[type] || {};
        newNode = {
          id: getId(),
          type,
          position,
          draggable: true,
          selectable: true,
          style: {
            ...(defaults.width ? { width: defaults.width } : {}),
            ...(defaults.height ? { height: defaults.height } : {}),
          },
          data: {
            label: labelMap[type] || type,
            onLabelChange: onNodeLabelChange,
            onColorChange: onNodeColorChange,
            onResize: onNodeResize,
            onFontSizeChange: onFontSizeChange,
            onTextColorChange: onTextColorChange,
            ...(defaults.color ? { color: defaults.color } : {}),
            ...(defaults.width ? { width: defaults.width } : {}),
            ...(defaults.height ? { height: defaults.height } : {}),
            ...(arrowType ? { arrowType } : {}),
          },
        };
      }

      setNodes((nds) => [...nds, newNode]);
    },
    [
      setNodes,
      onNodeLabelChange,
      onNodeColorChange,
      onNodeResize,
      onFontSizeChange,
      onTextColorChange,
      screenToFlowPosition,
    ],
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
      const defaults = DEFAULT_NODE_STYLES.iconNode;
      const newNode = {
        id: getId(),
        type: "iconNode",
        position: { x: 250, y: 150 },
        draggable: true,
        selectable: true,
        style: {
          width: defaults.width,
          height: defaults.height,
        },
        data: {
          label: iconData.name,
          name: iconData.name,
          icon: iconData.icon,
          iconId: iconData.id,
          onLabelChange: onNodeLabelChange,
          onResize: onNodeResize,
          onFontSizeChange,
          onTextColorChange,
          width: defaults.width,
          height: defaults.height,
        },
      };

      setNodes((nds) => [...nds, newNode]);
    };

    window.addEventListener("addIconToCanvas", handleAddIconToCanvas);
    return () => {
      window.removeEventListener("addIconToCanvas", handleAddIconToCanvas);
    };
  }, [setNodes, onNodeLabelChange, onNodeResize, onFontSizeChange, onTextColorChange]);

  return (
    <div className="flex-1 h-full" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes.map((node) => ({
          ...node,
          style: {
            ...node.style,
            ...(node.data?.width ? { width: node.data.width } : {}),
            ...(node.data?.height ? { height: node.data.height } : {}),
          },
          data: {
            ...node.data,
            readOnly,
            onLabelChange: onNodeLabelChange,
            onColorChange: onNodeColorChange,
            onResize: onNodeResize,
            onFontSizeChange,
            onTextColorChange,
          },
        }))}
        edges={edges}
        onNodesChange={readOnly ? undefined : handleNodesChange}
        onEdgesChange={readOnly ? undefined : handleEdgesChange}
        onConnect={readOnly ? undefined : onConnect}
        onDrop={readOnly ? undefined : onDrop}
        onDragOver={readOnly ? undefined : onDragOver}
        onNodeDragStart={readOnly ? undefined : onNodeDragStart}
        onNodeDrag={readOnly ? undefined : onNodeDrag}
        onNodeDragStop={readOnly ? undefined : onNodeDragStop}
        onPaneDoubleClick={readOnly ? undefined : onPaneDoubleClick}
        onEdgeClick={readOnly ? undefined : onEdgeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionMode={ConnectionMode.Loose}
        snapToGrid={true}
        snapGrid={[15, 15]}
        fitView
        fitViewOptions={{ padding: 0.2, maxZoom: 1 }}
        className="bg-neutral-950"
        deleteKeyCode={readOnly ? null : ["Backspace", "Delete"]}
        selectionKeyCode={readOnly ? null : ["Shift"]}
        multiSelectionKeyCode={readOnly ? null : ["Meta", "Ctrl"]}
        panOnDrag={readOnly ? true : [1, 2]} // In readOnly, pan with left click drag
        selectNodesOnDrag={false}
        nodesDraggable={!readOnly}
        nodesConnectable={!readOnly}
        elementsSelectable={!readOnly}
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
const CanvasSurface = ({ projectData, onDataChange, readOnly }) => {
  return (
    <ReactFlowProvider>
      <CanvasFlow projectData={projectData} onDataChange={onDataChange} readOnly={readOnly} />
    </ReactFlowProvider>
  );
};

export default CanvasSurface;
