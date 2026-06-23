import { Canvas } from "@react-three/fiber";

import SceneLighting from "./SceneLighting";
// import SceneGround from "./SceneGround";
import SceneControls from "./SceneControls";
import SceneModels from "./SceneModels";
import SceneMarkers  from "./SceneMarkers";

export default function SceneView() {
  return (
    <div style={styles.container}>
      <Canvas
        shadows
        camera={{
          position: [2, 12, 24],
          fov: 50,
        }}
      >
        <color attach="background" args={["#fefefe"]} />

        <SceneLighting />

        {/*<SceneGround /> */}

        <SceneModels />

        <SceneMarkers />

        <SceneControls />
      </Canvas>
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    height: "100%",
  },
};