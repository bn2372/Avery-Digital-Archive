import React, { useEffect, useState, useRef } from "react";
import ModalPortalPixelated from "../components/ModalPortalPixelated";
import { useNavigate } from "react-router-dom";

export default function SelectedImages() {
  const [selectedImages, setSelectedImages] = useState([]);
  const [pixelationLevel, setPixelationLevel] = useState(
    Number(localStorage.getItem("pixelationLevel")) || 600
  );
  const [selectedSrc, setSelectedSrc] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const selectedSrcs = JSON.parse(localStorage.getItem("selectedItems")) || [];
    const allArtifacts = JSON.parse(localStorage.getItem("allArtifacts")) || [];

    const filtered = allArtifacts.filter(
      (artifact) => selectedSrcs.includes(artifact.src) && artifact.type === "image"
    );

    setSelectedImages(filtered);
  }, []);

  function handlePixelationChange(e) {
    const value = Number(e.target.value);
    setPixelationLevel(value);
    localStorage.setItem("pixelationLevel", value); // ✅ Save to localStorage
  }

  function openModal(src) {
    setSelectedSrc(src);
  }

  function closeModal() {
    setSelectedSrc(null);
  }

  return (
    <div className="p-6 font-sans bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Selected Images</h1>
      <p className="text-center text-lg text-gray-700 mt-2 mb-8">
        How many pixels should we hold onto? Move the slider to decide!
      </p>

      {/* Pixelation Slider */}
      <div className="mb-12 max-w-md mx-auto">
        <label className="block text-lg font-medium text-gray-700 mb-2 text-center">
          Adjust Pixelation
        </label>
        <input
          type="range"
          min="10"
          max="1200" // ✅ Increased range
          value={pixelationLevel}
          onChange={handlePixelationChange}
          className="w-full"
        />
        <p className="text-center text-sm mt-2">{pixelationLevel}px internal resolution</p>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-3 gap-8 max-w-7xl mx-auto">
        {selectedImages.map((item) => (
          <div key={item.src} className="flex flex-col items-center space-y-2">
            <div
              className="aspect-square w-full overflow-hidden rounded relative border border-gray-300 flex items-center justify-center bg-white"
            >
              <CanvasThumbnail src={item.src} pixelationLevel={pixelationLevel} />
            </div>

            <button
              className="px-3 py-1 text-sm bg-black text-white rounded"
              onClick={() => openModal(item.src)}
            >
              Preview
            </button>
          </div>
        ))}
      </div>

      {selectedSrc && (
        <ModalPortalPixelated
          selectedSrc={selectedSrc}
          pixelationLevel={pixelationLevel}
          closeModal={closeModal}
        />
      )}

      <div className="flex justify-center mt-12">
        <button
          className="px-6 py-3 bg-blue-600 text-white text-lg rounded hover:bg-blue-700"
          onClick={() => navigate("/selected-videos")}
        >
          Next
        </button>
      </div>
    </div>
  );
}

// ✅ Updated Canvas rendering function
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
        width: "240px",
        height: "240px",
        backgroundColor: "white",
        imageRendering: "pixelated",
      }}
    />
  );
}
