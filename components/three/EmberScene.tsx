'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useDeviceTier } from '@/lib/hooks/useDeviceTier';
import { useInViewport } from '@/lib/hooks/useInViewport';

interface EmberSceneProps {
  hue?: number;
  className?: string;
}

/**
 * Hero WebGL: a slow cluster of smoked cuts floating in ember light plus a
 * drifting spark field. Budget-aware — capsule count, DPR and the spark count
 * all scale with the device tier, and the loop stops when off-screen.
 */
export function EmberScene({ hue = 38, className }: EmberSceneProps) {
  const mount = useRef<HTMLDivElement>(null);
  const { ref: host, visible } = useInViewport<HTMLDivElement>('120px');
  const visibleRef = useRef(visible);
  const { tier, reduced, ready, isMobile } = useDeviceTier();

  useEffect(() => {
    visibleRef.current = visible;
  }, [visible]);

  useEffect(() => {
    const container = mount.current;
    if (!container || !ready || reduced || tier === 'low') return;

    let disposed = false;
    const count = tier === 'high' ? 9 : 5;
    const sparkCount = tier === 'high' ? 900 : 320;
    const maxDpr = tier === 'high' ? 1.85 : 1.35;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(new THREE.Color().setHSL(hue / 360, 0.3, 0.06).getHex(), 0.055);

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0.4, 13);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: tier === 'high',
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      return; // no WebGL: the SVG fallback underneath stays visible
    }

    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const geometry = new THREE.CapsuleGeometry(0.52, 2.5, tier === 'high' ? 12 : 6, tier === 'high' ? 24 : 12);
    const meshes: THREE.Mesh[] = [];

    for (let i = 0; i < count; i += 1) {
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color().setHSL(((hue + i * 12) % 360) / 360, 0.52, 0.34),
        roughness: 0.52,
        metalness: 0.06,
      });
      const mesh = new THREE.Mesh(geometry, material);
      const angle = (i / count) * Math.PI * 2;
      const radius = 2.9 + (i % 3) * 0.75;
      mesh.position.set(Math.cos(angle) * radius, Math.sin(angle * 1.7) * 1.7, Math.sin(angle) * radius * 0.55);
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      mesh.userData.speed = 0.12 + Math.random() * 0.22;
      mesh.userData.offset = Math.random() * Math.PI * 2;
      group.add(mesh);
      meshes.push(mesh);
    }

    const sparkGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(sparkCount * 3);
    for (let i = 0; i < sparkCount; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 22;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    sparkGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const sparkMaterial = new THREE.PointsMaterial({
      color: new THREE.Color().setHSL(((hue + 14) % 360) / 360, 0.85, 0.68),
      size: 0.045,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const sparks = new THREE.Points(sparkGeometry, sparkMaterial);
    scene.add(sparks);

    const key = new THREE.PointLight(new THREE.Color().setHSL(hue / 360, 0.8, 0.6), 90, 26);
    key.position.set(4.5, 4, 6);
    const rim = new THREE.PointLight(new THREE.Color().setHSL(((hue + 190) % 360) / 360, 0.5, 0.62), 42, 30);
    rim.position.set(-6, -2.5, 4);
    scene.add(key, rim, new THREE.AmbientLight(0xffffff, 0.32));

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointer = (event: PointerEvent) => {
      pointer.tx = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.ty = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    if (!isMobile) window.addEventListener('pointermove', onPointer, { passive: true });

    const resize = () => {
      const { clientWidth, clientHeight } = container;
      if (!clientWidth || !clientHeight) return;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
      renderer.setSize(clientWidth, clientHeight, false);
      camera.aspect = clientWidth / clientHeight;
      camera.fov = clientWidth < 720 ? 52 : 38;
      camera.updateProjectionMatrix();
    };
    resize();

    const observer = new ResizeObserver(resize);
    observer.observe(container);

    const clock = new THREE.Clock();
    let frame = 0;

    const tick = () => {
      frame = requestAnimationFrame(tick);
      if (disposed || !visibleRef.current || document.hidden) return;

      const time = clock.getElapsedTime();
      pointer.x += (pointer.tx - pointer.x) * 0.045;
      pointer.y += (pointer.ty - pointer.y) * 0.045;

      group.rotation.y = time * 0.075 + pointer.x * 0.42;
      group.rotation.x = Math.sin(time * 0.16) * 0.11 + pointer.y * -0.22;

      for (const mesh of meshes) {
        const { speed, offset } = mesh.userData as { speed: number; offset: number };
        mesh.rotation.z = time * speed + offset;
        mesh.rotation.x += 0.0022;
        mesh.position.y += Math.sin(time * speed * 1.6 + offset) * 0.0022;
      }

      sparks.rotation.y = -time * 0.028;
      sparks.position.y = Math.sin(time * 0.22) * 0.35;

      const scroll = window.scrollY || 0;
      camera.position.z = 13 + Math.min(scroll / 220, 4);
      camera.position.y = 0.4 - Math.min(scroll / 900, 1.1);

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('pointermove', onPointer);
      geometry.dispose();
      sparkGeometry.dispose();
      sparkMaterial.dispose();
      for (const mesh of meshes) (mesh.material as THREE.Material).dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) container.removeChild(renderer.domElement);
    };
  }, [hue, ready, reduced, tier, isMobile]);

  return (
    <div ref={host} className={`webgl ${className ?? ''}`} aria-hidden="true">
      <div ref={mount} className="webgl__canvas" />
    </div>
  );
}
