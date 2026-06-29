import { Canvas } from "@react-three/fiber";
import { useAppStore } from "../../state/useAppStore";
import { useState } from "react";

import SceneLighting from "./SceneLighting";
// import SceneGround from "./SceneGround";
import SceneControls from "./SceneControls";
import SceneModels from "./SceneModels";
import SceneMarkers  from "./SceneMarkers";
import SceneCrosshair from "./SceneCrosshair";
import SceneLayerToggle from "./SceneLayerToggle";
import Background from "three/src/renderers/common/Background.js";

const DEFAULT_VISIBILITY = {
  topografiko: true,
  buildings:  true,
  model:      true,
  neo_sxedio: true,
};


export default function SceneView() {
  const setSelection = useAppStore((s) => s.setSelection);

  const [visibility, setVisibility] = useState(DEFAULT_VISIBILITY);

  function toggleLayer(key) {
    setVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div style={styles.container}>
      <Canvas
        shadows
        gl={{antialias: true, toneMappingExposure: 1,}}
        camera={{ position: [2, 12, 24], fov: 42 }}
        onPointerMissed={() => setSelection("clear")}
      >
        <color attach="background" args={["#faf9f6"]} />

        <SceneLighting />
        <SceneModels visibility={visibility} />
        <SceneMarkers />
        <SceneCrosshair />
        <SceneControls />      
      </Canvas>

      <SceneLayerToggle visibility={visibility} onToggle={toggleLayer} />
    </div>
  );
}

const styles = {
  container: {
    width:  "75%",
    height: "100%",
    marginLeft: "25%",
  },
};