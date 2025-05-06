function ModalPortalModel({ selectedSrc, closeModal }) {
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
  