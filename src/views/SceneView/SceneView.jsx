import { Canvas } from "@react-three/fiber";
import { useAppStore } from "../../state/useAppStore";

import SceneLighting from "./SceneLighting";
import SceneControls from "./SceneControls";
import SceneModels from "./SceneModels";
import SceneMarkers  from "./SceneMarkers";
import SceneCrosshair from "./SceneCrosshair";

const DEFAULT_VISIBILITY = {
  topografiko: true,
  buildings:  true,
  model:      true,
  neo_sxedio: true,
};

export default function SceneView() {
  const setSelection    = useAppStore((s) => s.setSelection);
  const sceneVisibility = useAppStore((s) => s.sceneVisibility);

  return (
    <div style={styles.container}>
      <Canvas
        shadows
        gl={{ antialias: true, toneMappingExposure: 1 }}
        camera={{ position: [2, 12, 24], fov: 42 }}
        onPointerMissed={() => setSelection("clear")}
      >
        <color attach="background" args={["#faf9f6"]} />

        <SceneLighting />
        <SceneModels visibility={sceneVisibility} />
        <SceneMarkers visible={sceneVisibility.images ?? true} />
        <SceneCrosshair />
        <SceneControls />
      </Canvas>
    </div>
  );
}

const styles = {
  container: {
    width:      "75%",
    height:     "100%",
    marginLeft: "25%",
  },
};