import { Canvas } from "@react-three/fiber";

import SceneLighting from "./SceneLighting";
// import SceneGround from "./SceneGround";
import SceneControls from "./SceneControls";
import SceneModels from "./SceneModels";

export default function SceneView() {
  return (
    <div style={styles.container}>
      <Canvas
        shadows
        camera={{
          position: [-4, 8, 21],
          fov: 50,
        }}
      >
        <color attach="background" args={["#fefefe"]} />

        <SceneLighting />

        {/*<SceneGround /> */}

        <SceneModels />

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