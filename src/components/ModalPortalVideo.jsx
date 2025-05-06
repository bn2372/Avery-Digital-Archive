import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";

export default function ModalPortalVideo({ selectedVideo, filter, closeModal }) {
  const videoRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      console.log("❗ No video element found yet.");
      return;
    }

    console.log("🎥 ModalPortalVideo mounted. Current filter:", filter);

    if (filter === "slow") {
      console.log("🔴 Applying LOW FRAME RATE effect.");

      intervalRef.current = setInterval(() => {
        if (!video) return;

        if (video.paused) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      }, 300); // 300ms toggle interval
    } else {
      console.log("🟢 Normal or Black & White mode — clearing intervals.");

      clearInterval(intervalRef.current);
      if (video && video.paused) {
        video.play().catch(() => {});
      }
    }

    return () => {
      console.log("🧹 Cleaning up interval.");
      clearInterval(intervalRef.current);
    };
  }, [filter]);

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

        {/* Video */}
        <video
          ref={videoRef}
          src={selectedVideo.src}
          autoPlay
          muted
          controls
          style={{
            width: "800px",
            height: "auto",
            backgroundColor: "black",
            objectFit: "contain",
            filter: filter === "grayscale" ? "grayscale(100%)" : "none",
          }}
        />
      </div>
    </div>,
    document.body
  );
}
