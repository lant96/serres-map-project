export default function SceneLighting() {
  return (
    <>
      {/* 1. BASE AMBIENT */}
      <ambientLight 
        intensity={1} />

      {/* 2. MAIN STUDIO LIGHT */}
      <directionalLight
        position={[10, 20, 10]}
        intensity={2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
        shadow-normalBias={0.02}
      />

      {/* 3. FILL LIGHT */}
      <directionalLight
        position={[-10, 5, -10]}
        intensity={0.4}
      />

      {/* 4. TOP LIGHT */}
      <directionalLight
        position={[0, 10, 0]}
        intensity={1.8}
      />
    </>
  );
}