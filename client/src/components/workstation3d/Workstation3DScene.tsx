import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { Sun, Moon, Sparkles, ZoomIn } from 'lucide-react';

interface WorkstationSceneProps {
  isZoomed: boolean;
  onMonitorClick: () => void;
  onToggleLighting?: (mode: 'cyber' | 'warm') => void;
}

export default function Workstation3DScene({ isZoomed, onMonitorClick }: WorkstationSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [lightMode, setLightMode] = useState<'cyber' | 'warm'>('cyber');
  const [hoveredObject, setHoveredObject] = useState<string | null>(null);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const monitorScreenMeshRef = useRef<THREE.Mesh | null>(null);
  const lampLightRef = useRef<THREE.PointLight | null>(null);
  const fansRef = useRef<THREE.Mesh[]>([]);

  // Base camera positions
  const ROOM_CAMERA_POS = { x: 0, y: 2.2, z: 4.2 };
  const ROOM_CAMERA_LOOK = { x: 0, y: 1.35, z: 0 };
  const MONITOR_CAMERA_POS = { x: 0, y: 1.5, z: 1.6 };
  const MONITOR_CAMERA_LOOK = { x: 0, y: 1.5, z: 0 };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x030712);
    scene.fog = new THREE.FogExp2(0x030712, 0.08);

    // 2. Camera setup
    const width = container.clientWidth;
    const height = container.clientHeight;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    cameraRef.current = camera;
    camera.position.set(ROOM_CAMERA_POS.x, ROOM_CAMERA_POS.y, ROOM_CAMERA_POS.z);
    camera.lookAt(ROOM_CAMERA_LOOK.x, ROOM_CAMERA_LOOK.y, ROOM_CAMERA_LOOK.z);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    container.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0x0a1026, 1.2);
    scene.add(ambientLight);

    // Cyan key light
    const cyanLight = new THREE.DirectionalLight(0x06b6d4, 1.8);
    cyanLight.position.set(4, 5, 3);
    cyanLight.castShadow = true;
    cyanLight.shadow.mapSize.width = 1024;
    cyanLight.shadow.mapSize.height = 1024;
    scene.add(cyanLight);

    // Purple fill light
    const purpleLight = new THREE.PointLight(0x8b5cf6, 2.5, 10);
    purpleLight.position.set(-3, 3, -1);
    scene.add(purpleLight);

    // Desk lamp spotlight
    const deskLamp = new THREE.PointLight(0x06b6d4, 2.8, 6);
    deskLamp.position.set(-1.4, 2.4, 0.2);
    deskLamp.castShadow = true;
    lampLightRef.current = deskLamp;
    scene.add(deskLamp);

    // 5. Room geometry & Floor
    const floorGeo = new THREE.PlaneGeometry(16, 16);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x050a17,
      roughness: 0.4,
      metalness: 0.2,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    scene.add(floor);

    // Back wall
    const wallGeo = new THREE.PlaneGeometry(16, 8);
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x040714, roughness: 0.8 });
    const backWall = new THREE.Mesh(wallGeo, wallMat);
    backWall.position.set(0, 4, -3);
    backWall.receiveShadow = true;
    scene.add(backWall);

    // Left wall with window opening
    const leftWall = new THREE.Mesh(wallGeo, wallMat);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-5, 4, 0);
    scene.add(leftWall);

    // Neon wall strip
    const stripGeo = new THREE.BoxGeometry(7, 0.04, 0.04);
    const stripMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
    const neonStrip = new THREE.Mesh(stripGeo, stripMat);
    neonStrip.position.set(0, 3.4, -2.95);
    scene.add(neonStrip);

    // 6. The Developer Desk (Mahogany / Dark Carbon)
    const deskTopGeo = new THREE.BoxGeometry(3.6, 0.1, 1.6);
    const deskTopMat = new THREE.MeshStandardMaterial({
      color: 0x111625,
      roughness: 0.3,
      metalness: 0.1,
    });
    const deskTop = new THREE.Mesh(deskTopGeo, deskTopMat);
    deskTop.position.set(0, 1.15, 0);
    deskTop.castShadow = true;
    deskTop.receiveShadow = true;
    scene.add(deskTop);

    // Desk Legs (Steel)
    const legGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.15, 16);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x222a3f, metalness: 0.8, roughness: 0.2 });
    [
      [-1.6, 0.575, -0.65],
      [1.6, 0.575, -0.65],
      [-1.6, 0.575, 0.65],
      [1.6, 0.575, 0.65],
    ].forEach(([x, y, z]) => {
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(x, y, z);
      leg.castShadow = true;
      scene.add(leg);
    });

    // Desk Pad / Giant Mousepad with cyan glow rim
    const padGeo = new THREE.BoxGeometry(2.4, 0.015, 0.8);
    const padMat = new THREE.MeshStandardMaterial({ color: 0x070b16, roughness: 0.6 });
    const deskPad = new THREE.Mesh(padGeo, padMat);
    deskPad.position.set(0, 1.21, 0.05);
    deskPad.receiveShadow = true;
    scene.add(deskPad);

    // 7. Ultrawide Curved Computer Monitor
    const monitorStandBase = new THREE.BoxGeometry(0.4, 0.02, 0.3);
    const standMat = new THREE.MeshStandardMaterial({ color: 0x1f293d, metalness: 0.9, roughness: 0.1 });
    const standBase = new THREE.Mesh(monitorStandBase, standMat);
    standBase.position.set(0, 1.22, -0.3);
    scene.add(standBase);

    const standArm = new THREE.BoxGeometry(0.08, 0.45, 0.08);
    const stand = new THREE.Mesh(standArm, standMat);
    stand.position.set(0, 1.45, -0.32);
    scene.add(stand);

    // Monitor Bezel Frame
    const monitorFrameGeo = new THREE.BoxGeometry(2.1, 0.9, 0.06);
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x0d1322, metalness: 0.7, roughness: 0.3 });
    const monitorFrame = new THREE.Mesh(monitorFrameGeo, frameMat);
    monitorFrame.position.set(0, 1.68, -0.28);
    monitorFrame.castShadow = true;
    scene.add(monitorFrame);

    // Monitor Active Screen (Click Target!)
    const screenGeo = new THREE.PlaneGeometry(1.98, 0.82);
    
    // Dynamic canvas texture for the screen in 3D mode
    const screenCanvas = document.createElement('canvas');
    screenCanvas.width = 1024;
    screenCanvas.height = 420;
    const sCtx = screenCanvas.getContext('2d')!;
    
    const drawScreen = () => {
      sCtx.fillStyle = '#030712';
      sCtx.fillRect(0, 0, 1024, 420);

      // Gradient banner
      const grad = sCtx.createLinearGradient(0, 0, 1024, 0);
      grad.addColorStop(0, '#7C3AED');
      grad.addColorStop(0.5, '#06B6D4');
      grad.addColorStop(1, '#10B981');
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 1024, 8);

      // Header text
      sCtx.fillStyle = '#FFFFFF';
      sCtx.font = 'bold 36px Inter, sans-serif';
      sCtx.fillText('SOJIB AHMED · FULL STACK DEVELOPER', 48, 80);

      sCtx.fillStyle = '#06B6D4';
      sCtx.font = '600 22px Inter, sans-serif';
      sCtx.fillText('🚀 SOJIB OS v2.6 — CLICK MONITOR TO LAUNCH VIRTUAL OS', 48, 125);

      // Code mockup box
      sCtx.fillStyle = '#090D1A';
      sCtx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
      sCtx.lineWidth = 2;
      sCtx.roundRect(48, 160, 928, 200, 16);
      sCtx.fill();
      sCtx.stroke();

      sCtx.fillStyle = '#10B981';
      sCtx.font = '20px monospace';
      sCtx.fillText('$ git status --portfolio', 72, 210);
      sCtx.fillStyle = '#D1D5DB';
      sCtx.fillText('On branch main · 4 Flagship Production Projects · Open to opportunities', 72, 250);
      sCtx.fillStyle = '#06B6D4';
      sCtx.fillText('ShopX BD Enterprise | FoodFlow | SkillForge | StartupForge', 72, 290);
      sCtx.fillStyle = '#F59E0B';
      sCtx.fillText('>> CLICK ANYWHERE ON THIS SCREEN TO ZOOM IN <<', 72, 335);
    };
    drawScreen();

    const screenTexture = new THREE.CanvasTexture(screenCanvas);
    const screenMat = new THREE.MeshBasicMaterial({
      map: screenTexture,
      toneMapped: false,
    });
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.set(0, 1.68, -0.245);
    screenMesh.name = 'InteractiveMonitor';
    monitorScreenMeshRef.current = screenMesh;
    scene.add(screenMesh);

    // Screen backlight glow
    const screenLight = new THREE.PointLight(0x06b6d4, 1.5, 3.5);
    screenLight.position.set(0, 1.68, 0.2);
    scene.add(screenLight);

    // 8. Gaming PC Tower (Right of Desk)
    const pcCaseGeo = new THREE.BoxGeometry(0.42, 0.75, 0.7);
    const pcCaseMat = new THREE.MeshStandardMaterial({ color: 0x080c18, metalness: 0.8, roughness: 0.2 });
    const pcCase = new THREE.Mesh(pcCaseGeo, pcCaseMat);
    pcCase.position.set(1.4, 1.55, -0.15);
    pcCase.castShadow = true;
    scene.add(pcCase);

    // Glass panel
    const glassGeo = new THREE.PlaneGeometry(0.38, 0.7);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x111625,
      transparent: true,
      opacity: 0.6,
      roughness: 0.1,
      metalness: 0.9,
    });
    const glassPanel = new THREE.Mesh(glassGeo, glassMat);
    glassPanel.rotation.y = -Math.PI / 2;
    glassPanel.position.set(1.185, 1.55, -0.15);
    scene.add(glassPanel);

    // RGB fans inside case
    const fanColors = [0x06b6d4, 0x8b5cf6, 0x10b981];
    fansRef.current = [];
    [1.7, 1.5, 1.3].forEach((y, i) => {
      const ringGeo = new THREE.TorusGeometry(0.08, 0.015, 12, 24);
      const ringMat = new THREE.MeshBasicMaterial({ color: fanColors[i] });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(1.39, y, 0.19);
      scene.add(ring);
      fansRef.current.push(ring);
    });

    // 9. Mechanical Keyboard & Mouse
    const kbGeo = new THREE.BoxGeometry(0.85, 0.03, 0.28);
    const kbMat = new THREE.MeshStandardMaterial({ color: 0x151b2e, metalness: 0.4 });
    const keyboard = new THREE.Mesh(kbGeo, kbMat);
    keyboard.position.set(-0.15, 1.22, 0.12);
    scene.add(keyboard);

    // Mouse
    const mouseGeo = new THREE.BoxGeometry(0.12, 0.04, 0.18);
    const mouseMat = new THREE.MeshStandardMaterial({ color: 0x1c2438, metalness: 0.5 });
    const mouse = new THREE.Mesh(mouseGeo, mouseMat);
    mouse.position.set(0.65, 1.22, 0.12);
    scene.add(mouse);

    // 10. Coffee Mug (Left side) with steam
    const mugGeo = new THREE.CylinderGeometry(0.06, 0.055, 0.14, 20);
    const mugMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.2 });
    const mug = new THREE.Mesh(mugGeo, mugMat);
    mug.position.set(-1.1, 1.27, 0.1);
    mug.name = 'CoffeeMug';
    scene.add(mug);

    // 11. Desk Lamp
    const lampBaseGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.03, 16);
    const lampBase = new THREE.Mesh(lampBaseGeo, standMat);
    lampBase.position.set(-1.4, 1.22, -0.2);
    scene.add(lampBase);

    const lampShadeGeo = new THREE.ConeGeometry(0.14, 0.2, 16);
    const lampShadeMat = new THREE.MeshStandardMaterial({ color: 0x1f293d, metalness: 0.8 });
    const lampShade = new THREE.Mesh(lampShadeGeo, lampShadeMat);
    lampShade.rotation.x = Math.PI / 4;
    lampShade.position.set(-1.35, 2.3, 0.05);
    lampShade.name = 'DeskLamp';
    scene.add(lampShade);

    // 12. Floating Tech Hologram Badges (Three.js Spheres with glow)
    const techNodes: THREE.Mesh[] = [];
    const techColors = [0x06b6d4, 0x8b5cf6, 0x10b981, 0x3b82f6];
    for (let i = 0; i < 4; i++) {
      const geo = new THREE.OctahedronGeometry(0.06, 0);
      const mat = new THREE.MeshStandardMaterial({
        color: techColors[i],
        emissive: techColors[i],
        emissiveIntensity: 0.8,
        wireframe: true,
      });
      const node = new THREE.Mesh(geo, mat);
      scene.add(node);
      techNodes.push(node);
    }

    // 13. Stars outside the room
    const starsGeo = new THREE.BufferGeometry();
    const starCount = 300;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPos[i] = (Math.random() - 0.5) * 30;
      starPos[i + 1] = Math.random() * 15 + 2;
      starPos[i + 2] = -10 - Math.random() * 10;
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ color: 0x88ccff, size: 0.1 });
    const stars = new THREE.Points(starsGeo, starMat);
    scene.add(stars);

    // Animation Loop
    const startTime = performance.now();
    let frameId: number;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const elapsedTime = (performance.now() - startTime) * 0.001;

      // Rotate PC cooling fan rings
      fansRef.current.forEach(fan => {
        fan.rotation.z += 0.08;
      });

      // Float tech hologram badges in orbit
      techNodes.forEach((node, i) => {
        const angle = elapsedTime * 0.8 + (i * Math.PI) / 2;
        node.position.x = Math.cos(angle) * 1.5;
        node.position.y = 2.4 + Math.sin(elapsedTime * 2 + i) * 0.08;
        node.position.z = Math.sin(angle) * 0.6 - 0.2;
        node.rotation.x += 0.02;
        node.rotation.y += 0.03;
      });

      renderer.render(scene, camera);
    };
    animate();

    // Mouse Interaction / Raycasting
    const raycaster = new THREE.Raycaster();
    const mousePos = new THREE.Vector2();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mousePos.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mousePos.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mousePos, camera);
      const intersects = raycaster.intersectObjects([screenMesh, lampShade, mug]);

      if (intersects.length > 0) {
        container.style.cursor = 'pointer';
        setHoveredObject(intersects[0].object.name);
      } else {
        container.style.cursor = 'default';
        setHoveredObject(null);
      }

      // Subtle parallax tilt when in room view
      if (!isZoomed && cameraRef.current) {
        gsap.to(cameraRef.current.position, {
          x: ROOM_CAMERA_POS.x + mousePos.x * 0.3,
          y: ROOM_CAMERA_POS.y + mousePos.y * 0.2,
          duration: 1.2,
          ease: 'power2.out',
        });
      }
    };

    const handleClick = () => {
      raycaster.setFromCamera(mousePos, camera);
      const intersects = raycaster.intersectObjects([screenMesh, lampShade, mug]);

      if (intersects.length > 0) {
        const clickedName = intersects[0].object.name;
        if (clickedName === 'InteractiveMonitor') {
          onMonitorClick();
        } else if (clickedName === 'DeskLamp') {
          toggleLight();
        }
      }
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('click', handleClick);

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('click', handleClick);
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  // GSAP Camera Zoom Transition when isZoomed changes
  useEffect(() => {
    const camera = cameraRef.current;
    if (!camera) return;

    if (isZoomed) {
      // Zoom into monitor
      gsap.to(camera.position, {
        x: MONITOR_CAMERA_POS.x,
        y: MONITOR_CAMERA_POS.y,
        z: MONITOR_CAMERA_POS.z,
        duration: 1.4,
        ease: 'power3.inOut',
        onUpdate: () => camera.lookAt(MONITOR_CAMERA_LOOK.x, MONITOR_CAMERA_LOOK.y, MONITOR_CAMERA_LOOK.z),
      });
    } else {
      // Zoom out to room
      gsap.to(camera.position, {
        x: ROOM_CAMERA_POS.x,
        y: ROOM_CAMERA_POS.y,
        z: ROOM_CAMERA_POS.z,
        duration: 1.4,
        ease: 'power3.inOut',
        onUpdate: () => camera.lookAt(ROOM_CAMERA_LOOK.x, ROOM_CAMERA_LOOK.y, ROOM_CAMERA_LOOK.z),
      });
    }
  }, [isZoomed]);

  const toggleLight = () => {
    if (!lampLightRef.current) return;
    if (lightMode === 'cyber') {
      lampLightRef.current.color.setHex(0xffaa44);
      lampLightRef.current.intensity = 3.5;
      setLightMode('warm');
    } else {
      lampLightRef.current.color.setHex(0x06b6d4);
      lampLightRef.current.intensity = 2.8;
      setLightMode('cyber');
    }
  };

  return (
    <div className="relative w-full h-[620px] md:h-[720px] rounded-3xl overflow-hidden border border-[rgba(255,255,255,0.08)] shadow-2xl bg-[#030712]">
      {/* Three.js Canvas Container */}
      <div ref={mountRef} className="w-full h-full" />

      {/* Interactive Tooltip Overlay */}
      {hoveredObject && !isZoomed && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 pointer-events-none z-20">
          <div className="px-4 py-2 rounded-full bg-[#030712]/90 backdrop-blur-md border border-[#06B6D4] text-xs font-bold text-[#06B6D4] flex items-center gap-2 shadow-xl animate-bounce">
            <Sparkles size={14} />
            {hoveredObject === 'InteractiveMonitor' && 'Click Monitor to Zoom in & Launch Sojib OS 🚀'}
            {hoveredObject === 'DeskLamp' && 'Click Desk Lamp to Switch Ambient Light 💡'}
            {hoveredObject === 'CoffeeMug' && "Sojib's Coffee Mug ☕"}
          </div>
        </div>
      )}

      {/* Floating 3D Room Controls HUD (Bottom Left) */}
      {!isZoomed && (
        <div className="absolute bottom-6 left-6 z-20 flex flex-wrap items-center gap-2">
          <button
            onClick={onMonitorClick}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-xs font-bold text-white hover:opacity-95 shadow-lg flex items-center gap-2 cursor-pointer transition-transform hover:scale-105"
          >
            <ZoomIn size={14} />
            <span>Zoom into Screen</span>
          </button>

          <button
            onClick={toggleLight}
            className="px-3.5 py-2.5 rounded-xl bg-[#0B1120]/90 border border-white/10 text-xs font-semibold text-gray-300 hover:text-white hover:border-[#06B6D4] flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            title="Toggle Room Lighting"
          >
            {lightMode === 'cyber' ? <Sun size={14} className="text-[#F59E0B]" /> : <Moon size={14} className="text-[#06B6D4]" />}
            <span>{lightMode === 'cyber' ? 'Cyber Mode' : 'Warm Mode'}</span>
          </button>
        </div>
      )}

      {/* Tip Badge (Top Right) */}
      {!isZoomed && (
        <div className="absolute top-6 right-6 z-20 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#090D1A]/80 border border-white/10 text-[11px] font-medium text-gray-400 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
          <span>Move mouse to pan · Click monitor to enter OS</span>
        </div>
      )}
    </div>
  );
}
