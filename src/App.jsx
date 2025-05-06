import { Routes, Route } from "react-router-dom";
import IntroPage from "./pages/IntroPage";
import ArtifactGallery from "./pages/ArtifactGallery";
import SelectedImages from "./pages/SelectedImages";
import SelectedVideos from "./pages/SelectedVideos";
import FinalGallery from "./pages/FinalGallery";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<IntroPage />} />
      <Route path="/gallery" element={<ArtifactGallery />} />
      <Route path="/selected-images" element={<SelectedImages />} />
      <Route path="/selected-videos" element={<SelectedVideos />} />
      <Route path="/final-gallery" element={<FinalGallery />} />
    </Routes>
  );
}
