import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const DottedSurface = () => {

  const containerRef = useRef(null);

  useEffect(() => {

    if (!containerRef.current) return;

    const SEPARATION = 110;
    const AMOUNTX = 40;
    const AMOUNTY = 60;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      10000
    );

    camera.position.set(0, 300, 950);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    containerRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.BufferGeometry();
    const positions = [];

    for (let ix = 0; ix < AMOUNTX; ix++) {

      for (let iy = 0; iy < AMOUNTY; iy++) {

        const x =
          ix * SEPARATION -
          (AMOUNTX * SEPARATION) / 2;

        const y = 0;

        const z =
          iy * SEPARATION -
          (AMOUNTY * SEPARATION) / 2;

        positions.push(x, y, z);

      }

    }

    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );

    const material = new THREE.PointsMaterial({
      size: 4.5,
      color: 0x5ee7ff, // softer cyan
      transparent: true,
      opacity: 0.45,   // less brightness
    });

    const points = new THREE.Points(
      geometry,
      material
    );

    scene.add(points);

    let count = 0;

    const animate = () => {

      requestAnimationFrame(animate);

      const pos =
        geometry.attributes.position.array;

      let i = 0;

      for (let ix = 0; ix < AMOUNTX; ix++) {

        for (let iy = 0; iy < AMOUNTY; iy++) {

          const index = i * 3;

          pos[index + 1] =
            Math.sin((ix + count) * 0.25) * 35 +
            Math.sin((iy + count) * 0.35) * 35;

          i++;

        }

      }

      geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);

      count += 0.035; // smoother motion

    };

    animate();

    const handleResize = () => {

      camera.aspect =
        window.innerWidth / window.innerHeight;

      camera.updateProjectionMatrix();

      renderer.setSize(
        window.innerWidth,
        window.innerHeight
      );

    };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {

      window.removeEventListener(
        "resize",
        handleResize
      );

      geometry.dispose();
      material.dispose();
      renderer.dispose();

    };

  }, []);

  return (

    <div
      ref={containerRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />

  );

};

export default DottedSurface;