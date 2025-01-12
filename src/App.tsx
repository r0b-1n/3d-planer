import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import elementStyles from "./elementStyles";

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
    );
    camera.lookAt(0, 0, 0);

    // **Renderer Setup**
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.xr.enabled = true; // WebXR aktivieren

    // AR-Button hinzufügen
    //document.body.appendChild(THREE.ARButton.createButton(renderer));

    // **Orbit Controls**
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    /*

    // **Elements (Vario Fix, Konstruktionsbalken, Konstruktionsbälkchen, Befestigungsschraube, Konstruktionsholz, and Barfußdiele)**
    apiData.elemente.forEach((element: any) => {
      // Vario Fix Elements
      if (element.name.includes("VARIO FIX")) {
        const varioFixGeometry = new THREE.BoxGeometry(
          element.laenge,
          50, // Height
          element.breite
        );
        const varioFixMaterial = new THREE.MeshStandardMaterial({
          color: 0xff0000, // Red color
          transparent: true,
          opacity: 0.7,
        });
        const varioFixMesh = new THREE.Mesh(varioFixGeometry, varioFixMaterial);

        varioFixMesh.position.set(
          element.mittelpunkt.x,
          50 / 2, // Half of height to sit on the ground
          element.mittelpunkt.y
        );
        varioFixMesh.rotation.y = element.drehung * (Math.PI / 180); // Convert rotation to radians

        scene.add(varioFixMesh);
      }

      // Konstruktionsbalken Elements
      if (element.name === "Konstruktionsbalken") {
        const konstruktionGeometry = new THREE.BoxGeometry(
          element.laenge,
          50, // Height
          element.breite
        );
        const konstruktionMaterial = new THREE.MeshStandardMaterial({
          color: 0x800080, // Purple color
          transparent: true,
          opacity: 0.7,
        });
        const konstruktionMesh = new THREE.Mesh(
          konstruktionGeometry,
          konstruktionMaterial
        );

        konstruktionMesh.position.set(
          element.mittelpunkt.x,
          element.mittelpunkt.z + 25, // Use z for height and adjust to sit on the ground
          element.mittelpunkt.y
        );
        konstruktionMesh.rotation.y = element.drehung * (Math.PI / 180); // Convert rotation to radians

        scene.add(konstruktionMesh);
      }

      // Konstruktionsbälkchen Elements
      if (element.name.includes("Konstruktionsbälkchen")) {
        const baelkchenGeometry = new THREE.BoxGeometry(
          element.laenge || 30, // Default to 30 if no length specified
          50, // Height
          element.breite || 30 // Default to 30 if no width specified
        );
        const baelkchenMaterial = new THREE.MeshStandardMaterial({
          color: 0xff1493, // Deep pink color
          transparent: true,
          opacity: 0.7,
        });
        const baelkchenMesh = new THREE.Mesh(
          baelkchenGeometry,
          baelkchenMaterial
        );

        baelkchenMesh.position.set(
          element.mittelpunkt.x,
          element.mittelpunkt.z + 25, // Use z for height and adjust to sit on the ground
          element.mittelpunkt.y
        );
        baelkchenMesh.rotation.y = element.drehung * (Math.PI / 180); // Convert rotation to radians

        scene.add(baelkchenMesh);
      }

      // Befestigungsschraube Elements
      if (element.name.includes("Befestigungsschraube")) {
        const screwGeometry = new THREE.CylinderGeometry(
          5, // Radius top
          5, // Radius bottom
          80, // Height (based on typical screw length)
          32 // Radial segments
        );
        const screwMaterial = new THREE.MeshStandardMaterial({
          color: 0x000000, // Black color
          transparent: true,
          opacity: 0.8,
        });
        const screwMesh = new THREE.Mesh(screwGeometry, screwMaterial);

        screwMesh.position.set(
          element.mittelpunkt.x,
          element.mittelpunkt.z, // Use z for height
          element.mittelpunkt.y
        );
        screwMesh.rotation.x = Math.PI / 2; // Rotate to stand vertically
        screwMesh.rotation.y = element.drehung * (Math.PI / 180); // Convert rotation to radians

        scene.add(screwMesh);
      }

      // Konstruktionsholz Elements
      if (element.name.includes("Konstruktionsholz")) {
        const holzGeometry = new THREE.BoxGeometry(
          element.laenge,
          50, // Height
          30 // Width (default value)
        );
        const holzMaterial = new THREE.MeshStandardMaterial({
          color: 0x00ff00, // Green color
          transparent: true,
          opacity: 0.7,
        });
        const holzMesh = new THREE.Mesh(holzGeometry, holzMaterial);

        holzMesh.position.set(
          element.mittelpunkt.x,
          element.mittelpunkt.z + 25, // Use z for height and adjust to sit on the ground
          element.mittelpunkt.y
        );
        holzMesh.rotation.y = element.drehung * (Math.PI / 180); // Convert rotation to radians

        scene.add(holzMesh);
      }

      // Barfußdiele Elements
      if (element.name.includes("Barfußdiele")) {
        const dielenGeometry = new THREE.BoxGeometry(
          element.laenge,
          21, // Height based on typical deck board thickness
          145 // Width based on typical deck board width
        );
        const dielenMaterial = new THREE.MeshStandardMaterial({
          color: 0xffff00, // Yellow color
          transparent: true,
          opacity: 0.7,
        });
        const dielenMesh = new THREE.Mesh(dielenGeometry, dielenMaterial);

        dielenMesh.position.set(
          element.mittelpunkt.x,
          element.mittelpunkt.z + 10.5, // Half of height to sit on the ground
          element.mittelpunkt.y
        );
        dielenMesh.rotation.y = element.drehung * (Math.PI / 180); // Convert rotation to radians

        scene.add(dielenMesh);
      }
    });

    */

    /* 

    Schema 
    {
  "name": "VARIO FIX I (komplett)",
  "artikelnummer": "MWVFUK100000SW-40",
  "drehung": 0,
  "mittelpunkt": {
    "x": 74,
    "y": 188,
    "z": 0
  },
  "istUkPlatte": true,
  "istNormalerUkBalken": false,
  "istVerbindungsschuh": false,
  "istBalkenStueck": false,
  "istVerschoben": false,
  "laenge": 148,
  "breite": 295,
  "hoehe": null,
  "farbe": null,
  "zusatzinfos": "148 x 295 mm, passend für VARIO FIX",
  "formel": null,
  "position": 1,
  "anzahl": 1,
  "typ": "UK-Platte"
  }
 
*/

    apiData.elemente.forEach((element: any) => {
      const geometry = new THREE.BoxGeometry(
        element.laenge || 30, // Default to 30 if no length specified
        element.hoehe || 50, // Default to 50 if no height specified
        element.breite || 30 // Default to 30 if no width specified
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
        element.mittelpunkt.x,
        element.mittelpunkt.z + (element.hoehe || 50) / 2, // Use z for height and adjust to sit on the ground
        element.mittelpunkt.y
      );

      mesh.rotation.y = element.drehung * (Math.PI / 180); // Convert rotation to radians

      scene.add(mesh);
    });

    // **Marker**
    const marker = apiData.marker;
    const markerGeometry = new THREE.BoxGeometry(100, 100, 100);
    const markerMaterial = new THREE.MeshStandardMaterial({
      color: 0x000000, // Black color
      transparent: true,
      opacity: 0.7,
    });
    const markerMesh = new THREE.Mesh(markerGeometry, markerMaterial);
    markerMesh.position.set(
      marker.x,
      marker.z, // Use z for height
      marker.y // Swap y and z to match Three.js coordinate system
    );
    markerMesh.rotation.y = marker.drehung * (Math.PI / 180); // Convert rotation to radians
    scene.add(markerMesh);

    /*
    
    // **Ground (Boden)**
    const ground = apiData.boden[0];
    const groundGeometry = new THREE.BoxGeometry(
      ground.breite,
      50, // Adding some height to make it visible
      ground.laenge
    );
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x0000ff, // Blue color
      transparent: true,
      opacity: 0.6,
    });
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    groundMesh.position.set(
      ground.mittelpunkt.x,
      25, // Half of the height to sit on the ground
      ground.mittelpunkt.y
    );
    scene.add(groundMesh);

    */

    /*

    // **Base Surface**
    const baseSurface = apiData.boden[0];
    const baseGeometry = new THREE.PlaneGeometry(
      baseSurface.breite,
      baseSurface.laenge
    );
    const baseMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ff00, // Bright green
      side: THREE.DoubleSide,
    });
    const basePlane = new THREE.Mesh(baseGeometry, baseMaterial);
    basePlane.rotation.x = Math.PI / 2; // Rotate to lie flat
    basePlane.position.set(
      baseSurface.mittelpunkt.x,
      0,
      baseSurface.mittelpunkt.y
    );
    scene.add(basePlane);

    */

    // **Building (Gebäude)**
    const building = apiData.gebaeude[0];
    const buildingGeometry = new THREE.BoxGeometry(
      building.laenge,
      building.breite / 2, // Height is half the width for a more realistic look
      building.breite
    );
    const buildingMaterial = new THREE.MeshStandardMaterial({
      color: 0x888888, // Gray color
      transparent: true,
      opacity: 0.7,
    });
    const buildingMesh = new THREE.Mesh(buildingGeometry, buildingMaterial);
    buildingMesh.position.set(
      building.mittelpunkt.x,
      building.breite / 2 / 2, // Positioned on the ground
      building.mittelpunkt.y
    );
    scene.add(buildingMesh);

    /*

    // **Concrete Edges (Betonkante)**
    const concreteMaterial = new THREE.MeshStandardMaterial({
      color: 0xff4500, // Orange-red color
      transparent: true,
      opacity: 0.8,
    });

    apiData.betonkante.forEach((edge: any) => {
      const edgeGeometry = new THREE.BoxGeometry(
        edge.breite,
        edge.hoehe,
        edge.laenge
      );
      const edgeMesh = new THREE.Mesh(edgeGeometry, concreteMaterial);

      edgeMesh.position.set(
        edge.mittelpunkt.x,
        edge.hoehe / 2, // Positioned on the ground
        edge.mittelpunkt.y
      );

      scene.add(edgeMesh);
    });

    */

    // **Base Surface Center Marker**
    const centerMarkerGeometry = new THREE.SphereGeometry(50, 32, 32);
    const centerMarkerMaterial = new THREE.MeshStandardMaterial({
      color: 0xff0000, // Red marker
      transparent: true,
      opacity: 0.7,
    });
    const centerMarker = new THREE.Mesh(
      centerMarkerGeometry,
      centerMarkerMaterial
    );
    centerMarker.position.set(
      apiData.basisflaechemittelpunkt.x,
      50, // Slightly above the surface
      apiData.basisflaechemittelpunkt.y
    );
    scene.add(centerMarker);

    // **Lighting**
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1000, 1000, 1000);
    scene.add(directionalLight);

    // **Grid Helper**
    const gridHelper = new THREE.GridHelper(2000, 20);
    scene.add(gridHelper);

    // **Axes Helper**
    const axesHelper = new THREE.AxesHelper(500);
    scene.add(axesHelper);

    // **Animation Loop**
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    // **Resize Handler**
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    animate();

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
      <input
        type="range"
        min={0}
        max={apiData?.elemente.length || 0}
        value={sliderValue}
        onChange={(e) => setSliderValue(Number(e.target.value))}
        style={{ width: "100%" }}
      />
    </>
  );
};

export default App;
