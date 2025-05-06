import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";

export default function ModalPortalPixelated({ selectedSrc, pixelationLevel, closeModal }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const img = new Image();
    img.src = selectedSrc;
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      // Full natural dimensions
      const originalWidth = img.width;
      const originalHeight = img.height;

      // 1. Create tiny offscreen pixelated version
      const tinyCanvas = document.createElement('canvas');
      const tinyCtx = tinyCanvas.getContext('2d');

      // Use proportional width and height for pixelation
      tinyCanvas.width = pixelationLevel;
      tinyCanvas.height = (originalHeight / originalWidth) * pixelationLevel;

      tinyCtx.imageSmoothingEnabled = false;
      tinyCtx.drawImage(img, 0, 0, tinyCanvas.width, tinyCanvas.height);

      // 2. Scale back up onto visible canvas
      let displayWidth = originalWidth;
      let displayHeight = originalHeight;

      const maxW = 800;
      const maxH = 600;

      if (displayWidth > maxW) {
        displayHeight *= maxW / displayWidth;
        displayWidth = maxW;
      }
      if (displayHeight > maxH) {
        displayWidth *= maxH / displayHeight;
        displayHeight = maxH;
      }

      canvas.width = displayWidth;
      canvas.height = displayHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(tinyCanvas, 0, 0, tinyCanvas.width, tinyCanvas.height, 0, 0, displayWidth, displayHeight);
    };
  }, [selectedSrc, pixelationLevel]);

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

        {/* Correct Canvas */}
        <canvas
          ref={canvasRef}
          style={{
            backgroundColor: 'white',
            imageRendering: 'pixelated',
            maxWidth: '90vw',
            maxHeight: '80vh',
          }}
        />
      </div>
    </div>,
    document.body
  );
}
