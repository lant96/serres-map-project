import { useEffect, useRef, useState } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { controlsRef, INITIAL_TARGET } from "./SceneControls";

// Floor plane at the model's ground level
const FLOOR_Y = INITIAL_TARGET[1];
const FLOOR_PLANE = new THREE.Plane(
  new THREE.Vector3(0, 1, 0),
  -FLOOR_Y
);

const COLOR_DEFAULT = "#888888";
const COLOR_HOVER = "#ff4d4d";
const COLOR_DRAGGING = "#ff4d4d";

// Higher = quicker catch-up / Lower = floatier movement
const CAMERA_DAMPING = 8;

export default function SceneCrosshair() {
  const { camera, gl } = useThree();

  const [hovered, setHovered] = useState(false);
  const [dragging, setDragging] = useState(false);

  const groupRef = useRef();

  const posRef = useRef(
    new THREE.Vector3(...INITIAL_TARGET)
  );

  const desiredTarget = useRef(
    new THREE.Vector3(...INITIAL_TARGET)
  );

  const isDragging = useRef(false);
  const debounceTimer = useRef(null);

  const raycaster = useRef(new THREE.Raycaster());
  const ringRef = useRef(null);

  // Pulse
  const pulseT = useRef(0);

  useFrame((_, delta) => {
    if (ringRef.current && !isDragging.current) {
      pulseT.current += delta * 1.5;

      const s =
        1 + Math.sin(pulseT.current) * 0.06;

      ringRef.current.scale.setScalar(s);
    }

    if (groupRef.current) {
      groupRef.current.position.set(
        posRef.current.x,
        FLOOR_Y + 0.02,
        posRef.current.z
      );
    }

    // Smooth camera retargeting
    const controls = controlsRef.current;

    if (controls) {
      controls.target.lerp(
        desiredTarget.current,
        1 - Math.exp(-CAMERA_DAMPING * delta)
      );

      controls.update();
    }
  });


  // Screen -> floor projection

  function getFloorPoint(clientX, clientY) {
    const rect = gl.domElement.getBoundingClientRect();

    const ndc = {
      x:
        ((clientX - rect.left) / rect.width) * 2 -
        1,

      y:
        -(
          ((clientY - rect.top) / rect.height) *
            2 -
          1
        ),
    };

    raycaster.current.setFromCamera(ndc, camera);

    const hit = new THREE.Vector3();

    const ok =
      raycaster.current.ray.intersectPlane(
        FLOOR_PLANE,
        hit
      );

    return ok ? hit : null;
  }


  // Global drag listeners

  useEffect(() => {
    function onMove(e) {
      if (!isDragging.current) return;

      const point = getFloorPoint(
        e.clientX,
        e.clientY
      );

      if (!point) return;

      posRef.current.copy(point);
    }

    function onUp() {
      if (!isDragging.current) return;

      isDragging.current = false;
      setDragging(false);

      gl.domElement.style.cursor = "";

      if (controlsRef.current) {
        controlsRef.current.enabled = true;
      }

      clearTimeout(debounceTimer.current);

      debounceTimer.current = setTimeout(() => {
        desiredTarget.current.set(
          posRef.current.x,
          FLOOR_Y,
          posRef.current.z
        );
      }, 400);
    }

    window.addEventListener(
      "pointermove",
      onMove
    );

    window.addEventListener(
      "pointerup",
      onUp
    );

    return () => {
      window.removeEventListener(
        "pointermove",
        onMove
      );

      window.removeEventListener(
        "pointerup",
        onUp
      );
    };
  }, [camera, gl]);


  // Drag start

  function onPointerDown(e) {
    e.stopPropagation();

    isDragging.current = true;
    setDragging(true);

    gl.domElement.style.cursor =
      "grabbing";

    if (controlsRef.current) {
      controlsRef.current.enabled = false;
    }
  }

  const color = dragging
    ? COLOR_DRAGGING
    : hovered
    ? COLOR_HOVER
    : COLOR_DEFAULT;

  return (
    <group
      ref={groupRef}
      position={[
        INITIAL_TARGET[0],
        FLOOR_Y + 0.02,
        INITIAL_TARGET[2],
      ]}
    >
      {/* Outer ring */}

      <mesh
        ref={ringRef}
        rotation={[-Math.PI / 2, 0, 0]}
        onPointerDown={onPointerDown}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          gl.domElement.style.cursor = "grab";
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);

          if (!isDragging.current) {
            gl.domElement.style.cursor = "";
          }
        }}
      >
        <ringGeometry args={[0.28, 0.42, 48]} />

        <meshBasicMaterial
          color={color}
          side={THREE.DoubleSide}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Center dot */}

      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.06, 24]} />

        <meshBasicMaterial
          color={color}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* N-S */}

      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.04, 0.56]} />

        <meshBasicMaterial
          color={color}
          side={THREE.DoubleSide}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* E-W */}

      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.56, 0.04]} />

        <meshBasicMaterial
          color={color}
          side={THREE.DoubleSide}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  );
}