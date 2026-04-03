"use client";

import React, { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, OrthographicCamera, Html } from "@react-three/drei";
import * as THREE from "three";

// ============================================
// SIRIRAJ-BASED FLOOR DATA
// ============================================
interface RoomData {
  id: string;
  name: string;
  pos: [number, number, number];
  size: [number, number, number];
  color: string;
  labelColor: string;
  borderColor: string;
  highlight?: boolean;
  icon?: string;
}

interface FloorData {
  id: number;
  name: string;
  label: string;
  rooms: RoomData[];
}

const FLOORS: FloorData[] = [
  {
    id: 1,
    name: "Ground Floor",
    label: "G",
    rooms: [
      // Main Lobby - large central area
      { id: "lobby", name: "Main Lobby", pos: [0, 0, 0], size: [30, 4, 20], color: "#f0f9ff", labelColor: "#0369a1", borderColor: "#bae6fd" },
      // Registration counters
      { id: "registration", name: "Registration", pos: [-30, 0, 0], size: [18, 4, 14], color: "#f0fdf4", labelColor: "#15803d", borderColor: "#bbf7d0" },
      // Pharmacy
      { id: "pharmacy", name: "Pharmacy", pos: [30, 0, -5], size: [20, 4, 18], color: "#fefce8", labelColor: "#a16207", borderColor: "#fef08a" },
      // Cashier
      { id: "cashier", name: "Cashier", pos: [30, 0, 18], size: [16, 4, 10], color: "#fff7ed", labelColor: "#c2410c", borderColor: "#fed7aa" },
      // Emergency department
      { id: "emergency", name: "Emergency", pos: [-30, 0, 25], size: [22, 4, 16], color: "#fef2f2", labelColor: "#dc2626", borderColor: "#fecaca", icon: "🚨" },
      // Information desk
      { id: "info", name: "Info Desk", pos: [0, 0, -18], size: [12, 3, 8], color: "#eff6ff", labelColor: "#2563eb", borderColor: "#bfdbfe" },
      // Main corridor
      { id: "corridor-g", name: "", pos: [0, 0, 12], size: [70, 1, 4], color: "#f8fafc", labelColor: "#94a3b8", borderColor: "#e2e8f0" },
      // Elevator bank
      { id: "elevator-g", name: "Elevators", pos: [0, 0, -10], size: [8, 5, 8], color: "#e2e8f0", labelColor: "#475569", borderColor: "#cbd5e1", icon: "🛗" },
      // Waiting area
      { id: "waiting-g", name: "Waiting Area", pos: [-12, 0, 18], size: [14, 3, 10], color: "#f1f5f9", labelColor: "#64748b", borderColor: "#e2e8f0" },
    ],
  },
  {
    id: 2,
    name: "Floor 2 — OPD",
    label: "2",
    rooms: [
      // OPD rooms in a row
      { id: "opd-201", name: "OPD 201", pos: [-35, 0, -15], size: [12, 5, 14], color: "#ffffff", labelColor: "#64748b", borderColor: "#e2e8f0" },
      { id: "opd-202", name: "OPD 202", pos: [-20, 0, -15], size: [12, 5, 14], color: "#ffffff", labelColor: "#64748b", borderColor: "#e2e8f0" },
      { id: "opd-203", name: "OPD 203", pos: [-5, 0, -15], size: [12, 5, 14], color: "#ffffff", labelColor: "#64748b", borderColor: "#e2e8f0" },
      { id: "opd-204", name: "OPD 204", pos: [10, 0, -15], size: [12, 5, 14], color: "#ecfdf5", labelColor: "#059669", borderColor: "#a7f3d0", highlight: true },
      { id: "opd-205", name: "OPD 205", pos: [25, 0, -15], size: [12, 5, 14], color: "#ffffff", labelColor: "#64748b", borderColor: "#e2e8f0" },
      // Nurses station (central hub)
      { id: "nurses", name: "Nurses Station", pos: [0, 0, 5], size: [18, 4, 12], color: "#eff6ff", labelColor: "#2563eb", borderColor: "#93c5fd", icon: "👩‍⚕️" },
      // OPD Waiting
      { id: "opd-waiting", name: "OPD Waiting", pos: [-30, 0, 15], size: [20, 3, 14], color: "#f1f5f9", labelColor: "#64748b", borderColor: "#e2e8f0" },
      // Triage
      { id: "triage", name: "Triage", pos: [28, 0, 5], size: [14, 4, 12], color: "#fff7ed", labelColor: "#ea580c", borderColor: "#fdba74" },
      // Corridor
      { id: "corridor-2", name: "", pos: [0, 0, -2], size: [75, 1, 4], color: "#f8fafc", labelColor: "#94a3b8", borderColor: "#e2e8f0" },
      // Elevators
      { id: "elevator-2", name: "Elevators", pos: [0, 0, 22], size: [8, 5, 8], color: "#e2e8f0", labelColor: "#475569", borderColor: "#cbd5e1", icon: "🛗" },
      // Restroom
      { id: "restroom-2", name: "Restroom", pos: [35, 0, 20], size: [10, 4, 8], color: "#f1f5f9", labelColor: "#94a3b8", borderColor: "#e2e8f0" },
    ],
  },
  {
    id: 3,
    name: "Floor 3 — Laboratory",
    label: "3",
    rooms: [
      // Lab 3B (main blood draw)
      { id: "lab-3b", name: "Lab 3B — Blood Draw", pos: [0, 0, -12], size: [28, 6, 18], color: "#eff6ff", labelColor: "#1d4ed8", borderColor: "#93c5fd", highlight: true, icon: "🩸" },
      // Hematology
      { id: "hematology", name: "Hematology", pos: [-28, 0, -8], size: [16, 5, 14], color: "#faf5ff", labelColor: "#7c3aed", borderColor: "#c4b5fd" },
      // Chemistry Lab
      { id: "chemistry", name: "Chemistry", pos: [28, 0, -8], size: [16, 5, 14], color: "#fff7ed", labelColor: "#ea580c", borderColor: "#fdba74" },
      // Phlebotomy
      { id: "phlebotomy", name: "Phlebotomy", pos: [-28, 0, 12], size: [16, 5, 14], color: "#fff1f2", labelColor: "#e11d48", borderColor: "#fda4af" },
      // Specimen Reception
      { id: "specimen", name: "Specimen Receiving", pos: [28, 0, 12], size: [16, 5, 14], color: "#f0fdf4", labelColor: "#16a34a", borderColor: "#86efac" },
      // Lab waiting
      { id: "lab-waiting", name: "Lab Waiting", pos: [0, 0, 18], size: [22, 3, 10], color: "#f1f5f9", labelColor: "#64748b", borderColor: "#e2e8f0" },
      // Corridor
      { id: "corridor-3", name: "", pos: [0, 0, 2], size: [75, 1, 4], color: "#f8fafc", labelColor: "#94a3b8", borderColor: "#e2e8f0" },
      // Elevators
      { id: "elevator-3", name: "Elevators", pos: [-38, 0, 0], size: [8, 5, 8], color: "#e2e8f0", labelColor: "#475569", borderColor: "#cbd5e1", icon: "🛗" },
    ],
  },
  {
    id: 4,
    name: "Floor 4 — Radiology",
    label: "4",
    rooms: [
      // X-Ray suites
      { id: "xray-1", name: "X-Ray Suite 1", pos: [-25, 0, -14], size: [18, 5, 16], color: "#fff7ed", labelColor: "#ea580c", borderColor: "#fdba74", icon: "☢️" },
      { id: "xray-2", name: "X-Ray Suite 2", pos: [-5, 0, -14], size: [14, 5, 16], color: "#fff7ed", labelColor: "#ea580c", borderColor: "#fdba74" },
      // CT Scan
      { id: "ct-scan", name: "CT Scan", pos: [18, 0, -14], size: [20, 6, 18], color: "#f0f9ff", labelColor: "#0369a1", borderColor: "#7dd3fc", icon: "🔬" },
      // MRI
      { id: "mri", name: "MRI", pos: [18, 0, 12], size: [20, 6, 16], color: "#eef2ff", labelColor: "#4338ca", borderColor: "#a5b4fc" },
      // Ultrasound
      { id: "ultrasound", name: "Ultrasound", pos: [-25, 0, 12], size: [18, 5, 14], color: "#fdf4ff", labelColor: "#a21caf", borderColor: "#e879f9" },
      // Rad waiting
      { id: "rad-waiting", name: "Rad Waiting", pos: [-5, 0, 16], size: [14, 3, 10], color: "#f1f5f9", labelColor: "#64748b", borderColor: "#e2e8f0" },
      // Control room
      { id: "control", name: "Control Room", pos: [-5, 0, -2], size: [14, 4, 8], color: "#f1f5f9", labelColor: "#475569", borderColor: "#cbd5e1" },
      // Corridor
      { id: "corridor-4", name: "", pos: [0, 0, 2], size: [75, 1, 4], color: "#f8fafc", labelColor: "#94a3b8", borderColor: "#e2e8f0" },
      // Elevators
      { id: "elevator-4", name: "Elevators", pos: [38, 0, 0], size: [8, 5, 8], color: "#e2e8f0", labelColor: "#475569", borderColor: "#cbd5e1", icon: "🛗" },
    ],
  },
];

// ============================================
// WALKING NPC COMPONENT
// ============================================
function WalkingNPC({
  path,
  speed = 0.008,
  color = "#4f6bed",
  delay = 0,
}: {
  path: THREE.Vector3[];
  speed?: number;
  color?: string;
  delay?: number;
}) {
  const ref = useRef<THREE.Group>(null);
  const progress = useRef(delay);
  const totalLength = useMemo(() => {
    let len = 0;
    for (let i = 1; i < path.length; i++) {
      len += path[i - 1].distanceTo(path[i]);
    }
    return len;
  }, [path]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    progress.current += delta * speed * 60;
    if (progress.current > 1) progress.current = 0;

    const t = progress.current;
    let traveled = t * totalLength;
    let pos = path[0].clone();
    let dir = new THREE.Vector3(0, 0, 1);

    for (let i = 1; i < path.length; i++) {
      const segLen = path[i - 1].distanceTo(path[i]);
      if (traveled <= segLen) {
        const frac = traveled / segLen;
        pos = path[i - 1].clone().lerp(path[i], frac);
        dir = path[i].clone().sub(path[i - 1]).normalize();
        break;
      }
      traveled -= segLen;
    }

    ref.current.position.copy(pos);
    if (dir.length() > 0) {
      const angle = Math.atan2(dir.x, dir.z);
      ref.current.rotation.y = angle;
    }
  });

  // Simple humanoid stick figure
  return (
    <group ref={ref}>
      {/* Body */}
      <mesh position={[0, 2.2, 0]}>
        <capsuleGeometry args={[0.6, 1.4, 4, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 3.8, 0]}>
        <sphereGeometry args={[0.5, 12, 12]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

// Multiple NPCs along a path
function NPCGroup({
  path,
  count = 3,
  color = "#4f6bed",
}: {
  path: THREE.Vector3[];
  count?: number;
  color?: string;
}) {
  const npcs = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      // Deterministic "randomness" to keep renders pure (no Math.random).
      const speedJitter = Math.abs(Math.sin(i * 97.13 + count * 11.7)) % 1;
      return {
        delay: i / count,
        speed: 0.006 + speedJitter * 0.004,
      };
    });
  }, [count]);

  return (
    <group>
      {npcs.map((npc, i) => (
        <WalkingNPC
          key={i}
          path={path}
          speed={npc.speed}
          delay={npc.delay}
          color={color}
        />
      ))}
    </group>
  );
}

// ============================================
// ANIMATED PATH (dashed line effect)
// ============================================
function AnimatedPath({ points, color }: { points: THREE.Vector3[]; color: string }) {
  const ref = useRef<THREE.Group>(null);

  return (
    <group ref={ref}>
      {/* Ground path shadow */}
      {points.map((p, i) => {
        if (i === 0) return null;
        const prev = points[i - 1];
        const dist = prev.distanceTo(p);
        const mid = prev.clone().lerp(p, 0.5);
        const dir = p.clone().sub(prev).normalize();
        const angle = Math.atan2(dir.x, dir.z);
        return (
          <mesh key={`path-${i}`} position={[mid.x, 0.15, mid.z]} rotation={[-Math.PI / 2, 0, -angle]}>
            <planeGeometry args={[1.2, dist]} />
            <meshBasicMaterial color={color} transparent opacity={0.3} />
          </mesh>
        );
      })}
      {/* Path pipe */}
      {points.map((p, i) => {
        if (i === 0) return null;
        const prev = points[i - 1];
        const distance = prev.distanceTo(p);
        const position = prev.clone().lerp(p, 0.5);
        const direction = p.clone().sub(prev).normalize();
        const up = new THREE.Vector3(0, 1, 0);
        const quaternion = new THREE.Quaternion().setFromUnitVectors(up, direction);
        return (
          <mesh key={`pipe-${i}`} position={position} quaternion={quaternion}>
            <cylinderGeometry args={[0.35, 0.35, distance, 8]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
          </mesh>
        );
      })}
      {/* Joints */}
      {points.map((p, i) => (
        <mesh key={`joint-${i}`} position={p}>
          <sphereGeometry args={[0.5, 12, 12]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
        </mesh>
      ))}
    </group>
  );
}

// ============================================
// DESTINATION MARKER
// ============================================
function DestinationMarker({ position, label, color }: { position: [number, number, number]; label: string; color: string }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = position[1] + 1 + Math.sin(state.clock.elapsedTime * 2) * 0.5;
    }
  });
  return (
    <group>
      {/* Pulsing ring on ground */}
      <mesh position={[position[0], 0.2, position[2]]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2, 3, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>
      {/* Bobbing marker */}
      <group ref={ref}>
        <mesh>
          <coneGeometry args={[1, 2.5, 4]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} />
        </mesh>
      </group>
      <Html position={[position[0], position[1] + 6, position[2]]} center className="pointer-events-none z-50">
        <div
          className="px-3 py-1.5 rounded-xl text-xs font-black text-white shadow-lg whitespace-nowrap"
          style={{ backgroundColor: color }}
        >
          📍 {label}
        </div>
      </Html>
    </group>
  );
}

// ============================================
// ROOM RENDERER
// ============================================
function Room({ room }: { room: RoomData }) {
  const [hovered, setHovered] = useState(false);
  const isCorr = room.id.startsWith("corridor");
  if (isCorr) {
    return (
      <mesh position={[room.pos[0], room.size[1] / 2, room.pos[2]]}>
        <boxGeometry args={room.size} />
        <meshStandardMaterial color="#f1f5f9" transparent opacity={0.25} />
      </mesh>
    );
  }

  return (
    <group
      position={[room.pos[0], 0, room.pos[2]]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Floor fill */}
      <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[room.size[0] - 0.5, room.size[2] - 0.5]} />
        <meshStandardMaterial
          color={room.color}
          transparent
          opacity={hovered ? 0.95 : 0.75}
        />
      </mesh>
      {/* Walls */}
      <mesh position={[0, room.size[1] / 2, 0]}>
        <boxGeometry args={room.size} />
        <meshPhysicalMaterial
          color={room.highlight ? room.color : "#ffffff"}
          transparent
          opacity={hovered ? 0.5 : room.highlight ? 0.4 : 0.25}
          roughness={0.05}
          transmission={0.6}
          thickness={2}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Border outline bottom */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[room.size[0], room.size[2]]} />
        <meshBasicMaterial color={room.borderColor} transparent opacity={0.5} />
      </mesh>
      {/* Label */}
      {room.name && (
        <Html
          position={[0, room.size[1] + 1.5, 0]}
          center
          className="pointer-events-none z-10"
        >
          <div
            className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white/95 border shadow-sm whitespace-nowrap select-none"
            style={{ color: room.labelColor, borderColor: room.borderColor }}
          >
            {room.icon ? `${room.icon} ` : ""}{room.name}
          </div>
        </Html>
      )}
    </group>
  );
}

// ============================================
// FLOOR SCENE
// ============================================
function FloorScene({ floor }: { floor: FloorData }) {
  return (
    <group>
      {floor.rooms.map((room) => (
        <Room key={room.id} room={room} />
      ))}
    </group>
  );
}

// ============================================
// NAVIGATION PATHS PER STEP
// ============================================
const NAV_PATHS: Record<number, { floor: number; points: THREE.Vector3[]; color: string; targetLabel: string; targetPos: [number, number, number] }> = {
  0: {
    floor: 2,
    points: [
      new THREE.Vector3(-30, 0.5, 15),
      new THREE.Vector3(-30, 0.5, -2),
      new THREE.Vector3(0, 0.5, -2),
      new THREE.Vector3(10, 0.5, -2),
      new THREE.Vector3(10, 0.5, -8),
    ],
    color: "#10b981",
    targetLabel: "OPD 204",
    targetPos: [10, 0.5, -15],
  },
  1: {
    floor: 3,
    points: [
      new THREE.Vector3(-38, 0.5, 0),
      new THREE.Vector3(-20, 0.5, 0),
      new THREE.Vector3(-5, 0.5, 2),
      new THREE.Vector3(0, 0.5, -5),
      new THREE.Vector3(0, 0.5, -12),
    ],
    color: "#4f6bed",
    targetLabel: "Lab 3B",
    targetPos: [0, 0.5, -12],
  },
  2: {
    floor: 4,
    points: [
      new THREE.Vector3(38, 0.5, 0),
      new THREE.Vector3(20, 0.5, 0),
      new THREE.Vector3(5, 0.5, 2),
      new THREE.Vector3(-5, 0.5, -2),
      new THREE.Vector3(-25, 0.5, -2),
      new THREE.Vector3(-25, 0.5, -14),
    ],
    color: "#ea580c",
    targetLabel: "X-Ray Suite 1",
    targetPos: [-25, 0.5, -14],
  },
  3: {
    floor: 1,
    points: [
      // Ground floor: move from main lobby area to registration counters
      new THREE.Vector3(0, 0.5, 15),
      new THREE.Vector3(-15, 0.5, 15),
      new THREE.Vector3(-30, 0.5, 15),
      new THREE.Vector3(-30, 0.5, 6),
      new THREE.Vector3(-30, 0.5, 0),
    ],
    color: "#15803d",
    targetLabel: "Registration",
    targetPos: [-30, 0.5, 0],
  },
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function HospitalMap3D({
  currentStep = 1,
  mode = "patient",
}: {
  currentStep?: number;
  mode?: "patient" | "admin";
}) {
  const navData = NAV_PATHS[currentStep] || NAV_PATHS[1];
  const [activeFloor, setActiveFloor] = useState(navData.floor);
  const floor = FLOORS.find((f) => f.id === activeFloor) || FLOORS[0];

  // Sync floor to nav step in patient mode
  React.useEffect(() => {
    if (mode === "patient" && NAV_PATHS[currentStep]) {
      setActiveFloor(NAV_PATHS[currentStep].floor);
    }
  }, [currentStep, mode]);

  // Ambient NPC paths for realism
  const ambientPaths = useMemo(() => {
    const paths: THREE.Vector3[][] = [];
    if (activeFloor === 1) {
      paths.push([
        new THREE.Vector3(-30, 0.5, 0), new THREE.Vector3(-10, 0.5, 0),
        new THREE.Vector3(0, 0.5, 12), new THREE.Vector3(20, 0.5, 12),
        new THREE.Vector3(30, 0.5, -5),
      ]);
      paths.push([
        new THREE.Vector3(30, 0.5, 18), new THREE.Vector3(10, 0.5, 12),
        new THREE.Vector3(-12, 0.5, 12), new THREE.Vector3(-30, 0.5, 25),
      ]);
    } else if (activeFloor === 2) {
      paths.push([
        new THREE.Vector3(-35, 0.5, -2), new THREE.Vector3(-10, 0.5, -2),
        new THREE.Vector3(0, 0.5, 5), new THREE.Vector3(25, 0.5, -2),
      ]);
      paths.push([
        new THREE.Vector3(28, 0.5, 5), new THREE.Vector3(10, 0.5, -2),
        new THREE.Vector3(-20, 0.5, -2), new THREE.Vector3(-30, 0.5, 15),
      ]);
    } else if (activeFloor === 3) {
      paths.push([
        new THREE.Vector3(-28, 0.5, 12), new THREE.Vector3(-10, 0.5, 2),
        new THREE.Vector3(10, 0.5, 2), new THREE.Vector3(28, 0.5, -8),
      ]);
      paths.push([
        new THREE.Vector3(28, 0.5, 12), new THREE.Vector3(5, 0.5, 2),
        new THREE.Vector3(-28, 0.5, -8),
      ]);
    } else {
      paths.push([
        new THREE.Vector3(-25, 0.5, 12), new THREE.Vector3(-5, 0.5, 2),
        new THREE.Vector3(18, 0.5, -14),
      ]);
      paths.push([
        new THREE.Vector3(18, 0.5, 12), new THREE.Vector3(5, 0.5, 2),
        new THREE.Vector3(-25, 0.5, -14),
      ]);
    }
    return paths;
  }, [activeFloor]);

  const showNav = NAV_PATHS[currentStep] && activeFloor === navData.floor;

  return (
    <div className="w-full h-full bg-slate-50 cursor-grab active:cursor-grabbing relative">
      <Canvas>
        <OrthographicCamera makeDefault position={[60, 55, 60]} zoom={5.5} near={-300} far={600} />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2.2}
          minZoom={2}
          maxZoom={18}
        />

        {/* Lighting */}
        <ambientLight intensity={1.6} />
        <directionalLight position={[25, 60, 25]} intensity={1.8} castShadow color="#ffffff" />
        <directionalLight position={[-30, 40, -30]} intensity={0.6} color="#e0f2fe" />

        {/* Ground */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.3, 0]} receiveShadow>
          <planeGeometry args={[200, 200]} />
          <meshBasicMaterial color="#f8fafc" />
        </mesh>

        {/* Grid */}
        <gridHelper args={[200, 40, "#e2e8f0", "#f1f5f9"]} position={[0, -0.2, 0]} />

        {/* Floor rooms */}
        <FloorScene floor={floor} />

        {/* Navigation path + NPCs for patient mode */}
        {showNav && (
          <>
            <AnimatedPath points={navData.points} color={navData.color} />
            <DestinationMarker position={navData.targetPos} label={navData.targetLabel} color={navData.color} />
            <NPCGroup path={navData.points} count={2} color={navData.color} />
          </>
        )}

        {/* Ambient NPCs */}
        {ambientPaths.map((path, i) => (
          <NPCGroup key={`ambient-${activeFloor}-${i}`} path={path} count={2} color="#94a3b8" />
        ))}
      </Canvas>

      {/* Floor Selector UI */}
      <div className="absolute right-3 top-3 z-30 flex flex-col gap-1">
        <div className="bg-white/90 backdrop-blur-md border border-slate-200/60 rounded-2xl shadow-sm p-1.5 flex flex-col gap-1">
          {FLOORS.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFloor(f.id)}
              className={`w-10 h-10 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                activeFloor === f.id
                  ? "bg-primary text-white shadow-md"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
              title={f.name}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Floor Label */}
      <div className="absolute left-3 bottom-3 z-30 bg-white/90 backdrop-blur-md border border-slate-200/60 rounded-xl shadow-sm px-3 py-2">
        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Floor</p>
        <p className="text-sm font-bold text-slate-700">{floor.name}</p>
      </div>

      {/* Patient indicator */}
      {showNav && (
        <div className="absolute left-3 top-3 z-30 bg-white/90 backdrop-blur-md border border-slate-200/60 rounded-xl shadow-sm px-3 py-2 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: navData.color }} />
          <span className="text-[10px] font-bold text-slate-600">Navigating to {navData.targetLabel}</span>
        </div>
      )}
    </div>
  );
}
