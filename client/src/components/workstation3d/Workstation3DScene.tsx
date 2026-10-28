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
  const [lightMode, setLightMode] = useState<'cyber' | 'warm'>('warm');
  const [hoveredObject, setHoveredObject] = useState<string | null>(null);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const monitorScreenMeshRef = useRef<THREE.Mesh | null>(null);
  const lampLightRef = useRef<THREE.PointLight | null>(null);
  const lampBulbRef = useRef<THREE.Mesh | null>(null);
  const fansRef = useRef<THREE.Mesh[]>([]);

  // Base camera positions
  const ROOM_CAMERA_POS = { x: 0, y: 2.1, z: 4.1 };
  const ROOM_CAMERA_LOOK = { x: 0, y: 1.4, z: 0 };
  const MONITOR_CAMERA_POS = { x: 0, y: 1.62, z: 1.6 };
  const MONITOR_CAMERA_LOOK = { x: 0, y: 1.62, z: -0.25 };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene setup — Clean, bright studio background, NO heavy black fog!
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x080e1e);
    // Subtle distance fog only for extreme depth
    scene.fog = new THREE.Fog(0x080e1e, 14, 28);

    // 2. Camera setup
    const width = container.clientWidth;
    const height = container.clientHeight;
    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 100);
    cameraRef.current = camera;
    camera.position.set(ROOM_CAMERA_POS.x, ROOM_CAMERA_POS.y, ROOM_CAMERA_POS.z);
    camera.lookAt(ROOM_CAMERA_LOOK.x, ROOM_CAMERA_LOOK.y, ROOM_CAMERA_LOOK.z);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    container.appendChild(renderer.domElement);

    // 4. Studio Lighting System — Bright, warm, inviting and visible
    // Balanced ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    // Main warm overhead key light
    const keyLight = new THREE.DirectionalLight(0xfff5ea, 2.8);
    keyLight.position.set(3.5, 6, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    // Cyber accent rim light (from left-front)
    const cyanRim = new THREE.DirectionalLight(0x06b6d4, 1.6);
    cyanRim.position.set(-4, 4.5, 3);
    scene.add(cyanRim);

    // Purple fill light (back-right)
    const purpleFill = new THREE.PointLight(0x8b5cf6, 2.2, 12);
    purpleFill.position.set(3, 3.5, -1);
    scene.add(purpleFill);

    // Left Window Cool Moonlight
    const moonLight = new THREE.DirectionalLight(0x93c5fd, 1.8);
    moonLight.position.set(-6, 5, 0);
    scene.add(moonLight);

    // Dedicated Desk Lamp Light — warm cozy pool of light over desk & keyboard
    const deskLampLight = new THREE.PointLight(0xfbbf24, 4.2, 7.5);
    deskLampLight.position.set(-1.1, 2.05, 0.15);
    deskLampLight.castShadow = true;
    lampLightRef.current = deskLampLight;
    scene.add(deskLampLight);

    // 5. Room Architecture & Floor
    // Modern Wood Plank Floor
    const floorGeo = new THREE.PlaneGeometry(18, 18);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x1f2430,
      roughness: 0.35,
      metalness: 0.15,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    scene.add(floor);

    // Plush Cyber Geometric Area Rug (under desk & chair)
    const rugGeo = new THREE.PlaneGeometry(4.4, 3.4);
    const rugMat = new THREE.MeshStandardMaterial({
      color: 0x0b1120,
      roughness: 0.8,
      metalness: 0.05,
    });
    const rug = new THREE.Mesh(rugGeo, rugMat);
    rug.rotation.x = -Math.PI / 2;
    rug.position.set(0, 0.005, 0.4);
    rug.receiveShadow = true;
    scene.add(rug);

    // Rug glowing cyan rim border
    const rugBorderGeo = new THREE.RingGeometry(1.6, 1.62, 4);
    const rugBorderMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
    const rugBorder = new THREE.Mesh(rugBorderGeo, rugBorderMat);
    rugBorder.rotation.x = -Math.PI / 2;
    rugBorder.rotation.z = Math.PI / 4;
    rugBorder.scale.set(1.9, 1.45, 1);
    rugBorder.position.set(0, 0.008, 0.4);
    scene.add(rugBorder);

    // Modern Studio Back Wall
    const wallGeo = new THREE.PlaneGeometry(18, 10);
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.7,
      metalness: 0.1,
    });
    const backWall = new THREE.Mesh(wallGeo, wallMat);
    backWall.position.set(0, 5, -3.2);
    backWall.receiveShadow = true;
    scene.add(backWall);

    // Left Wall with Loft Window
    const leftWall = new THREE.Mesh(wallGeo, wallMat);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-6, 5, 0);
    leftWall.receiveShadow = true;
    scene.add(leftWall);

    // Loft Window Frame & Glass
    const windowFrameMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.5 });
    const windowFrameGeo = new THREE.BoxGeometry(0.1, 3.6, 2.6);
    const windowFrame = new THREE.Mesh(windowFrameGeo, windowFrameMat);
    windowFrame.position.set(-5.95, 4.2, 0);
    scene.add(windowFrame);

    const windowGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.35,
      roughness: 0.1,
    });
    const windowGlassGeo = new THREE.PlaneGeometry(2.4, 3.4);
    const windowGlass = new THREE.Mesh(windowGlassGeo, windowGlassMat);
    windowGlass.rotation.y = Math.PI / 2;
    windowGlass.position.set(-5.92, 4.2, 0);
    scene.add(windowGlass);

    // Neon Accent Wall Strip
    const stripGeo = new THREE.BoxGeometry(8, 0.05, 0.05);
    const stripMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
    const neonStrip = new THREE.Mesh(stripGeo, stripMat);
    neonStrip.position.set(0, 4.2, -3.15);
    scene.add(neonStrip);

    // 6. Wall Floating Shelf & Props (Above Monitor)
    const shelfGeo = new THREE.BoxGeometry(3.2, 0.08, 0.45);
    const oakMat = new THREE.MeshStandardMaterial({ color: 0x4a3728, roughness: 0.5 });
    const shelf = new THREE.Mesh(shelfGeo, oakMat);
    shelf.position.set(0, 3.1, -3.0);
    shelf.castShadow = true;
    shelf.receiveShadow = true;
    scene.add(shelf);

    // Shelf metal brackets
    const bracketMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9 });
    [-1.2, 1.2].forEach(bx => {
      const bGeo = new THREE.BoxGeometry(0.06, 0.3, 0.4);
      const bracket = new THREE.Mesh(bGeo, bracketMat);
      bracket.position.set(bx, 2.95, -3.0);
      scene.add(bracket);
    });

    // Tech books on shelf
    const bookColors = [0x3b82f6, 0xef4444, 0x10b981, 0xf59e0b, 0x8b5cf6];
    bookColors.forEach((col, idx) => {
      const bGeo = new THREE.BoxGeometry(0.08, 0.32, 0.3);
      const bMat = new THREE.MeshStandardMaterial({ color: col, roughness: 0.4 });
      const book = new THREE.Mesh(bGeo, bMat);
      book.position.set(-1.0 + idx * 0.11, 3.3, -3.0);
      book.castShadow = true;
      scene.add(book);
    });

    // Golden Award Trophy on shelf
    const trophyBaseGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.08, 16);
    const trophyGoldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.95, roughness: 0.15 });
    const trophyBase = new THREE.Mesh(trophyBaseGeo, trophyGoldMat);
    trophyBase.position.set(0.9, 3.2, -3.0);
    scene.add(trophyBase);

    const trophyCupGeo = new THREE.CylinderGeometry(0.12, 0.04, 0.22, 16);
    const trophyCup = new THREE.Mesh(trophyCupGeo, trophyGoldMat);
    trophyCup.position.set(0.9, 3.35, -3.0);
    scene.add(trophyCup);

    // Wall Art Poster: "Full Stack Architect"
    const posterGeo = new THREE.PlaneGeometry(1.6, 1.0);
    const posterCanvas = document.createElement('canvas');
    posterCanvas.width = 512;
    posterCanvas.height = 320;
    const pCtx = posterCanvas.getContext('2d')!;
    pCtx.fillStyle = '#0B1120';
    pCtx.fillRect(0, 0, 512, 320);
    pCtx.strokeStyle = '#06B6D4';
    pCtx.lineWidth = 6;
    pCtx.strokeRect(10, 10, 492, 300);
    pCtx.fillStyle = '#FFFFFF';
    pCtx.font = 'bold 32px sans-serif';
    pCtx.fillText('SOJIB AHMED', 32, 80);
    pCtx.fillStyle = '#06B6D4';
    pCtx.font = 'bold 22px sans-serif';
    pCtx.fillText('FULL STACK DEVELOPER', 32, 120);
    pCtx.fillStyle = '#10B981';
    pCtx.font = '18px monospace';
    pCtx.fillText('// React 19 · Next.js · Node · MongoDB', 32, 180);
    pCtx.fillText('// 10+ Production Repositories Live', 32, 220);

    const posterTex = new THREE.CanvasTexture(posterCanvas);
    const posterMat = new THREE.MeshStandardMaterial({ map: posterTex, roughness: 0.3 });
    const poster = new THREE.Mesh(posterGeo, posterMat);
    poster.position.set(2.4, 2.2, -3.18);
    scene.add(poster);

    // 7. The Developer Desk (Rich Dark Walnut / Carbon)
    const deskTopGeo = new THREE.BoxGeometry(3.6, 0.12, 1.6);
    const deskTopMat = new THREE.MeshStandardMaterial({
      color: 0x242731,
      roughness: 0.3,
      metalness: 0.2,
    });
    const deskTop = new THREE.Mesh(deskTopGeo, deskTopMat);
    deskTop.position.set(0, 1.15, 0);
    deskTop.castShadow = true;
    deskTop.receiveShadow = true;
    scene.add(deskTop);

    // Heavy-duty Dual-Motor Standing Desk Frame & Legs (Steel)
    const legGeo = new THREE.BoxGeometry(0.1, 1.15, 0.1);
    const steelMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.9, roughness: 0.2 });
    [-1.5, 1.5].forEach(lx => {
      const leg = new THREE.Mesh(legGeo, steelMat);
      leg.position.set(lx, 0.575, 0);
      leg.castShadow = true;
      scene.add(leg);

      // Foot base
      const footGeo = new THREE.BoxGeometry(0.14, 0.05, 1.2);
      const foot = new THREE.Mesh(footGeo, steelMat);
      foot.position.set(lx, 0.025, 0);
      scene.add(foot);
    });

    // Desk Crossbar Beam
    const crossbarGeo = new THREE.BoxGeometry(3.0, 0.06, 0.06);
    const crossbar = new THREE.Mesh(crossbarGeo, steelMat);
    crossbar.position.set(0, 0.9, 0);
    scene.add(crossbar);

    // Giant Microfiber Desk Pad with stitched teal rim
    const padGeo = new THREE.BoxGeometry(2.6, 0.015, 0.9);
    const padMat = new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.6 });
    const deskPad = new THREE.Mesh(padGeo, padMat);
    deskPad.position.set(0, 1.218, 0.05);
    deskPad.receiveShadow = true;
    scene.add(deskPad);

    // 8. Ultrawide Curved Computer Monitor (Clickable Target!)
    const standMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.85, roughness: 0.2 });
    const standBaseGeo = new THREE.BoxGeometry(0.48, 0.025, 0.32);
    const standBase = new THREE.Mesh(standBaseGeo, standMat);
    standBase.position.set(0, 1.225, -0.32);
    scene.add(standBase);

    const standArmGeo = new THREE.BoxGeometry(0.09, 0.48, 0.09);
    const standArm = new THREE.Mesh(standArmGeo, standMat);
    standArm.position.set(0, 1.46, -0.34);
    scene.add(standArm);

    // Monitor Bezel Frame
    const monitorFrameGeo = new THREE.BoxGeometry(2.3, 0.98, 0.06);
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.7, roughness: 0.3 });
    const monitorFrame = new THREE.Mesh(monitorFrameGeo, frameMat);
    monitorFrame.position.set(0, 1.72, -0.28);
    monitorFrame.castShadow = true;
    scene.add(monitorFrame);

    // Monitor Active Canvas Screen
    const screenGeo = new THREE.PlaneGeometry(2.18, 0.90);
    const screenCanvas = document.createElement('canvas');
    screenCanvas.width = 1024;
    screenCanvas.height = 420;
    const sCtx = screenCanvas.getContext('2d')!;

    const drawScreen = () => {
      sCtx.fillStyle = '#030712';
      sCtx.fillRect(0, 0, 1024, 420);

      // Top gradient bar
      const grad = sCtx.createLinearGradient(0, 0, 1024, 0);
      grad.addColorStop(0, '#7C3AED');
      grad.addColorStop(0.5, '#06B6D4');
      grad.addColorStop(1, '#10B981');
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 1024, 10);

      // Header branding
      sCtx.fillStyle = '#FFFFFF';
      sCtx.font = 'bold 34px sans-serif';
      sCtx.fillText('SOJIB AHMED · FULL STACK DEVELOPER', 48, 76);

      sCtx.fillStyle = '#06B6D4';
      sCtx.font = 'bold 18px monospace';
      sCtx.fillText('🚀 SOJIB OS v2.6 ENTERPRISE · 10 PRODUCTION REPOSITORIES', 48, 116);

      // Simulated IDE bash window
      sCtx.fillStyle = '#090D1A';
      sCtx.strokeStyle = 'rgba(6, 182, 212, 0.5)';
      sCtx.lineWidth = 2;
      sCtx.beginPath();
      sCtx.roundRect(48, 145, 928, 220, 14);
      sCtx.fill();
      sCtx.stroke();

      sCtx.fillStyle = '#10B981';
      sCtx.font = '20px monospace';
      sCtx.fillText('$ git status --fullstack', 72, 195);
      sCtx.fillStyle = '#E2E8F0';
      sCtx.font = '18px monospace';
      sCtx.fillText('● ShopX BD Enterprise  ● FoodFlow Logistics  ● SkillForge AI', 72, 240);
      sCtx.fillText('● StartupForge         ● TypeMarket Store    ● InvestProp AI', 72, 275);
      sCtx.fillStyle = '#38BDF8';
      sCtx.fillText('● 10 Flagship Builds with Live Links & Verified Credentials', 72, 310);

      sCtx.fillStyle = '#F59E0B';
      sCtx.font = 'bold 20px sans-serif';
      sCtx.fillText('👉 CLICK ANYWHERE ON THIS SCREEN TO ZOOM IN & EXPLORE OS 👈', 72, 350);
    };
    drawScreen();

    const screenTexture = new THREE.CanvasTexture(screenCanvas);
    const screenMat = new THREE.MeshBasicMaterial({ map: screenTexture, toneMapped: false });
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.set(0, 1.72, -0.245);
    screenMesh.name = 'InteractiveMonitor';
    monitorScreenMeshRef.current = screenMesh;
    scene.add(screenMesh);

    // Screen backlight glow
    const screenGlow = new THREE.PointLight(0x06b6d4, 1.8, 3.8);
    screenGlow.position.set(0, 1.72, 0.2);
    scene.add(screenGlow);

    // 9. Fully Articulated Architectural Desk Lamp (Fixes floating cone bug!)
    const lampStandMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.85, roughness: 0.2 });
    
    // Heavy round base resting on desk
    const lampBaseGeo = new THREE.CylinderGeometry(0.14, 0.15, 0.035, 20);
    const lampBase = new THREE.Mesh(lampBaseGeo, lampStandMat);
    lampBase.position.set(-1.25, 1.228, -0.15);
    lampBase.castShadow = true;
    lampBase.name = 'DeskLamp';
    scene.add(lampBase);

    // Lower hinge pivot
    const hingeGeo = new THREE.SphereGeometry(0.045, 16, 16);
    const lowerHinge = new THREE.Mesh(hingeGeo, lampStandMat);
    lowerHinge.position.set(-1.25, 1.27, -0.15);
    scene.add(lowerHinge);

    // Lower arm angled up and slightly back
    const lowerArmGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.65, 12);
    const lowerArm = new THREE.Mesh(lowerArmGeo, lampStandMat);
    lowerArm.rotation.z = -Math.PI / 12;
    lowerArm.rotation.x = -Math.PI / 16;
    lowerArm.position.set(-1.28, 1.58, -0.2);
    lowerArm.castShadow = true;
    scene.add(lowerArm);

    // Middle elbow pivot
    const elbowHinge = new THREE.Mesh(hingeGeo, lampStandMat);
    elbowHinge.position.set(-1.2, 1.9, -0.22);
    scene.add(elbowHinge);

    // Upper arm angled forward over the desk
    const upperArmGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.55, 12);
    const upperArm = new THREE.Mesh(upperArmGeo, lampStandMat);
    upperArm.rotation.z = Math.PI / 6;
    upperArm.rotation.x = Math.PI / 8;
    upperArm.position.set(-1.12, 2.05, -0.05);
    upperArm.castShadow = true;
    scene.add(upperArm);

    // Conical lamp shade pointing down at desk
    const lampShadeGeo = new THREE.ConeGeometry(0.16, 0.22, 20);
    const lampShadeMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.85, roughness: 0.2 });
    const lampShade = new THREE.Mesh(lampShadeGeo, lampShadeMat);
    lampShade.rotation.x = Math.PI * 0.85;
    lampShade.rotation.z = -Math.PI / 10;
    lampShade.position.set(-1.08, 2.12, 0.12);
    lampShade.name = 'DeskLamp';
    lampShade.castShadow = true;
    scene.add(lampShade);

    // Glowing warm bulb inside the shade
    const bulbGeo = new THREE.SphereGeometry(0.05, 16, 16);
    const bulbMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });
    const bulb = new THREE.Mesh(bulbGeo, bulbMat);
    bulb.position.set(-1.08, 2.04, 0.13);
    bulb.name = 'DeskLamp';
    lampBulbRef.current = bulb;
    scene.add(bulb);

    // 10. Ergonomic Mesh Developer Chair in front of desk
    const chairGroup = new THREE.Group();
    chairGroup.position.set(0, 0, 1.35);

    // 5-Star Caster Base
    const starBaseMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9, roughness: 0.2 });
    for (let c = 0; c < 5; c++) {
      const armAngle = (c * Math.PI * 2) / 5;
      const starArmGeo = new THREE.BoxGeometry(0.05, 0.04, 0.42);
      const sArm = new THREE.Mesh(starArmGeo, starBaseMat);
      sArm.rotation.y = armAngle;
      sArm.position.set(Math.sin(armAngle) * 0.2, 0.08, Math.cos(armAngle) * 0.2);
      chairGroup.add(sArm);

      // Wheel
      const wheelGeo = new THREE.SphereGeometry(0.035, 10, 10);
      const wheel = new THREE.Mesh(wheelGeo, starBaseMat);
      wheel.position.set(Math.sin(armAngle) * 0.38, 0.035, Math.cos(armAngle) * 0.38);
      chairGroup.add(wheel);
    }

    // Hydraulic Lift Piston
    const pistonGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.5, 16);
    const piston = new THREE.Mesh(pistonGeo, starBaseMat);
    piston.position.y = 0.35;
    chairGroup.add(piston);

    // Ergonomic Seat Cushion
    const seatMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.7 });
    const seatGeo = new THREE.BoxGeometry(0.65, 0.08, 0.62);
    const seat = new THREE.Mesh(seatGeo, seatMat);
    seat.position.set(0, 0.62, 0);
    seat.castShadow = true;
    chairGroup.add(seat);

    // Curved Mesh Backrest
    const backMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.6 });
    const backGeo = new THREE.BoxGeometry(0.58, 0.72, 0.06);
    const chairBack = new THREE.Mesh(backGeo, backMat);
    chairBack.rotation.x = -Math.PI / 18;
    chairBack.position.set(0, 1.05, 0.28);
    chairBack.castShadow = true;
    chairGroup.add(chairBack);

    // Headrest
    const headrestGeo = new THREE.BoxGeometry(0.36, 0.16, 0.06);
    const headrest = new THREE.Mesh(headrestGeo, seatMat);
    headrest.position.set(0, 1.48, 0.33);
    chairGroup.add(headrest);

    // Left & Right Armrests
    const armMat = new THREE.MeshStandardMaterial({ color: 0x374151, metalness: 0.7 });
    [-0.34, 0.34].forEach(ax => {
      const aPostGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.28, 10);
      const aPost = new THREE.Mesh(aPostGeo, armMat);
      aPost.position.set(ax, 0.76, 0.02);
      chairGroup.add(aPost);

      const aPadGeo = new THREE.BoxGeometry(0.08, 0.03, 0.26);
      const aPad = new THREE.Mesh(aPadGeo, seatMat);
      aPad.position.set(ax, 0.9, 0.04);
      chairGroup.add(aPad);
    });

    scene.add(chairGroup);

    // 11. Mechanical Keyboard & Ergonomic Mouse on Desk
    const kbGeo = new THREE.BoxGeometry(0.88, 0.035, 0.3);
    const kbMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4, metalness: 0.3 });
    const keyboard = new THREE.Mesh(kbGeo, kbMat);
    keyboard.position.set(-0.15, 1.23, 0.14);
    keyboard.castShadow = true;
    scene.add(keyboard);

    // RGB glow plate under keyboard
    const kbGlowGeo = new THREE.BoxGeometry(0.9, 0.01, 0.32);
    const kbGlowMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
    const kbGlow = new THREE.Mesh(kbGlowGeo, kbGlowMat);
    kbGlow.position.set(-0.15, 1.218, 0.14);
    scene.add(kbGlow);

    // Wireless Mouse
    const mouseGeo = new THREE.BoxGeometry(0.12, 0.04, 0.18);
    const mouseMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.5, roughness: 0.3 });
    const mouse = new THREE.Mesh(mouseGeo, mouseMat);
    mouse.position.set(0.65, 1.23, 0.14);
    mouse.castShadow = true;
    scene.add(mouse);

    // 12. Ceramic Coffee Mug (Left side) with coffee surface
    const mugGeo = new THREE.CylinderGeometry(0.065, 0.06, 0.15, 20);
    const mugMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.2 });
    const mug = new THREE.Mesh(mugGeo, mugMat);
    mug.position.set(-0.9, 1.28, 0.18);
    mug.name = 'CoffeeMug';
    mug.castShadow = true;
    scene.add(mug);

    // Mug handle
    const handleGeo = new THREE.TorusGeometry(0.045, 0.012, 10, 16, Math.PI);
    const mugHandle = new THREE.Mesh(handleGeo, mugMat);
    mugHandle.rotation.z = Math.PI / 2;
    mugHandle.position.set(-0.97, 1.28, 0.18);
    scene.add(mugHandle);

    // Coffee liquid inside
    const coffeeGeo = new THREE.CylinderGeometry(0.058, 0.058, 0.02, 16);
    const coffeeMat = new THREE.MeshStandardMaterial({ color: 0x3d2314, roughness: 0.1 });
    const coffee = new THREE.Mesh(coffeeGeo, coffeeMat);
    coffee.position.set(-0.9, 1.34, 0.18);
    scene.add(coffee);

    // 13. Potted Succulent Desk Plant (Right side)
    const potGeo = new THREE.CylinderGeometry(0.09, 0.07, 0.14, 16);
    const potMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2 });
    const pot = new THREE.Mesh(potGeo, potMat);
    pot.position.set(0.95, 1.28, -0.15);
    pot.castShadow = true;
    scene.add(pot);

    const soilGeo = new THREE.CylinderGeometry(0.085, 0.085, 0.02, 16);
    const soilMat = new THREE.MeshStandardMaterial({ color: 0x271910 });
    const soil = new THREE.Mesh(soilGeo, soilMat);
    soil.position.set(0.95, 1.34, -0.15);
    scene.add(soil);

    // Succulent green leaves
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.3 });
    for (let l = 0; l < 8; l++) {
      const angle = (l * Math.PI * 2) / 8;
      const leafGeo = new THREE.ConeGeometry(0.035, 0.12, 6);
      const leaf = new THREE.Mesh(leafGeo, leafMat);
      leaf.rotation.z = Math.sin(angle) * 0.4;
      leaf.rotation.x = Math.cos(angle) * 0.4;
      leaf.position.set(0.95 + Math.sin(angle) * 0.04, 1.4, -0.15 + Math.cos(angle) * 0.04);
      scene.add(leaf);
    }

    // 14. Gaming PC Tower (Right of Desk)
    const pcCaseGeo = new THREE.BoxGeometry(0.44, 0.78, 0.72);
    const pcCaseMat = new THREE.MeshStandardMaterial({ color: 0x090d16, metalness: 0.85, roughness: 0.2 });
    const pcCase = new THREE.Mesh(pcCaseGeo, pcCaseMat);
    pcCase.position.set(1.42, 1.58, -0.15);
    pcCase.castShadow = true;
    scene.add(pcCase);

    // Tempered Glass Panel
    const glassGeo = new THREE.PlaneGeometry(0.4, 0.72);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x1e293b,
      transparent: true,
      opacity: 0.55,
      roughness: 0.1,
      metalness: 0.9,
    });
    const glassPanel = new THREE.Mesh(glassGeo, glassMat);
    glassPanel.rotation.y = -Math.PI / 2;
    glassPanel.position.set(1.195, 1.58, -0.15);
    scene.add(glassPanel);

    // RGB cooling fan rings
    const fanColors = [0x06b6d4, 0x8b5cf6, 0x10b981];
    fansRef.current = [];
    [1.74, 1.54, 1.34].forEach((fy, i) => {
      const ringGeo = new THREE.TorusGeometry(0.085, 0.018, 12, 24);
      const ringMat = new THREE.MeshBasicMaterial({ color: fanColors[i] });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(1.41, fy, 0.2);
      scene.add(ring);
      fansRef.current.push(ring);
    });

    // 15. Twinkling Stars & Moon Outside Left Window
    const starsGeo = new THREE.BufferGeometry();
    const starCount = 350;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPos[i] = -8 - Math.random() * 8;
      starPos[i + 1] = Math.random() * 12 + 1;
      starPos[i + 2] = (Math.random() - 0.5) * 20;
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xc7d2fe, size: 0.1 });
    const stars = new THREE.Points(starsGeo, starMat);
    scene.add(stars);

    // Glowing Moon
    const moonGeo = new THREE.SphereGeometry(0.35, 20, 20);
    const moonMat = new THREE.MeshBasicMaterial({ color: 0xfffbeb });
    const moon = new THREE.Mesh(moonGeo, moonMat);
    moon.position.set(-9.5, 6.2, -1.8);
    scene.add(moon);

    // 16. Floating Tech Hologram Badges in Orbit
    const techNodes: THREE.Mesh[] = [];
    const techColors = [0x06b6d4, 0x8b5cf6, 0x10b981, 0x38bdf8];
    for (let i = 0; i < 4; i++) {
      const tGeo = new THREE.OctahedronGeometry(0.07, 0);
      const tMat = new THREE.MeshStandardMaterial({
        color: techColors[i],
        emissive: techColors[i],
        emissiveIntensity: 0.9,
        wireframe: true,
      });
      const node = new THREE.Mesh(tGeo, tMat);
      scene.add(node);
      techNodes.push(node);
    }

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

      // Orbit floating tech hologram nodes
      techNodes.forEach((node, i) => {
        const angle = elapsedTime * 0.7 + (i * Math.PI) / 2;
        node.position.x = Math.cos(angle) * 1.6;
        node.position.y = 2.45 + Math.sin(elapsedTime * 2 + i) * 0.08;
        node.position.z = Math.sin(angle) * 0.65 - 0.2;
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
      const intersects = raycaster.intersectObjects([screenMesh, lampShade, lampBase, mug]);

      if (intersects.length > 0) {
        container.style.cursor = 'pointer';
        setHoveredObject(intersects[0].object.name);
      } else {
        container.style.cursor = 'default';
        setHoveredObject(null);
      }

      // Smooth camera parallax pan
      if (!isZoomed && cameraRef.current) {
        gsap.to(cameraRef.current.position, {
          x: ROOM_CAMERA_POS.x + mousePos.x * 0.35,
          y: ROOM_CAMERA_POS.y + mousePos.y * 0.22,
          duration: 1.2,
          ease: 'power2.out',
        });
      }
    };

    const handleClick = () => {
      raycaster.setFromCamera(mousePos, camera);
      const intersects = raycaster.intersectObjects([screenMesh, lampShade, lampBase, mug]);

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

  // GSAP Camera Zoom Transition
  useEffect(() => {
    const camera = cameraRef.current;
    if (!camera) return;

    if (isZoomed) {
      gsap.to(camera.position, {
        x: MONITOR_CAMERA_POS.x,
        y: MONITOR_CAMERA_POS.y,
        z: MONITOR_CAMERA_POS.z,
        duration: 1.4,
        ease: 'power3.inOut',
        onUpdate: () => camera.lookAt(MONITOR_CAMERA_LOOK.x, MONITOR_CAMERA_LOOK.y, MONITOR_CAMERA_LOOK.z),
      });
    } else {
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
    if (!lampLightRef.current || !lampBulbRef.current) return;
    if (lightMode === 'cyber') {
      lampLightRef.current.color.setHex(0xfbbf24);
      lampLightRef.current.intensity = 4.2;
      (lampBulbRef.current.material as THREE.MeshBasicMaterial).color.setHex(0xfbbf24);
      setLightMode('warm');
    } else {
      lampLightRef.current.color.setHex(0x06b6d4);
      lampLightRef.current.intensity = 3.6;
      (lampBulbRef.current.material as THREE.MeshBasicMaterial).color.setHex(0x06b6d4);
      setLightMode('cyber');
    }
  };

  return (
    <div className="relative w-full h-[620px] md:h-[720px] rounded-3xl overflow-hidden border border-[rgba(255,255,255,0.12)] shadow-2xl bg-[#080e1e]">
      {/* Three.js Canvas Container */}
      <div ref={mountRef} className="w-full h-full" />

      {/* Interactive Tooltip Overlay */}
      {hoveredObject && !isZoomed && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 pointer-events-none z-20">
          <div className="px-4 py-2 rounded-full bg-[#030712]/95 backdrop-blur-md border border-[#06B6D4] text-xs font-bold text-[#06B6D4] flex items-center gap-2 shadow-2xl animate-bounce">
            <Sparkles size={14} />
            {hoveredObject === 'InteractiveMonitor' && 'Click Monitor to Zoom in & Launch Sojib OS 🚀'}
            {hoveredObject === 'DeskLamp' && 'Click Desk Lamp to Switch Warm/Cyber Lighting 💡'}
            {hoveredObject === 'CoffeeMug' && "Sojib's Coffee Mug ☕"}
          </div>
        </div>
      )}

      {/* Floating 3D Room Controls HUD (Bottom Left) */}
      {!isZoomed && (
        <div className="absolute bottom-6 left-6 z-20 flex flex-wrap items-center gap-2">
          <button
            onClick={onMonitorClick}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-xs font-bold text-white hover:opacity-95 shadow-xl flex items-center gap-2 cursor-pointer transition-transform hover:scale-105"
          >
            <ZoomIn size={14} />
            <span>Zoom into Screen</span>
          </button>

          <button
            onClick={toggleLight}
            className="px-3.5 py-2.5 rounded-xl bg-[#090D1A]/90 border border-white/10 text-xs font-semibold text-gray-200 hover:text-white hover:border-[#06B6D4] flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            title="Toggle Room Lighting"
          >
            {lightMode === 'warm' ? <Sun size={14} className="text-[#F59E0B]" /> : <Moon size={14} className="text-[#06B6D4]" />}
            <span>{lightMode === 'warm' ? 'Warm Studio Mode 💡' : 'Cyber Neon Mode ⚡'}</span>
          </button>
        </div>
      )}

      {/* Tip Badge (Top Right) */}
      {!isZoomed && (
        <div className="absolute top-6 right-6 z-20 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#090D1A]/90 border border-white/15 text-[11px] font-medium text-gray-300 backdrop-blur-md shadow-lg">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
          <span>Move mouse to pan · Click monitor to enter Virtual OS</span>
        </div>
      )}
    </div>
  );
}
