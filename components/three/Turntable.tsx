'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useDeviceTier } from '@/lib/hooks/useDeviceTier';
import { useInViewport } from '@/lib/hooks/useInViewport';

interface TurntableProps {
  hue: number;
  chroma?: number;
  className?: string;
}

/** Product-detail turntable: drag to spin, releases back into a slow idle. */
export function Turntable({ hue, className }: TurntableProps) {
  const mount = useRef<HTMLDivElement>(null);
  const { ref: host, visible } = useInViewport<HTMLDivElement>('80px');
  const visibleRef = useRef(visible);
  const { tier, reduced, ready } = useDeviceTier();

  useEffect(() => {
    visibleRef.current = visible;
  }, [visible]);

  useEffect(() => {
    const container = mount.current;
    if (!container || !ready || reduced || tier === 'low') return;

    let disposed = false;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 60);
    camera.position.set(0, 0.2, 8.5);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return;
    }
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const pivot = new THREE.Group();
    scene.add(pivot);

    const geometry = new THREE.CapsuleGeometry(0.78, 3.5, 16, 34);
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color().setHSL(hue / 360, 0.5, 0.34),
      roughness: 0.46,
      metalness: 0.08,
    });
    const cut = new THREE.Mesh(geometry, material);
    cut.rotation.z = Math.PI * 0.14;
    pivot.add(cut);

    const tieGeometry = new THREE.TorusGeometry(0.82, 0.06, 8, 32);
    const tieMaterial = new THREE.MeshStandardMaterial({ color: 0xe8dcc6, roughness: 0.8 });
    for (const y of [1.86, -1.86]) {
      const tie = new THREE.Mesh(tieGeometry, tieMaterial);
      tie.position.y = y;
      tie.rotation.x = Math.PI / 2;
      cut.add(tie);
    }

    const key = new THREE.PointLight(new THREE.Color().setHSL(hue / 360, 0.75, 0.62), 60, 20);
    key.position.set(3, 3, 5);
    const fill = new THREE.PointLight(0x9fc6d8, 26, 24);
    fill.position.set(-4, -1.5, 3);
    scene.add(key, fill, new THREE.AmbientLight(0xffffff, 0.44));

    const state = { velocity: 0.004, dragging: false, lastX: 0 };

    const onDown = (event: PointerEvent) => {
      state.dragging = true;
      state.lastX = event.clientX;
      container.setPointerCapture?.(event.pointerId);
    };
    const onMove = (event: PointerEvent) => {
      if (!state.dragging) return;
      const delta = event.clientX - state.lastX;
      state.lastX = event.clientX;
      state.velocity = delta * 0.0012;
      pivot.rotation.y += delta * 0.008;
    };
    const onUp = () => {
      state.dragging = false;
    };

    container.addEventListener('pointerdown', onDown);
    container.addEventListener('pointermove', onMove);
    container.addEventListener('pointerup', onUp);
    container.addEventListener('pointercancel', onUp);
    container.addEventListener('pointerleave', onUp);

    const resize = () => {
      const { clientWidth, clientHeight } = container;
      if (!clientWidth || !clientHeight) return;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, tier === 'high' ? 1.8 : 1.3));
      renderer.setSize(clientWidth, clientHeight, false);
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(container);

    let frame = 0;
    const tick = () => {
      frame = requestAnimationFrame(tick);
      if (disposed || !visibleRef.current || document.hidden) return;
      if (!state.dragging) {
        state.velocity += (0.004 - state.velocity) * 0.03;
        pivot.rotation.y += state.velocity;
      }
      cut.position.y = Math.sin(Date.now() * 0.0009) * 0.09;
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      container.removeEventListener('pointerdown', onDown);
      container.removeEventListener('pointermove', onMove);
      container.removeEventListener('pointerup', onUp);
      container.removeEventListener('pointercancel', onUp);
      container.removeEventListener('pointerleave', onUp);
      geometry.dispose();
      material.dispose();
      tieGeometry.dispose();
      tieMaterial.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) container.removeChild(renderer.domElement);
    };
  }, [hue, ready, reduced, tier]);

  return (
    <div ref={host} className={`webgl webgl--turntable ${className ?? ''}`}>
      <div ref={mount} className="webgl__canvas" />
    </div>
  );
}
