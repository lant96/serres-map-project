import { Canvas } from "@react-three/fiber";
import { useAppStore } from "../../state/useAppStore";

import SceneLighting from "./SceneLighting";
// import SceneGround from "./SceneGround";
import SceneControls from "./SceneControls";
import SceneModels from "./SceneModels";
import SceneMarkers  from "./SceneMarkers";
import SceneCrosshair from "./SceneCrosshair";


export default function SceneView() {
  const setSelection = useAppStore((s) => s.setSelection);

  return (
    <div style={styles.container}>
      <Canvas
        shadows
        camera={{ position: [2, 12, 24], fov: 42 }}
        onPointerMissed={() => setSelection("clear")}
      >
        <color attach="background" args={["#fefefe"]} />

        <SceneLighting />
        <SceneModels />
        <SceneMarkers />

        {/* Draggable floor crosshair — pans orbit target on x/z */}
        <SceneCrosshair />

        <SceneControls />
      </Canvas>
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