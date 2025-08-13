import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const PineConeDelicate = () => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const pineConeRef = useRef(null);
  const lightsRef = useRef([]);
  const resourcesRef = useRef({
    geometries: [],
    materials: [],
    meshes: [],
    lineSegments: [],
    scaleGroups: [],
    instancedMeshes: []
  });

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear any existing canvas elements
    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }

    const { geometries, materials, meshes, lineSegments, scaleGroups, instancedMeshes } = resourcesRef.current;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color('#F0EEE6');

    const camera = new THREE.PerspectiveCamera(75, .8, 0.1, 1200);
    cameraRef.current = camera;
    camera.position.z = 16;
    camera.position.y = 1;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    rendererRef.current = renderer;
    renderer.setSize(550, 550);
    renderer.setClearColor('#F0EEE6');
    containerRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    lightsRef.current.push(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight.position.set(3, 9, 7.5);
    scene.add(directionalLight);
    lightsRef.current.push(directionalLight);

    const pineCone = new THREE.Group();
    pineConeRef.current = pineCone;

    const shape = new THREE.Shape();
    shape.moveTo(0.6, 0.3);
    shape.lineTo(0.4, 0.3);
    shape.lineTo(0.5, 2.7);
    shape.lineTo(1.2, 0.2);
    shape.lineTo(-0.2, 0.4);
    shape.lineTo(-1.3, 0.7);
    shape.closePath();

    const extrudeSettings = {
      depth: 0.05,
      bevelEnabled: true,
      bevelSegments: 10,
      steps: 3,
      bevelSize: 0.2,
      bevelThickness: 0.02
    };

    const scaleGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geometries.push(scaleGeometry);

    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: '#e0ded8',
      transparent: true,
      opacity: 0.15,
      roughness: 0.1,
      metalness: 0.0,
      transmission: 0.6,
      thickness: 0.1,
      side: THREE.DoubleSide
    });
    materials.push(glassMaterial);

    const wireframeMaterial = new THREE.LineBasicMaterial({
      color: '#666666',
      transparent: true,
      opacity: 0.3
    });
    materials.push(wireframeMaterial);

    const edgesGeometry = new THREE.EdgesGeometry(scaleGeometry);
    geometries.push(edgesGeometry);

    const layers = 38;
    const scalesPerLayer = 8;
    const totalScales = layers * scalesPerLayer;

    const instancedMesh = new THREE.InstancedMesh(scaleGeometry, glassMaterial, totalScales);
    instancedMeshes.push(instancedMesh);

    const wireframePositions = [];
    const wireframeColors = [];

    let scaleIndex = 0;
    const matrix = new THREE.Matrix4();
    const position = new THREE.Vector3();
    const rotation = new THREE.Euler();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();

    for (let layer = 0; layer < layers; layer++) {
      const yPosition = (layer / layers) * 18 - 9 - 0.9;
      let layerRadius;
      if (layer < 10) {
        layerRadius = Math.sin((layer / 10) * Math.PI * 0.5) * 2;
      } else {
        layerRadius = 2 + Math.sin(((layer - 10) / (layers - 10)) * Math.PI) * 2.5;
      }
      const taper = 1 - (layer / layers) * 0.3;

      for (let i = 0; i < scalesPerLayer; i++) {
        const angle = (i / scalesPerLayer) * Math.PI * 2 + (layer * 0.25);

        position.set(
          Math.cos(angle) * layerRadius * taper,
          yPosition,
          Math.sin(angle) * layerRadius * taper
        );

        rotation.set(Math.PI / 3, angle, 0);
        quaternion.setFromEuler(rotation);
        scale.set(0.8, 0.8, 0.8);

        matrix.compose(position, quaternion, scale);
        instancedMesh.setMatrixAt(scaleIndex, matrix);
        scaleIndex++;
      }
    }

    instancedMesh.instanceMatrix.needsUpdate = true;
    pineCone.add(instancedMesh);

    const wireframeGroup = new THREE.Group();
    for (let layer = 0; layer < layers; layer++) {
      const yPosition = (layer / layers) * 18 - 9 - 0.9;
      let layerRadius;
      if (layer < 10) {
        layerRadius = Math.sin((layer / 10) * Math.PI * 0.5) * 2;
      } else {
        layerRadius = 2 + Math.sin(((layer - 10) / (layers - 10)) * Math.PI) * 2.5;
      }
      const taper = 1 - (layer / layers) * 0.3;

      for (let i = 0; i < scalesPerLayer; i++) {
        const angle = (i / scalesPerLayer) * Math.PI * 2 + (layer * 0.25);

        const wireframe = new THREE.LineSegments(edgesGeometry, wireframeMaterial);
        wireframe.rotation.x = Math.PI / 3;
        wireframe.rotation.y = angle;
        wireframe.position.x = Math.cos(angle) * layerRadius * taper;
        wireframe.position.z = Math.sin(angle) * layerRadius * taper;
        wireframe.position.y = yPosition;
        wireframe.scale.set(0.8, 0.8, 0.8);

        lineSegments.push(wireframe);
        wireframeGroup.add(wireframe);
      }
    }

    pineCone.add(wireframeGroup);
    scene.add(pineCone);

    let time = 0;
    let animationFrameId;

    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      time += 0.005;

      pineCone.rotation.y = time * 0.3;
      pineCone.rotation.x = Math.sin(time * 0.5) * 0.05;
      pineCone.rotation.z = Math.cos(time * 0.7) * 0.03;

      const breathe = 1 + Math.sin(time * 0.5) * 0.02;
      pineCone.scale.set(breathe, breathe, breathe);

      renderer.render(scene, camera);
    }

    animate();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }

      if (sceneRef.current) {
        lightsRef.current.forEach(light => {
          sceneRef.current.remove(light);
        });

        if (pineConeRef.current) {
          sceneRef.current.remove(pineConeRef.current);
        }
      }

      resourcesRef.current.scaleGroups.forEach(group => {
        if (pineConeRef.current) {
          pineConeRef.current.remove(group);
        }
        while (group.children.length > 0) {
          group.remove(group.children[0]);
        }
      });

      resourcesRef.current.meshes.forEach(mesh => {
        if (mesh.parent) {
          mesh.parent.remove(mesh);
        }
      });

      resourcesRef.current.lineSegments.forEach(line => {
        if (line.parent) {
          line.parent.remove(line);
        }
      });

      resourcesRef.current.instancedMeshes.forEach(instancedMesh => {
        if (instancedMesh.parent) {
          instancedMesh.parent.remove(instancedMesh);
        }
        instancedMesh.dispose();
      });

      resourcesRef.current.geometries.forEach(geometry => {
        geometry.dispose();
      });

      resourcesRef.current.materials.forEach(material => {
        material.dispose();
      });

      if (rendererRef.current) {
        rendererRef.current.dispose();
        if (containerRef.current && rendererRef.current.domElement) {
          containerRef.current.removeChild(rendererRef.current.domElement);
        }
      }

      sceneRef.current = null;
      rendererRef.current = null;
      cameraRef.current = null;
      pineConeRef.current = null;
      lightsRef.current = [];
      resourcesRef.current = {
        geometries: [],
        materials: [],
        meshes: [],
        lineSegments: [],
        scaleGroups: [],
        instancedMeshes: []
      };
    };
  }, []);

  return (
    <div className="w-full flex justify-center items-center bg-[#F0EEE6]" style={{ height: '600px' }}>
      <div ref={containerRef} className="w-[550px] h-[550px]" />
    </div>
  );
};

export default PineConeDelicate;