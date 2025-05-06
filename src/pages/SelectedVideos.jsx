import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ModalPortalVideo from "../components/ModalPortalVideo";

export default function SelectedVideos() {
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [filter, setFilter] = useState(
    localStorage.getItem("videoFilter") || "normal" // ✅ Load from storage
  );
  const navigate = useNavigate();

  useEffect(() => {
    const selectedSrcs = JSON.parse(localStorage.getItem("selectedItems")) || [];
    const allArtifacts = JSON.parse(localStorage.getItem("allArtifacts")) || [];

    const filtered = allArtifacts.filter(
      (artifact) => selectedSrcs.includes(artifact.src) && artifact.type === "video"
    );

    setSelectedVideos(filtered);
  }, []);

  function openModal(video) {
    setSelectedVideo(video);
  }

  function closeModal() {
    setSelectedVideo(null);
  }

  function handleFilterChange(value) {
    setFilter(value);
    localStorage.setItem("videoFilter", value); // ✅ Save to storage
  }

  return (
    <div className="p-6 font-sans bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Selected Videos</h1>
      <p className="text-center text-lg text-gray-700 mt-2 mb-8">
        Would you like to reduce the video size? Choose one of the options below... or not!
      </p>

      {/* Filter Buttons */}
      <div className="flex justify-center gap-4 mb-12">
        <button
          onClick={() => handleFilterChange("normal")}
          className={`px-4 py-2 rounded ${filter === "normal" ? "bg-black text-white" : "bg-gray-300 text-black"}`}
        >
          Normal
        </button>
        <button
          onClick={() => handleFilterChange("grayscale")}
          className={`px-4 py-2 rounded ${filter === "grayscale" ? "bg-black text-white" : "bg-gray-300 text-black"}`}
        >
          Black & White
        </button>
        <button
          onClick={() => handleFilterChange("slow")}
          className={`px-4 py-2 rounded ${filter === "slow" ? "bg-black text-white" : "bg-gray-300 text-black"}`}
        >
          Low Frame Rate
        </button>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-3 gap-8 max-w-7xl mx-auto">
        {selectedVideos.map((item) => (
          <div key={item.src} className="flex flex-col items-center space-y-2">
            <div
              className={`aspect-square w-full overflow-hidden rounded relative border border-gray-300 flex items-center justify-center bg-white ${filter === "slow" ? "animate-stutter" : ""
                }`}
            >
              <video
                src={item.src}
                muted
                className="object-cover w-full h-full"
                style={{
                  filter: filter === "grayscale" ? "grayscale(100%)" : "none",
                }}
              />
            </div>

            <button
              className="px-3 py-1 text-sm bg-black text-white rounded"
              onClick={() => openModal(item)}
            >
              Preview
            </button>
          </div>
        ))}
      </div>

      {selectedVideo && (
        <ModalPortalVideo
          selectedVideo={selectedVideo}
          filter={filter}
          closeModal={closeModal}
        />
      )}

      <div className="flex justify-center mt-12">
        <button
          onClick={() => navigate("/final-gallery")}
          className="px-6 py-3 bg-blue-600 text-white text-lg rounded hover:bg-blue-700"
        >
          Next
        </button>
      </div>
    </div>
  );
}
