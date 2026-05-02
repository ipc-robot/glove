import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ForceArrow = ({ fx, fy, fz, fMag }) => {
  const ref = useRef();
  useFrame(() => {
    if (ref.current) {
      if (fMag > 0.01) {
        // 指向目标矢量方向
        const dir = new THREE.Vector3(fx, fy, fz).normalize();
        const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
        // 使用 slerp 平滑插值，让箭头转动看起来更自然
        ref.current.quaternion.slerp(q, 0.2);
      } else {
        // 没有受力时默认垂直于表面（这里简单重置为初始状态）
        ref.current.quaternion.slerp(new THREE.Quaternion(), 0.1);
      }
    }
  });

  const isActive = fMag > 0.01;
  const length = isActive ? Math.min(Math.max(fMag * 0.2, 0.4), 3.0) : 0.25;
  const color = isActive ? "#EF4444" : "#94A3B8"; // 激活红色，休眠灰色
  const opacity = isActive ? 1.0 : 0.4;
  const coneHeight = isActive ? 0.2 : 0.15;
  const cylRadius = isActive ? 0.025 : 0.015;
  const coneRadius = isActive ? 0.08 : 0.05;

  return (
    <group ref={ref}>
      <mesh position={[0, -coneHeight / 2, 0]}>
        <coneGeometry args={[coneRadius, coneHeight, 8]} />
        <meshStandardMaterial color={color} transparent opacity={opacity} />
      </mesh>
      <mesh position={[0, -coneHeight - (length - coneHeight) / 2, 0]}>
        <cylinderGeometry args={[cylRadius, cylRadius, length - coneHeight, 8]} />
        <meshStandardMaterial color={color} transparent opacity={opacity} />
      </mesh>
    </group>
  );
};

const FingerSegment = ({ length, radius, angle, isTip, forceIndex, forces, triboIndex, tribo, children }) => {

  const tex = useMemo(() => {
    const data = new Uint8Array(8 * 8 * 4);
    const texture = new THREE.DataTexture(data, 8, 8, THREE.RGBAFormat);
    texture.magFilter = THREE.NearestFilter; // Sharp edges for the patch
    texture.minFilter = THREE.NearestFilter;
    return texture;
  }, []);

  // 提取三维力数据
  let fx = 0, fy = 0, fz = 0, fMag = 0;
  if (forceIndex !== undefined && forces) {
    fx = forces[forceIndex * 3] || 0;
    fy = forces[forceIndex * 3 + 1] || 0;
    fz = forces[forceIndex * 3 + 2] || 0;
    fMag = Math.sqrt(fx * fx + fy * fy + fz * fz);
  }

  // Tribo values
  let tIntensity = 0;
  if (triboIndex !== undefined && tribo) {
    const tIdx = Array.isArray(triboIndex) ? triboIndex[0] : triboIndex;
    tIntensity = Math.min((tribo[tIdx] || 0) / 100, 1);
  }
  const tColor = new THREE.Color("#C084FC").lerp(new THREE.Color("#4C1D95"), tIntensity);

  // Paint the 8x8 DataTexture
  const d = tex.image.data;
  // 1. Fill base gray color (#CBD5E1 -> R:203, G:213, B:225)
  for (let i = 0; i < 64; i++) {
    d[i * 4] = 203;
    d[i * 4 + 1] = 213;
    d[i * 4 + 2] = 225;
    d[i * 4 + 3] = 255;
  }

  // 2. Paint patches
  // u (cols) maps around circumference. +Z (palmar front) is around u=0 (col 0). Span col 7, 0, 1.
  // v (rows) maps length. Bottom is row 0, top is row 7.
  if (triboIndex !== undefined) {
    const rV = Math.round(tColor.r * 255), gV = Math.round(tColor.g * 255), bV = Math.round(tColor.b * 255);
    // Tribo spans full length to connect cross joints
    for (let r = 0; r <= 7; r++) {
      for (let c of [7, 0, 1]) {
        const idx = (r * 8 + c) * 4;
        d[idx] = rV; d[idx + 1] = gV; d[idx + 2] = bV;
      }
    }
  }
  tex.needsUpdate = true;

  return (
    <group rotation={[angle * Math.PI / 180, 0, 0]}>
      {/* Joint sphere */}
      <mesh>
        <sphereGeometry args={[radius * 1.05, 16, 16, isTip ? Math.PI / 2 : 0]} />
        <meshStandardMaterial
          {...(isTip ? { map: tex, color: "white" } : { color: "#94A3B8" })}
          roughness={0.95}
          metalness={0.0}
        />
      </mesh>

      {/* Base Bone cylinder painted with Dynamic DataTexture */}
      <mesh position={[0, length / 2, 0]}>
        <cylinderGeometry args={[radius * (isTip ? 0.6 : 0.8), radius, length, 16]} />
        <meshStandardMaterial map={tex} roughness={0.95} metalness={0.0} />
      </mesh>

      {/* Rounded Tip Cap */}
      {isTip && (
        <mesh position={[0, length, 0]}>
          <sphereGeometry args={[radius * 0.6, 16, 16]} />
          <meshStandardMaterial color="#CBD5E1" roughness={0.95} metalness={0.0} />
        </mesh>
      )}

      {/* 3D Force Sensor (半圆) & Vector Arrow */}
      {forceIndex !== undefined && (
        <group position={[0, length / 2, radius * 0.95]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <sphereGeometry args={[radius * 0.5, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#38BDF8" transparent opacity={0.7} />
          </mesh>
          <ForceArrow fx={fx} fy={fy} fz={fz} fMag={fMag} />
        </group>
      )}

      {/* Next segment anchor */}
      <group position={[0, length, 0]}>
        {children}
      </group>
    </group>
  );
};

const ForceSensorNode = ({ forceIndex, forces, radius = 0.3, position = [0, 0, 0] }) => {
  if (forceIndex === undefined || !forces) return null;
  const fx = forces[forceIndex * 3] || 0;
  const fy = forces[forceIndex * 3 + 1] || 0;
  const fz = forces[forceIndex * 3 + 2] || 0;
  const fMag = Math.sqrt(fx * fx + fy * fy + fz * fz);

  return (
    <group position={position}>
      {/* 3D Force Sensor (半圆) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <sphereGeometry args={[radius * 0.5, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#38BDF8" transparent opacity={0.7} />
      </mesh>
      {/* Vector Arrow */}
      <ForceArrow fx={fx} fy={fy} fz={fz} fMag={fMag} />
    </group>
  );
};

export default function HandSkeleton({ currentData }) {
  const group = useRef();

  // Helper to extract specific data ranges based on the mockup schema
  const joints = currentData ? currentData.slice(1, 11) : new Array(10).fill(0);
  const forces = currentData ? currentData.slice(11, 53) : new Array(42).fill(0);
  const tribo = currentData ? currentData.slice(53, 61) : new Array(8).fill(0);

  const trapezoidShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-1, -1.75);
    shape.lineTo(1, -1.75);
    shape.lineTo(1.5, 1.75);
    shape.lineTo(-1.5, 1.75);
    shape.lineTo(-1, -1.75);
    return shape;
  }, []);

  const extrudeSettings = {
    depth: 0.6,
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.1,
    bevelSegments: 3,
  };

  return (
    <group ref={group} rotation={[0, Math.PI / 6, 0]} scale={[1, 1, 1]} position={[0, 0, 0]}>
      {/* Palm (Trapezoid) */}
      <mesh position={[0, 0, -0.3]}>
        <extrudeGeometry args={[trapezoidShape, extrudeSettings]} />
        {/* material-0: Face (Front/Back) uses plain color, material-1: Side uses plain color */}
        <meshStandardMaterial attach="material-0" color="#CBD5E1" roughness={0.95} metalness={0.0} />
        <meshStandardMaterial attach="material-1" color="#CBD5E1" roughness={0.95} metalness={0.0} />
      </mesh>

      {/* Palm Force Sensors (依据批注分布) */}
      <ForceSensorNode forceIndex={4} forces={forces} radius={0.6} position={[-0.35, 1.2, 0.3]} />  {/* S5: 对齐中指 */}
      <ForceSensorNode forceIndex={7} forces={forces} radius={0.6} position={[0.35, 1.2, 0.3]} /> {/* S8: 对齐无名指 */}
      <ForceSensorNode forceIndex={10} forces={forces} radius={0.6} position={[1.05, 1.2, 0.3]} /> {/* S11: 对齐小指 */}
      <ForceSensorNode forceIndex={1} forces={forces} radius={0.8} position={[-0.7, -0.6, 0.3]} /> {/* S2 */}
      <ForceSensorNode forceIndex={13} forces={forces} radius={0.8} position={[0.7, -0.6, 0.3]} />  {/* S14 */}

      {/* Index Finger */}
      <group position={[-1.1, 1.75, 0]}>
        <FingerSegment length={1.2} radius={0.3} angle={joints[0]} forceIndex={3} forces={forces}>
          <FingerSegment length={0.8} radius={0.28} angle={joints[1]} triboIndex={0} tribo={tribo}>
            <FingerSegment length={0.6} radius={0.25} angle={joints[1] * 0.5} isTip forceIndex={2} triboIndex={0} tribo={tribo} forces={forces} />
          </FingerSegment>
        </FingerSegment>
      </group>

      {/* Middle Finger */}
      <group position={[-0.35, 1.85, 0]}>
        <FingerSegment length={1.3} radius={0.32} angle={joints[2]} forceIndex={6} forces={forces}>
          <FingerSegment length={0.9} radius={0.3} angle={joints[3]} triboIndex={1} tribo={tribo}>
            <FingerSegment length={0.7} radius={0.27} angle={joints[3] * 0.5} isTip forceIndex={5} triboIndex={1} tribo={tribo} forces={forces} />
          </FingerSegment>
        </FingerSegment>
      </group>

      {/* Ring Finger */}
      <group position={[0.35, 1.8, 0]}>
        <FingerSegment length={1.2} radius={0.3} angle={joints[4]} forceIndex={9} forces={forces}>
          <FingerSegment length={0.8} radius={0.28} angle={joints[5]} triboIndex={2} tribo={tribo}>
            <FingerSegment length={0.6} radius={0.25} angle={joints[5] * 0.5} isTip forceIndex={8} triboIndex={2} tribo={tribo} forces={forces} />
          </FingerSegment>
        </FingerSegment>
      </group>

      {/* Pinky Finger */}
      <group position={[1.1, 1.6, 0]}>
        <FingerSegment length={0.9} radius={0.25} angle={joints[6]} forceIndex={12} forces={forces}>
          <FingerSegment length={0.6} radius={0.23} angle={joints[7]} triboIndex={3} tribo={tribo}>
            <FingerSegment length={0.5} radius={0.2} angle={joints[7] * 0.5} isTip forceIndex={11} triboIndex={3} tribo={tribo} forces={forces} />
          </FingerSegment>
        </FingerSegment>
      </group>

      {/* Thumb */}
      <group position={[-1.5, -0.5, 0]} rotation={[0, -Math.PI / 6, Math.PI / 4]}>
        <FingerSegment length={1.0} radius={0.35} angle={joints[8] * 0.5}>
          <FingerSegment length={0.8} radius={0.32} angle={joints[9]} triboIndex={4} tribo={tribo}>
            <FingerSegment length={0.6} radius={0.3} angle={joints[9] * 0.5} isTip forceIndex={0} triboIndex={4} tribo={tribo} forces={forces} />
          </FingerSegment>
        </FingerSegment>
      </group>
    </group>
  );
}
