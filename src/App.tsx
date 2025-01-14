import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import elementStyles from "./elementStyles";
import { VRButton } from "three/addons/webxr/VRButton.js";
import { ARButton } from "three/addons/webxr/ARButton.js";
import { XRButton } from "three/addons/webxr/XRButton.js";

const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [apiData, setApiData] = useState<any>(null);
  const [sliderValue, setSliderValue] = useState(0);

  useEffect(() => {
    fetch("api.json")
      .then((response) => response.json())
      .then((data) => setApiData(data))
      .catch((error) => console.error("Error loading API data:", error));
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !apiData) return;

    setSliderValue(apiData?.elemente.length);

    // **Scene Setup**
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    // **Camera Configuration**
    
    // API Version
    /*
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    );
    
    camera.position.set(
      apiData.kamera.x,
      apiData.kamera.y,
      apiData.kamera.z + 1000 // Add some distance to view the scene
    );*/
    
    const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 50 );
    camera.position.set( 0, 1.6, 3 );

    // **Renderer Setup**
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.xr.enabled = true; // WebXR aktivieren

    // AR-Button hinzufügen
    document.body.appendChild(XRButton.createButton(renderer));

    const session = renderer.xr.getSession();
    if (session) {
      session.requestReferenceSpace("local-floor").then((referenceSpace) => {
        // This ensures the scene is positioned at floor level
        renderer.xr.setReferenceSpace(referenceSpace);
      });
    }

    // **Orbit Controls**
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    apiData.elemente.forEach((element: any) => {
      const geometry = new THREE.BoxGeometry(
        element.laenge / 1000 || 0.03, // Default to 30 if no length specified
        element.hoehe / 1000 || 0.05, // Default to 50 if no height specified
        element.breite / 1000 || 0.03 // Default to 30 if no width specified
      );

      let materialColor = 0xffffff; // Default color
      let materialOpacity = 0.7;
      let materialTransparent = true;

      if (element.name.includes("VARIO FIX")) {
        materialColor = elementStyles.VARIO_FIX.color;
      } else if (element.name === "Konstruktionsbalken") {
        materialColor = elementStyles.KONSTRUKTIONSBALKEN.color;
      } else if (element.name.includes("Konstruktionsbälkchen")) {
        materialColor = elementStyles.KONSTRUKTIONSBÄLKCHEN.color;
      } else if (element.name.includes("Befestigungsschraube")) {
        materialColor = elementStyles.BEFESTIGUNGSSCHRAUBE.color;
      } else if (element.name.includes("Konstruktionsholz")) {
        materialColor = elementStyles.KONSTRUKTIONSHOLZ.color;
      } else if (element.name.includes("Barfußdiele")) {
        materialColor = elementStyles.BARFUSSDIELE.color;
      }

      if (element.farbe) {
        materialColor = element.farbe;
      }

      const material = new THREE.MeshStandardMaterial({
        color: materialColor,
        opacity: materialOpacity,
        transparent: materialTransparent,
      });

      const mesh = new THREE.Mesh(geometry, material);

      mesh.position.set(
        element.mittelpunkt.x / 1000,
        (element.mittelpunkt.z + (element.hoehe || 50)) / 1000, // Use z for height and adjust to sit on the ground
        element.mittelpunkt.y / 1000
      );

      mesh.rotation.y = element.drehung * (Math.PI / 180); // Convert rotation to radians

      scene.add(mesh);
    });

    // **Building (Gebäude)**
    const building = apiData.gebaeude[0];
    const buildingGeometry = new THREE.BoxGeometry(
      building.laenge / 1000,
      building.breite / 2000, // Height is half the width for a more realistic look
      building.breite / 1000
    );
    const buildingMaterial = new THREE.MeshStandardMaterial({
      color: 0x888888, // Gray color
      transparent: true,
      opacity: 0.7,
    });
    const buildingMesh = new THREE.Mesh(buildingGeometry, buildingMaterial);
    buildingMesh.position.set(
      building.mittelpunkt.x / 1000,
      building.breite / 2 / 2000, // Positioned on the ground
      building.mittelpunkt.y / 1000
    );
    scene.add(buildingMesh);

    // **Lighting**
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1000, 1000, 1000);
    scene.add(directionalLight);

    // Set up the WebXR animation loop
    renderer.setAnimationLoop((timestamp, frame) => {
      // Update controls (e.g., for orbit controls)
      controls.update();

      // Render the scene with the camera
      renderer.render(scene, camera);
    });

    // **Resize Handler**
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, [apiData]);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          width: "100vw",
          height: "100vh",
          display: "block",
        }}
      />
    </>
  );
};

export default App;
