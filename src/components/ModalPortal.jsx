import ReactDOM from "react-dom";

export default function ModalPortal({ selectedArtifact, closeModal }) {
  if (!selectedArtifact) return null;

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

        {/* Artifact Preview */}
        {selectedArtifact.type === "image" && (
          <img
            src={selectedArtifact.src}
            alt=""
            style={{
              maxWidth: "100%",
              maxHeight: "80vh",
              objectFit: "contain",
            }}
          />
        )}
        {selectedArtifact.type === "video" && (
          <video
            src={selectedArtifact.src}
            controls
            autoPlay
            style={{
              maxWidth: "100%",
              maxHeight: "80vh",
              objectFit: "contain",
            }}
          />
        )}
        {selectedArtifact.type === "3d" && (
          <model-viewer
            src={selectedArtifact.src}
            camera-controls
            style={{
              width: "600px",
              height: "600px",
              objectFit: "contain",
              backgroundColor: "#f0f0f0",
            }}
            onError={(e) => console.error("Model-Viewer Error (Modal):", e)}
          />
        )}
      </div>
    </div>,
    document.body
  );
}
