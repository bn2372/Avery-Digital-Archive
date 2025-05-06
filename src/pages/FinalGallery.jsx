import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "@google/model-viewer";

export default function FinalGallery() {
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [selectedModels, setSelectedModels] = useState([]);
  const [pixelationLevel, setPixelationLevel] = useState(240);
  const [videoFilter, setVideoFilter] = useState("normal");
  const [totalSizeMB, setTotalSizeMB] = useState(0);
  const [treesCutDown, setTreesCutDown] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const selectedSrcs = JSON.parse(localStorage.getItem("selectedItems")) || [];
    const allArtifacts = JSON.parse(localStorage.getItem("allArtifacts")) || [];
    const savedPixelation = Number(localStorage.getItem("pixelationLevel")) || 240;
    const savedVideoFilter = localStorage.getItem("videoFilter") || "normal";

    const filteredImages = allArtifacts.filter(
      (artifact) => selectedSrcs.includes(artifact.src) && artifact.type === "image"
    );
    const filteredVideos = allArtifacts.filter(
      (artifact) => selectedSrcs.includes(artifact.src) && artifact.type === "video"
    );
    const filteredModels = allArtifacts.filter(
      (artifact) => selectedSrcs.includes(artifact.src) && artifact.type === "3d"
    );

    setSelectedImages(filteredImages);
    setSelectedVideos(filteredVideos);
    setSelectedModels(filteredModels);
    setPixelationLevel(savedPixelation);
    setVideoFilter(savedVideoFilter);

    const baseImageSize = 500 * 1024; // 500 KB
    const baseVideoSize = 5 * 1024 * 1024; // 5 MB
    const baseModelSize = 2 * 1024 * 1024; // 2 MB

    let totalBytes = 0;

    filteredImages.forEach(() => {
      const compressionRatio = savedPixelation / 600;
      totalBytes += baseImageSize * compressionRatio;
    });

    filteredVideos.forEach(() => {
      let videoSize = baseVideoSize;
      if (savedVideoFilter === "grayscale") {
        videoSize *= 0.7;
      }
      totalBytes += videoSize;
    });

    filteredModels.forEach(() => {
      totalBytes += baseModelSize;
    });

    const totalMB = totalBytes / (1024 * 1024);
    const totalGB = totalMB / 1024;
    const trees = totalGB * 9;

    setTotalSizeMB(totalMB);
    setTreesCutDown(trees);
  }, []);

  function handleRestart() {
    localStorage.clear();
    navigate("/");
  }

  return (
    <div className="p-6 font-sans bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Final Curated Collection</h1>

      <h2 className="text-xl font-medium text-center mb-12 max-w-3xl mx-auto">
        You have created an archive that is <strong>{(totalSizeMB * 1024).toFixed(0)} KB</strong> large.
        Your decisions have resulted in <strong>{((totalSizeMB / 1024) * 1.8 * 100).toFixed(2)} kg</strong> of CO₂ emissions
        over the course of 100 years. That's the equivalent of <strong>{treesCutDown.toFixed(2)}</strong> trees cut down.
      </h2>

      {selectedImages.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mb-4">Selected Images</h2>
          <div className="grid grid-cols-3 gap-8 mb-12">
            {selectedImages.map((item) => (
              <GalleryItem key={item.src}>
                <CanvasThumbnail src={item.src} pixelationLevel={pixelationLevel} />
              </GalleryItem>
            ))}
          </div>
        </>
      )}

      {selectedVideos.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mb-4">Selected Videos</h2>
          <div className="grid grid-cols-3 gap-8 mb-12">
            {selectedVideos.map((item) => (
              <GalleryItem key={item.src}>
                <video
                  src={item.src}
                  muted
                  loop
                  autoPlay
                  playsInline
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: videoFilter === "grayscale" ? "grayscale(100%)" : "none",
                    animation: videoFilter === "slow" ? "stutter 0.6s infinite" : "none",
                  }}
                />
              </GalleryItem>
            ))}
          </div>
        </>
      )}

      {selectedModels.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mb-4">Selected 3D Models</h2>
          <div className="grid grid-cols-3 gap-8 mb-12">
            {selectedModels.map((item) => (
              <GalleryItem key={item.src}>
                <model-viewer
                  src={item.src}
                  camera-controls
                  auto-rotate
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#f0f0f0",
                    objectFit: "contain",
                  }}
                />
              </GalleryItem>
            ))}
          </div>
        </>
      )}

      <div className="flex justify-center mt-12">
        <button
          onClick={handleRestart}
          className="px-6 py-3 bg-red-600 text-white text-lg rounded hover:bg-red-700"
        >
          Restart
        </button>
      </div>
    </div>
  );
}

function GalleryItem({ children }) {
  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="w-[300px] h-[300px] overflow-hidden flex items-center justify-center bg-white border border-gray-300">
        {children}
      </div>
    </div>
  );
}

function CanvasThumbnail({ src, pixelationLevel }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const canvas = canvasRef.current;
      canvas.width = pixelationLevel;
      canvas.height = pixelationLevel;
      const ctx = canvas.getContext("2d");

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingEnabled = false;

      const cropSize = Math.min(img.width, img.height);
      const cropX = (img.width - cropSize) / 2;
      const cropY = (img.height - cropSize) / 2;

      ctx.drawImage(
        img,
        cropX,
        cropY,
        cropSize,
        cropSize,
        0,
        0,
        pixelationLevel,
        pixelationLevel
      );
    };
  }, [src, pixelationLevel]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "300px",
        height: "300px",
        backgroundColor: "white",
        imageRendering: "pixelated",
      }}
    />
  );
}
