import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ReactDOM from "react-dom";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { SimplifyModifier } from "three/examples/jsm/modifiers/SimplifyModifier";

export default function SelectedModels() {
  const [selectedModels, setSelectedModels] = useState([]);
  const [selectedSrc, setSelectedSrc] = useState(null);
  const [sceneReady, setSceneReady] = useState(false);
  const [loadingScene, setLoadingScene] = useState(false);
  const sceneRef = useRef(null);
  const loaderRef = useRef(null);
  const originalMeshRef = useRef(null);
  const simplifiedMeshRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const selectedSrcs = JSON.parse(localStorage.getItem('selectedItems')) || [];
      const allArtifacts = JSON.parse(localStorage.getItem('allArtifacts')) || [];

      const filtered = allArtifacts.filter(
        (artifact) => selectedSrcs.includes(artifact.src) && artifact.type === "3d"
      );

      console.log("🛠️ Selected 3D models:", filtered);
      setSelectedModels(filtered);
    } catch (error) {
      console.error("❗ Error loading selected models:", error);
    }
  }, []);

  // Setup Three.js Scene Once
  useEffect(() => {
    if (!sceneRef.current) {
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xffffff);
      sceneRef.current = scene;
    }

    if (!loaderRef.current) {
      loaderRef.current = new GLTFLoader();
    }

    setSceneReady(true);
  }, []);

  function openModal(src) {
    setSelectedSrc(src);
  }

  function closeModal() {
    setSelectedSrc(null);
  }

  function loadModelToThree(src) {
    if (!sceneReady || !loaderRef.current || !sceneRef.current) return;

    setLoadingScene(true);

    // Clear scene
    while (sceneRef.current.children.length > 0) {
      sceneRef.current.remove(sceneRef.current.children[0]);
    }

    loaderRef.current.load(
      src,
      (gltf) => {
        console.log("✅ GLB model loaded into Three.js scene.");
        const model = gltf.scene;

        // Find first Mesh
        let mesh = null;
        model.traverse((child) => {
          if (child.isMesh && !mesh) {
            mesh = child;
          }
        });

        if (mesh) {
          console.log("✅ Found mesh:", mesh);
          originalMeshRef.current = mesh.clone();
          simplifiedMeshRef.current = mesh.clone();
          sceneRef.current.add(simplifiedMeshRef.current);
        } else {
          console.error("❗ No mesh found inside model.");
        }
        setLoadingScene(false);
      },
      undefined,
      (error) => {
        console.error("❗ Error loading model:", error);
        setLoadingScene(false);
      }
    );
  }

  function applySimplification(percentKeep) {
    if (!originalMeshRef.current || !simplifiedMeshRef.current) return;

    const modifier = new SimplifyModifier();
    const oldGeometry = originalMeshRef.current.geometry;
    const targetCount = Math.floor(oldGeometry.attributes.position.count * (percentKeep / 100));

    console.log(`🔧 Keeping ${percentKeep}% of vertices -> Target: ${targetCount} vertices`);

    const simplifiedGeometry = modifier.modify(oldGeometry, targetCount);

    simplifiedMeshRef.current.geometry.dispose();
    simplifiedMeshRef.current.geometry = simplifiedGeometry;
  }

  return (
    <div className="p-6 font-sans bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Selected 3D Models</h1>

      {/* Reduction Buttons */}
      <div className="flex justify-center gap-4 mb-12">
        <button
          onClick={() => applySimplification(75)}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
        >
          Keep 75%
        </button>
        <button
          onClick={() => applySimplification(50)}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
        >
          Keep 50%
        </button>
        <button
          onClick={() => applySimplification(25)}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
        >
          Keep 25%
        </button>
      </div>

      {/* Model Grid */}
      {selectedModels.length > 0 ? (
        <div className="grid grid-cols-3 gap-8 max-w-7xl mx-auto">
          {selectedModels.map((item) => (
            <div key={item.src} className="flex flex-col items-center space-y-2">
              {/* Static Image Thumbnail */}
              <div
                className="aspect-square w-full overflow-hidden rounded relative border border-gray-300 flex items-center justify-center bg-white"
              >
                <img
                  src={`/thumbnails/${item.src.split('/').pop().replace('.glb', '.jpg')}`}
                  alt="Model Thumbnail"
                  className="object-cover w-full h-full"
                />
              </div>

              {/* Preview Button */}
              <button
                className="px-3 py-1 text-sm bg-black text-white rounded"
                onClick={() => {
                  loadModelToThree(item.src);
                  openModal(item.src);
                }}
              >
                Preview
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-12">No 3D models selected.</p>
      )}

      {/* Modal */}
      {selectedSrc && !loadingScene && (
        <ModalPortalModel closeModal={closeModal} />
      )}

      {/* Next Button */}
      <div className="flex justify-center mt-12">
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-blue-600 text-white text-lg rounded hover:bg-blue-700"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function ModalPortalModel({ closeModal }) {
  const canvasRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const animationIdRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !sceneRef.current) return;

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true });
    renderer.setSize(600, 600);
    renderer.setPixelRatio(window.devicePixelRatio);
    rendererRef.current = renderer;

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.set(0, 0, 5);
    cameraRef.current = camera;

    function animate() {
      animationIdRef.current = requestAnimationFrame(animate);
      renderer.render(sceneRef.current, camera);
    }
    animate();

    return () => {
      cancelAnimationFrame(animationIdRef.current);
      if (renderer) {
        renderer.dispose();
      }
    };
  }, []);

  return ReactDOM.createPortal(
    <div
      onClick={closeModal}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          backgroundColor: "white",
          padding: "20px",
          border: "6px solid black",
          borderRadius: "0px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          maxWidth: "90vw",
          maxHeight: "90vh",
        }}
      >
        {/* Close Button */}
        <button
          onClick={closeModal}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "none",
            border: "none",
            fontSize: "24px",
            cursor: "pointer",
            color: "black",
          }}
        >
          ✖
        </button>

        {/* New Live Three.js Canvas */}
        <canvas
          ref={canvasRef}
          style={{
            width: "600px",
            height: "600px",
            backgroundColor: "#f0f0f0",
          }}
        />
      </div>
    </div>,
    document.body
  );
}
