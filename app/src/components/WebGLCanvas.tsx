import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const PALETTE = ['#c8963e', '#d4a84b', '#b8832f', '#e2bc68', '#a67424'];

function createCircleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 32, 32);
  return new THREE.CanvasTexture(canvas);
}

class FallingRibbon {
  scene: THREE.Scene;
  yOffset: number;
  speed: number;
  colorIndex: number;
  points: THREE.Vector3[] = [];
  curve!: THREE.SplineCurve;
  curvePoints: THREE.Vector2[] = [];
  color!: THREE.Color;
  particleSystem: THREE.Points | null = null;
  geometry: THREE.BufferGeometry | null = null;
  material!: THREE.PointsMaterial;
  originalX: number[] = [];
  originalY: number[] = [];
  particleCount = 0;
  lineMesh: THREE.Line | null = null;
  lineMaterial!: THREE.LineBasicMaterial;
  circleTexture: THREE.CanvasTexture;
  time = 0;

  constructor(scene: THREE.Scene, yOffset: number, speed: number, colorIndex: number, circleTexture: THREE.CanvasTexture) {
    this.scene = scene;
    this.yOffset = yOffset;
    this.speed = speed;
    this.colorIndex = colorIndex;
    this.circleTexture = circleTexture;
    this.generatePath();
    this.buildLine();
    this.buildParticles();
  }

  generatePath() {
    const pts: THREE.Vector3[] = [];
    const numPoints = 20;
    for (let i = 0; i < numPoints; i++) {
      const x = (i / (numPoints - 1)) * 100 - 50;
      const y = Math.sin(i * 0.5) * 10 + (Math.random() - 0.5) * 6;
      const z = (Math.random() - 0.5) * 4;
      pts.push(new THREE.Vector3(x, y, z));
    }
    this.points = pts;
    const points2D = pts.map((p) => new THREE.Vector2(p.x, p.y));
    this.curve = new THREE.SplineCurve(points2D);
    this.curvePoints = this.curve.getPoints(300);
    this.color = new THREE.Color(PALETTE[this.colorIndex % PALETTE.length]);
  }

  buildLine() {
    const geometry = new THREE.BufferGeometry().setFromPoints(
      this.curvePoints.map((p) => new THREE.Vector3(p.x, p.y, 0))
    );
    this.lineMaterial = new THREE.LineBasicMaterial({
      color: this.color,
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
    });
    this.lineMesh = new THREE.Line(geometry, this.lineMaterial);
    this.lineMesh.position.y = this.yOffset;
    this.scene.add(this.lineMesh);
  }

  buildParticles() {
    const positions: number[] = [];
    const colors: number[] = [];
    this.originalX = [];
    this.originalY = [];

    for (let i = 0; i < this.curvePoints.length; i++) {
      const pt = this.curvePoints[i];
      const x = pt.x + (Math.random() - 0.5) * 1.5;
      const y = pt.y + (Math.random() - 0.5) * 1.5;
      const z = (Math.random() - 0.5) * 2;
      positions.push(x, y, z);
      this.originalX.push(x);
      this.originalY.push(y);
      colors.push(this.color.r, this.color.g, this.color.b);
    }

    this.particleCount = this.curvePoints.length;
    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    this.geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    this.material = new THREE.PointsMaterial({
      size: 0.4,
      map: this.circleTexture,
      transparent: true,
      opacity: 0.9,
      vertexColors: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    this.particleSystem = new THREE.Points(this.geometry, this.material);
    this.particleSystem.position.y = this.yOffset;
    this.scene.add(this.particleSystem);
  }

  update(time: number, scroll: number, mouse: { x: number; y: number }) {
    this.time = time;

    if (this.lineMesh) {
      const drawProgress = Math.min(1, Math.max(0, (time * this.speed * 0.3) % 1.5));
      this.lineMaterial.opacity = drawProgress * 0.6;
      this.lineMesh.position.y = this.yOffset - scroll * 0.01;
      this.lineMesh.position.x = mouse.x * 5;
      this.lineMesh.position.z = mouse.y * 2;
    }

    if (this.particleSystem && this.geometry) {
      const positionAttr = this.geometry.getAttribute('position') as THREE.BufferAttribute;
      const pt = new THREE.Vector3();

      for (let i = 0; i < this.particleCount; i++) {
        pt.fromBufferAttribute(positionAttr, i);
        const x = time * this.speed * 10 + i * 0.1;
        const y = time * this.speed * 10 + i * 0.1;
        pt.y = this.originalY[i] + Math.sin(x) * 2;
        pt.x = this.originalX[i] + Math.cos(y) * 2;
        positionAttr.setXYZ(i, pt.x, pt.y, pt.z);
      }

      positionAttr.needsUpdate = true;
      this.particleSystem.position.y = this.yOffset - scroll * 0.01;
      this.particleSystem.position.x = mouse.x * 5;
    }
  }
}

export default function WebGLCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x0a0a0a, 1);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 50);
    camera.lookAt(0, 0, 0);

    const circleTexture = createCircleTexture();
    const ribbons: FallingRibbon[] = [];

    for (let i = 0; i < 5; i++) {
      const ribbon = new FallingRibbon(
        scene,
        (i - 2) * 12,
        0.3 + Math.random() * 0.5,
        i,
        circleTexture
      );
      ribbons.push(ribbon);
    }

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const onScroll = () => {
      scrollRef.current = window.scrollY;
    };

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      for (const ribbon of ribbons) {
        ribbon.update(elapsed, scrollRef.current, mouseRef.current);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      scene.clear();
      circleTexture.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0"
      style={{ width: '100%', height: '100%' }}
    />
  );
}
