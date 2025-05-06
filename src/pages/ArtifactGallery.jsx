import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ModalPortal from "../components/ModalPortal"; // Adjust if needed
import "@google/model-viewer";

export default function ArtifactGallery() {
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedArtifact, setSelectedArtifact] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    import("@google/model-viewer");
  }, []);

  const artifacts = [
    { type: "image", src: "/artifacts/image1.jpg" },
    { type: "image", src: "/artifacts/image2.jpg" },
    { type: "image", src: "/artifacts/image3.jpg" },
    { type: "image", src: "/artifacts/image4.jpg" },
    { type: "image", src: "/artifacts/image5.jpg" },
    { type: "image", src: "/artifacts/image6.jpg" },
    { type: "image", src: "/artifacts/image7.jpg" },
    { type: "image", src: "/artifacts/image8.jpg" },
    { type: "image", src: "/artifacts/image9.jpg" },
    { type: "image", src: "/artifacts/image10.jpg" },
    { type: "image", src: "/artifacts/image11.png" },
    { type: "image", src: "/artifacts/image12.jpeg" },
    { type: "image", src: "/artifacts/image13.jpg" },
    { type: "image", src: "/artifacts/image14.jpg" },
    { type: "video", src: "/artifacts/video1.mp4" },
    { type: "video", src: "/artifacts/video2.mp4" },
    { type: "video", src: "/artifacts/video3.mp4" },
    { type: "3d", src: "/artifacts/model1.glb" },
  ];

  const images = artifacts.filter(a => a.type === "image");
  const videos = artifacts.filter(a => a.type === "video");
  const models = artifacts.filter(a => a.type === "3d");

  function toggleSelection(itemSrc) {
    setSelectedItems(prevSelected =>
      prevSelected.includes(itemSrc)
        ? prevSelected.filter(src => src !== itemSrc)
        : [...prevSelected, itemSrc]
    );
  }

  function openModal(item) {
    setSelectedArtifact(item);
  }

  function closeModal() {
    setSelectedArtifact(null);
  }

  function handleNext() {
    localStorage.setItem('selectedItems', JSON.stringify(selectedItems));
    localStorage.setItem('allArtifacts', JSON.stringify(artifacts));
    navigate("/selected-images");
  }

  return (
    <div className="p-6 font-sans bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Digital Archive Browser</h1>
      <p className="text-center text-lg text-gray-700 mt-2 mb-8">
        Click the images, videos, and 3D models you want to preserve!
      </p>
      {/* Images */}
      <h2 className="text-2xl font-bold mb-4">Images</h2>
      <div className="grid grid-cols-3 gap-8 mb-12">
        {images.map((item) => (
          <GalleryItem
            key={item.src}
            item={item}
            selected={selectedItems.includes(item.src)}
            toggleSelection={toggleSelection}
            openModal={openModal}
          />
        ))}
      </div>

      {/* Videos */}
      <h2 className="text-2xl font-bold mb-4">Videos</h2>
      <div className="grid grid-cols-3 gap-8 mb-12">
        {videos.map((item) => (
          <GalleryItem
            key={item.src}
            item={item}
            selected={selectedItems.includes(item.src)}
            toggleSelection={toggleSelection}
            openModal={openModal}
          />
        ))}
      </div>

      {/* 3D Models */}
      <h2 className="text-2xl font-bold mb-4">3D Models</h2>
      <div className="grid grid-cols-3 gap-8 mb-12">
        {models.map((item) => (
          <GalleryItem
            key={item.src}
            item={item}
            selected={selectedItems.includes(item.src)}
            toggleSelection={toggleSelection}
            openModal={openModal}
          />
        ))}
      </div>

      {/* Next Button */}
      <div className="flex justify-center mt-12">
        <button
          onClick={handleNext}
          className="px-6 py-3 bg-blue-600 text-white text-lg rounded hover:bg-blue-700"
        >
          Next
        </button>
      </div>

      {/* Modal */}
      {selectedArtifact && (
        <ModalPortal selectedArtifact={selectedArtifact} closeModal={closeModal} />
      )}
    </div>
  );
}

// GalleryItem Component
function GalleryItem({ item, selected, toggleSelection, openModal }) {
  return (
    <div className="flex flex-col items-center space-y-2">
      <div
        onClick={() => toggleSelection(item.src)}
        className={`aspect-square w-full overflow-hidden rounded relative cursor-pointer ${selected ? "border-4 border-black" : "border border-gray-300"
          }`}
      >
        <div className="w-full h-full flex items-center justify-center bg-white">
          {item.type === "image" && (
            <img src={item.src} alt="" className="object-cover w-full h-full" loading="lazy" />
          )}
          {item.type === "video" && (
            <video src={item.src} muted className="object-cover w-full h-full" />
          )}
          {item.type === "3d" && (
            <model-viewer
              src={item.src}
              camera-controls
              style={{ width: "240px", height: "240px", backgroundColor: "#f0f0f0" }}
              onError={(e) => console.error("Model-Viewer Error:", e)}
            />
          )}
        </div>
      </div>
      <button
        className="px-3 py-1 text-sm bg-black text-white rounded"
        onClick={(e) => {
          e.stopPropagation();
          openModal(item);
        }}
      >
        Preview
      </button>
    </div>
  );
}
