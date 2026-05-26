import { OrbitControls } from "@react-three/drei";

export default function SceneControls() {
  return (
    <OrbitControls
      enableDamping
      maxPolarAngle={Math.PI / 2}
      target={[0, 0, 0]}
    />
  );
}