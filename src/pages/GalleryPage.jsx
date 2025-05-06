// src/pages/GalleryPage.jsx
import React from "react";
import ArtifactGallery from "../components/ArtifactGallery";

export default function GalleryPage() {
  return (
    <div>
      <h1 style={{ fontSize: "1.5rem", padding: "1rem" }}>Digital Archive Browser</h1>
      <ArtifactGallery />
    </div>
  );
}
