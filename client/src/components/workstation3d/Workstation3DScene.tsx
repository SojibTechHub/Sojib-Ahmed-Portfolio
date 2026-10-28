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
  const keyLightRef = useRef<THREE.DirectionalLight | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);

  // Aesthetic 3/4 perspective camera coordinates (removes flat orthographic look)
  const ROOM_CAMERA_POS = { x: 0.55, y: 2.22, z: 3.85 };
  const ROOM_CAMERA_LOOK = { x: 0, y: 1.35, z: -0.15 };
  const MONITOR_CAMERA_POS = { x: 0, y: 1.62, z: 1.55 };
  const MONITOR_CAMERA_LOOK = { x: 0, y: 1.62, z: -0.28 };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0a0f1d);
    scene.fog = new THREE.Fog(0x0a0f1d, 15, 30);

    // 2. Camera Setup (Natural 45deg field of view)
    const width = container.clientWidth;
    const height = container.clientHeight;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 80);
    cameraRef.current = camera;
    camera.position.set(ROOM_CAMERA_POS.x, ROOM_CAMERA_POS.y, ROOM_CAMERA_POS.z);
    camera.lookAt(ROOM_CAMERA_LOOK.x, ROOM_CAMERA_LOOK.y, ROOM_CAMERA_LOOK.z);

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    container.appendChild(renderer.domElement);

    // 4. Lighting System — Warm, Cozy Loft & Studio Illumination
    const ambientLight = new THREE.AmbientLight(0xfff7ed, 1.6);
    ambientLightRef.current = ambientLight;
    scene.add(ambientLight);

    // Main warm overhead studio key light
    const keyLight = new THREE.DirectionalLight(0xffedd5, 2.6);
    keyLight.position.set(4, 6.5, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.bias = -0.0004;
    keyLightRef.current = keyLight;
    scene.add(keyLight);

    // Window daylight / moonlight (left side)
    const windowLight = new THREE.DirectionalLight(0x93c5fd, 1.4);
    windowLight.position.set(-6, 5, 1);
    scene.add(windowLight);

    // Back accent rim light (purple/cyan)
    const rimLight = new THREE.PointLight(0x8b5cf6, 2.2, 10);
    rimLight.position.set(2.8, 3.2, -1.2);
    scene.add(rimLight);

    // Desk Lamp warm pool of light
    const deskLampLight = new THREE.PointLight(0xf59e0b, 4.5, 6.5);
    deskLampLight.position.set(-1.1, 2.1, 0.1);
    deskLampLight.castShadow = true;
    lampLightRef.current = deskLampLight;
    scene.add(deskLampLight);

    // 5. Room Architecture & Modern Materials
    // Hardwood Floor with subtle sheen
    const floorGeo = new THREE.PlaneGeometry(16, 16);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x181c26,
      roughness: 0.35,
      metalness: 0.1,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Luxury Area Rug under desk
    const rugGeo = new THREE.PlaneGeometry(4.2, 3.2);
    const rugMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.85,
    });
    const rug = new THREE.Mesh(rugGeo, rugMat);
    rug.rotation.x = -Math.PI / 2;
    rug.position.set(0, 0.005, 0.35);
    rug.receiveShadow = true;
    scene.add(rug);

    // Rug glowing cyan border trim
    const rugTrimGeo = new THREE.RingGeometry(1.65, 1.67, 4);
    const rugTrimMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
    const rugTrim = new THREE.Mesh(rugTrimGeo, rugTrimMat);
    rugTrim.rotation.x = -Math.PI / 2;
    rugTrim.rotation.z = Math.PI / 4;
    rugTrim.scale.set(1.75, 1.35, 1);
    rugTrim.position.set(0, 0.008, 0.35);
    scene.add(rugTrim);

    // Back Studio Wall (Dark Navy)
    const backWallGeo = new THREE.PlaneGeometry(16, 9);
    const backWallMat = new THREE.MeshStandardMaterial({ color: 0x0d1322, roughness: 0.8 });
    const backWall = new THREE.Mesh(backWallGeo, backWallMat);
    backWall.position.set(0, 4.5, -3.1);
    backWall.receiveShadow = true;
    scene.add(backWall);

    // Left Studio Wall with Loft Window
    const leftWall = new THREE.Mesh(backWallGeo, backWallMat);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-6, 4.5, 0);
    leftWall.receiveShadow = true;
    scene.add(leftWall);

    // Modern Loft Window on Left Wall
    const windowFrameGeo = new THREE.BoxGeometry(0.08, 3.2, 2.4);
    const windowFrameMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.3 });
    const windowFrame = new THREE.Mesh(windowFrameGeo, windowFrameMat);
    windowFrame.position.set(-5.95, 4.0, 0);
    scene.add(windowFrame);

    // Window Glass with soft blue glow
    const windowGlassGeo = new THREE.PlaneGeometry(2.2, 3.0);
    const windowGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.35,
      roughness: 0.1,
    });
    const windowGlass = new THREE.Mesh(windowGlassGeo, windowGlassMat);
    windowGlass.rotation.y = Math.PI / 2;
    windowGlass.position.set(-5.92, 4.0, 0);
    scene.add(windowGlass);

    // Window Blinds Slats (creates gorgeous architectural shadows)
    const blindMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5 });
    for (let b = 0; b < 10; b++) {
      const bGeo = new THREE.BoxGeometry(0.04, 0.04, 2.2);
      const blind = new THREE.Mesh(bGeo, blindMat);
      blind.position.set(-5.93, 2.7 + b * 0.28, 0);
      scene.add(blind);
    }

    // 6. Signature Scandinavian Acoustic Wood Slat Wall Panel (Behind the desk)
    const slatGroup = new THREE.Group();
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x785336, roughness: 0.45 });
    const slatBackMat = new THREE.MeshStandardMaterial({ color: 0x050811, roughness: 0.9 });
    
    // Slat felt backboard
    const slatBackGeo = new THREE.BoxGeometry(3.8, 3.6, 0.04);
    const slatBack = new THREE.Mesh(slatBackGeo, slatBackMat);
    slatBack.position.set(0, 3.2, -3.05);
    slatGroup.add(slatBack);

    // Vertical solid oak slats
    for (let s = -22; s <= 22; s++) {
      const slatGeo = new THREE.BoxGeometry(0.045, 3.5, 0.03);
      const slat = new THREE.Mesh(slatGeo, woodMat);
      slat.position.set(s * 0.082, 3.2, -3.02);
      slat.castShadow = true;
      slatGroup.add(slat);
    }
    scene.add(slatGroup);

    // 7. Floating Wall Shelf with Books & Golden Trophy
    const shelfGeo = new THREE.BoxGeometry(2.8, 0.08, 0.42);
    const shelfMat = new THREE.MeshStandardMaterial({ color: 0x3e2817, roughness: 0.4 });
    const shelf = new THREE.Mesh(shelfGeo, shelfMat);
    shelf.position.set(0, 3.4, -2.85);
    shelf.castShadow = true;
    shelf.receiveShadow = true;
    scene.add(shelf);

    // Shelf metal brackets
    const bracketMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9, roughness: 0.2 });
    [-1.0, 1.0].forEach(bx => {
      const bGeo = new THREE.BoxGeometry(0.05, 0.35, 0.38);
      const bMesh = new THREE.Mesh(bGeo, bracketMat);
      bMesh.position.set(bx, 3.22, -2.85);
      scene.add(bMesh);
    });

    // Naturally leaning & stacked tech books
    const bookColors = [0x2563eb, 0xdc2626, 0x059669, 0xd97706, 0x7c3aed, 0x0891b2];
    bookColors.forEach((color, i) => {
      const h = 0.28 + (i % 3) * 0.04;
      const bGeo = new THREE.BoxGeometry(0.065, h, 0.26);
      const bMat = new THREE.MeshStandardMaterial({ color, roughness: 0.4 });
      const book = new THREE.Mesh(bGeo, bMat);
      // Slight natural lean on the last book
      if (i === bookColors.length - 1) {
        book.rotation.z = -Math.PI / 10;
        book.position.set(-0.85 + i * 0.085 + 0.04, 3.44 + h / 2, -2.85);
      } else {
        book.position.set(-0.85 + i * 0.085, 3.44 + h / 2, -2.85);
      }
      book.castShadow = true;
      scene.add(book);
    });

    // Golden Award Trophy
    const trophyGoldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.95, roughness: 0.15 });
    const trophyBaseGeo = new THREE.CylinderGeometry(0.07, 0.09, 0.08, 16);
    const trophyBase = new THREE.Mesh(trophyBaseGeo, trophyGoldMat);
    trophyBase.position.set(0.8, 3.48, -2.85);
    scene.add(trophyBase);

    const trophyCupGeo = new THREE.CylinderGeometry(0.11, 0.04, 0.24, 16);
    const trophyCup = new THREE.Mesh(trophyCupGeo, trophyGoldMat);
    trophyCup.position.set(0.8, 3.64, -2.85);
    scene.add(trophyCup);

    // Trailing Potted Plant on Shelf (Hanging Vines)
    const shelfPotGeo = new THREE.CylinderGeometry(0.08, 0.06, 0.12, 16);
    const shelfPotMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
    const shelfPot = new THREE.Mesh(shelfPotGeo, shelfPotMat);
    shelfPot.position.set(-1.15, 3.5, -2.85);
    scene.add(shelfPot);

    const vineMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.4 });
    for (let v = 0; v < 6; v++) {
      const vGeo = new THREE.ConeGeometry(0.03, 0.25 + v * 0.05, 5);
      const vine = new THREE.Mesh(vGeo, vineMat);
      vine.rotation.x = Math.PI * 0.85;
      vine.rotation.z = (v - 3) * 0.2;
      vine.position.set(-1.15 + (v - 3) * 0.04, 3.45 - (v * 0.04), -2.68);
      scene.add(vine);
    }

    // 8. Framed Developer Art / Certificate (Right Wall)
    const frameGeo = new THREE.BoxGeometry(1.6, 1.1, 0.04);
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8, roughness: 0.2 });
    const frameMesh = new THREE.Mesh(frameGeo, frameMat);
    frameMesh.position.set(2.45, 2.45, -3.05);
    scene.add(frameMesh);

    // Canvas inside frame
    const certCanvas = document.createElement('canvas');
    certCanvas.width = 512;
    certCanvas.height = 340;
    const cCtx = certCanvas.getContext('2d')!;
    cCtx.fillStyle = '#060B17';
    cCtx.fillRect(0, 0, 512, 340);
    cCtx.strokeStyle = '#06B6D4';
    cCtx.lineWidth = 6;
    cCtx.strokeRect(12, 12, 488, 316);
    cCtx.fillStyle = '#FFFFFF';
    cCtx.font = 'bold 32px sans-serif';
    cCtx.fillText('SOJIB AHMED', 36, 75);
    cCtx.fillStyle = '#06B6D4';
    cCtx.font = 'bold 22px sans-serif';
    cCtx.fillText('FULL STACK DEVELOPER', 36, 115);
    cCtx.fillStyle = '#94A3B8';
    cCtx.font = '17px monospace';
    cCtx.fillText('// React 19 · Next.js · Node.js', 36, 175);
    cCtx.fillText('// Express · MongoDB · TypeScript', 36, 210);
    cCtx.fillStyle = '#10B981';
    cCtx.font = 'bold 18px sans-serif';
    cCtx.fillText('VERIFIED FULL STACK ARCHITECT ★', 36, 270);

    const certTex = new THREE.CanvasTexture(certCanvas);
    const certMat = new THREE.MeshStandardMaterial({ map: certTex, roughness: 0.2 });
    const certPlane = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.0), certMat);
    certPlane.position.set(2.45, 2.45, -3.02);
    scene.add(certPlane);

    // Frame backlight glow
    const frameGlow = new THREE.PointLight(0x06b6d4, 1.2, 3);
    frameGlow.position.set(2.45, 2.45, -2.8);
    scene.add(frameGlow);

    // 9. The Developer Desk (Rich Solid Walnut with Beveled Edges)
    const deskTopGeo = new THREE.BoxGeometry(3.6, 0.12, 1.6);
    const deskMat = new THREE.MeshStandardMaterial({
      color: 0x242731,
      roughness: 0.35,
      metalness: 0.15,
    });
    const deskTop = new THREE.Mesh(deskTopGeo, deskMat);
    deskTop.position.set(0, 1.15, 0);
    deskTop.castShadow = true;
    deskTop.receiveShadow = true;
    scene.add(deskTop);

    // Heavy-duty Dual-Motor Standing Desk Frame (Matte Charcoal Steel)
    const steelLegMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.85, roughness: 0.25 });
    [-1.5, 1.5].forEach(lx => {
      const legGeo = new THREE.BoxGeometry(0.1, 1.15, 0.1);
      const leg = new THREE.Mesh(legGeo, steelLegMat);
      leg.position.set(lx, 0.575, 0);
      leg.castShadow = true;
      scene.add(leg);

      const footGeo = new THREE.BoxGeometry(0.14, 0.05, 1.2);
      const foot = new THREE.Mesh(footGeo, steelLegMat);
      foot.position.set(lx, 0.025, 0);
      scene.add(foot);
    });

    // Crossbar
    const crossbar = new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.06, 0.06), steelLegMat);
    crossbar.position.set(0, 0.9, 0);
    scene.add(crossbar);

    // Giant Microfiber Desk Mat (Soft Slate with Cyan Stitched Rim)
    const padGeo = new THREE.BoxGeometry(2.7, 0.015, 0.9);
    const padMat = new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.7 });
    const deskPad = new THREE.Mesh(padGeo, padMat);
    deskPad.position.set(0, 1.218, 0.06);
    deskPad.receiveShadow = true;
    scene.add(deskPad);

    // 10. Studio Monitor Audio Speakers (Left & Right framing the monitor)
    const speakerMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3, metalness: 0.4 });
    const coneMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.2 }); // Yellow Kevlar cone
    const tweeterMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.2 });

    [-1.38, 1.16].forEach((sx, idx) => {
      const spkGroup = new THREE.Group();
      // Cabinet
      const spkGeo = new THREE.BoxGeometry(0.24, 0.42, 0.26);
      const spk = new THREE.Mesh(spkGeo, speakerMat);
      spk.castShadow = true;
      spkGroup.add(spk);

      // Woofer cone
      const coneGeo = new THREE.CylinderGeometry(0.07, 0.04, 0.02, 16);
      const cone = new THREE.Mesh(coneGeo, coneMat);
      cone.rotation.x = Math.PI / 2;
      cone.position.set(0, -0.06, 0.135);
      spkGroup.add(cone);

      // Tweeter
      const tweetGeo = new THREE.SphereGeometry(0.028, 14, 14);
      const tweet = new THREE.Mesh(tweetGeo, tweeterMat);
      tweet.position.set(0, 0.1, 0.135);
      spkGroup.add(tweet);

      // Angle inward 12 degrees toward developer
      spkGroup.rotation.y = idx === 0 ? 0.22 : -0.22;
      spkGroup.position.set(sx, 1.42, -0.2);
      scene.add(spkGroup);
    });

    // 11. Ultrawide Curved Computer Monitor (Clickable Target!)
    const standMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.85, roughness: 0.2 });
    const standBase = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.025, 0.3), standMat);
    standBase.position.set(0, 1.225, -0.32);
    scene.add(standBase);

    const standArm = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.48, 0.09), standMat);
    standArm.position.set(0, 1.46, -0.34);
    scene.add(standArm);

    // Bezel
    const monitorFrameGeo = new THREE.BoxGeometry(2.32, 0.98, 0.06);
    const frameMat2 = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8, roughness: 0.2 });
    const monitorFrame = new THREE.Mesh(monitorFrameGeo, frameMat2);
    monitorFrame.position.set(0, 1.72, -0.28);
    monitorFrame.castShadow = true;
    scene.add(monitorFrame);

    // Monitor Active Canvas Screen
    const screenGeo = new THREE.PlaneGeometry(2.22, 0.90);
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
      sCtx.fillText('🚀 SOJIB OS v2.6 ENTERPRISE · FULL STACK ARCHITECTURE', 48, 116);

      // Terminal window
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
      sCtx.fillText('● Flagship Builds with Live Links & Verified Credentials', 72, 310);

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

    // Ambient bias glow behind monitor
    const screenGlow = new THREE.PointLight(0x06b6d4, 2.2, 4.0);
    screenGlow.position.set(0, 1.75, -0.15);
    scene.add(screenGlow);

    // 12. Architectural Articulated Desk Lamp (Pointed naturally down at desk)
    const lampStandMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9, roughness: 0.2 });
    
    // Heavy circular desk base
    const lampBaseGeo = new THREE.CylinderGeometry(0.13, 0.14, 0.035, 20);
    const lampBase = new THREE.Mesh(lampBaseGeo, lampStandMat);
    lampBase.position.set(-1.18, 1.228, -0.12);
    lampBase.castShadow = true;
    lampBase.name = 'DeskLamp';
    scene.add(lampBase);

    // Lower hinge
    const hingeGeo = new THREE.SphereGeometry(0.04, 16, 16);
    const lowerHinge = new THREE.Mesh(hingeGeo, lampStandMat);
    lowerHinge.position.set(-1.18, 1.27, -0.12);
    scene.add(lowerHinge);

    // Lower arm angled back and up
    const lowerArmGeo = new THREE.CylinderGeometry(0.016, 0.016, 0.65, 12);
    const lowerArm = new THREE.Mesh(lowerArmGeo, lampStandMat);
    lowerArm.rotation.z = -Math.PI / 14;
    lowerArm.rotation.x = -Math.PI / 18;
    lowerArm.position.set(-1.22, 1.58, -0.18);
    lowerArm.castShadow = true;
    scene.add(lowerArm);

    // Elbow hinge
    const elbowHinge = new THREE.Mesh(hingeGeo, lampStandMat);
    elbowHinge.position.set(-1.15, 1.9, -0.2);
    scene.add(elbowHinge);

    // Upper arm angled forward over desk
    const upperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.55, 12), lampStandMat);
    upperArm.rotation.z = Math.PI / 7;
    upperArm.rotation.x = Math.PI / 7;
    upperArm.position.set(-1.05, 2.06, -0.02);
    upperArm.castShadow = true;
    scene.add(upperArm);

    // Conical shade pointing directly down at desk
    const lampShadeGeo = new THREE.ConeGeometry(0.15, 0.22, 20);
    const lampShadeMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, roughness: 0.2 });
    const lampShade = new THREE.Mesh(lampShadeGeo, lampShadeMat);
    lampShade.rotation.x = Math.PI; // Point down
    lampShade.position.set(-0.98, 2.15, 0.12);
    lampShade.name = 'DeskLamp';
    lampShade.castShadow = true;
    scene.add(lampShade);

    // Bulb
    const bulbGeo = new THREE.SphereGeometry(0.045, 16, 16);
    const bulbMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    const bulb = new THREE.Mesh(bulbGeo, bulbMat);
    bulb.position.set(-0.98, 2.06, 0.12);
    bulb.name = 'DeskLamp';
    lampBulbRef.current = bulb;
    scene.add(bulb);

    // 13. Aesthetic Modern Designer Office Chair (ANGLED at 25° so it doesn't block the desk!)
    const chairGroup = new THREE.Group();
    // Rotate chair 25 degrees toward right to reveal desk, rug, and keyboard!
    chairGroup.rotation.y = -Math.PI / 7;
    chairGroup.position.set(0.15, 0, 1.25);

    // 5-Star Caster Chrome Base
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.95, roughness: 0.15 });
    for (let c = 0; c < 5; c++) {
      const armAngle = (c * Math.PI * 2) / 5;
      const sArmGeo = new THREE.BoxGeometry(0.04, 0.035, 0.38);
      const sArm = new THREE.Mesh(sArmGeo, chromeMat);
      sArm.rotation.y = armAngle;
      sArm.position.set(Math.sin(armAngle) * 0.18, 0.07, Math.cos(armAngle) * 0.18);
      chairGroup.add(sArm);

      const wheel = new THREE.Mesh(new THREE.SphereGeometry(0.03, 10, 10), steelLegMat);
      wheel.position.set(Math.sin(armAngle) * 0.35, 0.03, Math.cos(armAngle) * 0.35);
      chairGroup.add(wheel);
    }

    // Chrome Lift Piston
    const piston = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.48, 16), chromeMat);
    piston.position.y = 0.32;
    chairGroup.add(piston);

    // Sculpted Ergonomic Seat Cushion (Dark Charcoal with Teal Accent Stitch)
    const seatMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.6 });
    const seatGeo = new THREE.BoxGeometry(0.62, 0.08, 0.58);
    const seat = new THREE.Mesh(seatGeo, seatMat);
    seat.position.set(0, 0.58, 0);
    seat.castShadow = true;
    chairGroup.add(seat);

    // Curved Breathable Mesh Backrest with Ergonomic Lumbar Support
    const meshBackMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5, metalness: 0.2 });
    const chairBack = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.64, 0.05), meshBackMat);
    chairBack.rotation.x = -Math.PI / 18;
    chairBack.position.set(0, 0.96, 0.24);
    chairBack.castShadow = true;
    chairGroup.add(chairBack);

    // Lumbar spine spine curve
    const spineGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.5, 10);
    const spine = new THREE.Mesh(spineGeo, chromeMat);
    spine.rotation.x = -Math.PI / 18;
    spine.position.set(0, 0.88, 0.28);
    chairGroup.add(spine);

    // Headrest
    const headrest = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.14, 0.05), seatMat);
    headrest.position.set(0, 1.36, 0.29);
    chairGroup.add(headrest);

    // Ergonomic 3D Armrests
    [-0.31, 0.31].forEach(ax => {
      const aPost = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.26, 10), chromeMat);
      aPost.position.set(ax, 0.72, 0.02);
      chairGroup.add(aPost);

      const aPad = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.03, 0.24), seatMat);
      aPad.position.set(ax, 0.86, 0.04);
      chairGroup.add(aPad);
    });

    scene.add(chairGroup);

    // 14. Mechanical Keyboard (Custom Keycaps & RGB Underglow)
    const kbGeo = new THREE.BoxGeometry(0.86, 0.035, 0.28);
    const kbMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.35, metalness: 0.4 });
    const keyboard = new THREE.Mesh(kbGeo, kbMat);
    keyboard.position.set(-0.15, 1.23, 0.14);
    keyboard.castShadow = true;
    scene.add(keyboard);

    // RGB glow under keyboard
    const kbGlowMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
    const kbGlow = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.008, 0.3), kbGlowMat);
    kbGlow.position.set(-0.15, 1.218, 0.14);
    scene.add(kbGlow);

    // Ergonomic Wireless Mouse & Charging Dock
    const mouseGeo = new THREE.BoxGeometry(0.11, 0.038, 0.17);
    const mouseMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.6, roughness: 0.2 });
    const mouse = new THREE.Mesh(mouseGeo, mouseMat);
    mouse.position.set(0.65, 1.23, 0.14);
    mouse.castShadow = true;
    scene.add(mouse);

    // 15. Ceramic Coffee Mug with Coffee Surface & Handle
    const mugGeo = new THREE.CylinderGeometry(0.065, 0.06, 0.15, 20);
    const mugMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.2 });
    const mug = new THREE.Mesh(mugGeo, mugMat);
    mug.position.set(-0.85, 1.28, 0.2);
    mug.name = 'CoffeeMug';
    mug.castShadow = true;
    scene.add(mug);

    const mugHandle = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.012, 10, 16, Math.PI), mugMat);
    mugHandle.rotation.z = Math.PI / 2;
    mugHandle.position.set(-0.92, 1.28, 0.2);
    scene.add(mugHandle);

    const coffeeSurface = new THREE.Mesh(new THREE.CylinderGeometry(0.058, 0.058, 0.01, 16), new THREE.MeshStandardMaterial({ color: 0x2a180e }));
    coffeeSurface.position.set(-0.85, 1.34, 0.2);
    scene.add(coffeeSurface);

    // 16. Potted Ceramic Succulent on Desk (Right of screen)
    const potMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2 });
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.065, 0.13, 16), potMat);
    pot.position.set(0.95, 1.27, -0.15);
    pot.castShadow = true;
    scene.add(pot);

    const soil = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.015, 16), new THREE.MeshStandardMaterial({ color: 0x1c120c }));
    soil.position.set(0.95, 1.33, -0.15);
    scene.add(soil);

    // Beautiful rounded succulent rosettes
    const succulentMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.35 });
    for (let r = 0; r < 10; r++) {
      const ang = (r * Math.PI * 2) / 10;
      const leafGeo = new THREE.ConeGeometry(0.032, 0.11, 8);
      const leaf = new THREE.Mesh(leafGeo, succulentMat);
      leaf.rotation.z = Math.sin(ang) * 0.45;
      leaf.rotation.x = Math.cos(ang) * 0.45;
      leaf.position.set(0.95 + Math.sin(ang) * 0.04, 1.38, -0.15 + Math.cos(ang) * 0.04);
      scene.add(leaf);
    }

    // 17. High-End Custom Glass PC Tower (Right Side)
    const pcCaseGeo = new THREE.BoxGeometry(0.42, 0.76, 0.7);
    const pcCaseMat = new THREE.MeshStandardMaterial({ color: 0x090d16, metalness: 0.9, roughness: 0.2 });
    const pcCase = new THREE.Mesh(pcCaseGeo, pcCaseMat);
    pcCase.position.set(1.48, 1.58, -0.12);
    pcCase.castShadow = true;
    scene.add(pcCase);

    // Tempered Glass Side Window
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x1e293b,
      transparent: true,
      opacity: 0.5,
      roughness: 0.1,
      metalness: 0.8,
    });
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(0.38, 0.7), glassMat);
    glass.rotation.y = -Math.PI / 2;
    glass.position.set(1.265, 1.58, -0.12);
    scene.add(glass);

    // Internal Glowing Components (RGB RAM strips + GPU plate)
    const ramMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
    const ram = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.12, 0.14), ramMat);
    ram.position.set(1.45, 1.72, -0.12);
    scene.add(ram);

    const gpuMat = new THREE.MeshBasicMaterial({ color: 0x8b5cf6 });
    const gpu = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.06, 0.36), gpuMat);
    gpu.position.set(1.44, 1.52, -0.12);
    scene.add(gpu);

    // RGB Fan Rings
    const fans: THREE.Mesh[] = [];
    const fanColors = [0x06b6d4, 0x8b5cf6, 0x10b981];
    [1.74, 1.54, 1.34].forEach((fy, i) => {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.015, 12, 24), new THREE.MeshBasicMaterial({ color: fanColors[i] }));
      ring.position.set(1.47, fy, 0.23);
      scene.add(ring);
      fans.push(ring);
    });

    // 18. Atmospheric Glowing Floating Dust / Ambient Particles (Cinematic cozy look!)
    const particleCount = 65;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let p = 0; p < particleCount * 3; p += 3) {
      particlePos[p] = (Math.random() - 0.5) * 6;
      particlePos[p + 1] = 1.0 + Math.random() * 3.0;
      particlePos[p + 2] = (Math.random() - 0.5) * 4;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.04,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 19. Animation Loop
    const startTime = performance.now();
    let frameId: number;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const elapsedTime = (performance.now() - startTime) * 0.001;

      // Rotate PC cooling fans
      fans.forEach(fan => {
        fan.rotation.z += 0.07;
      });

      // Gently drift ambient particles
      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 1; i < particleCount * 3; i += 3) {
        positions[i] += Math.sin(elapsedTime + i) * 0.002;
      }
      particleGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };
    animate();

    // 20. Mouse Interaction / Smooth Parallax
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

      // Smooth camera parallax pan around 3/4 anchor
      if (!isZoomed && cameraRef.current) {
        gsap.to(cameraRef.current.position, {
          x: ROOM_CAMERA_POS.x + mousePos.x * 0.28,
          y: ROOM_CAMERA_POS.y + mousePos.y * 0.18,
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

  // GSAP Camera Zoom Transition (Seamless zoom into monitor)
  useEffect(() => {
    const camera = cameraRef.current;
    if (!camera) return;

    if (isZoomed) {
      gsap.to(camera.position, {
        x: MONITOR_CAMERA_POS.x,
        y: MONITOR_CAMERA_POS.y,
        z: MONITOR_CAMERA_POS.z,
        duration: 1.3,
        ease: 'power3.inOut',
        onUpdate: () => camera.lookAt(MONITOR_CAMERA_LOOK.x, MONITOR_CAMERA_LOOK.y, MONITOR_CAMERA_LOOK.z),
      });
    } else {
      gsap.to(camera.position, {
        x: ROOM_CAMERA_POS.x,
        y: ROOM_CAMERA_POS.y,
        z: ROOM_CAMERA_POS.z,
        duration: 1.3,
        ease: 'power3.inOut',
        onUpdate: () => camera.lookAt(ROOM_CAMERA_LOOK.x, ROOM_CAMERA_LOOK.y, ROOM_CAMERA_LOOK.z),
      });
    }
  }, [isZoomed]);

  const toggleLight = () => {
    if (!lampLightRef.current || !lampBulbRef.current) return;
    if (lightMode === 'cyber') {
      lampLightRef.current.color.setHex(0xf59e0b);
      lampLightRef.current.intensity = 4.5;
      (lampBulbRef.current.material as THREE.MeshBasicMaterial).color.setHex(0xf59e0b);
      if (ambientLightRef.current) ambientLightRef.current.color.setHex(0xfff7ed);
      setLightMode('warm');
    } else {
      lampLightRef.current.color.setHex(0x06b6d4);
      lampLightRef.current.intensity = 4.0;
      (lampBulbRef.current.material as THREE.MeshBasicMaterial).color.setHex(0x06b6d4);
      if (ambientLightRef.current) ambientLightRef.current.color.setHex(0xdbeafe);
      setLightMode('cyber');
    }
  };

  return (
    <div className="relative w-full h-[620px] md:h-[720px] rounded-3xl overflow-hidden border border-[rgba(255,255,255,0.12)] shadow-2xl bg-[#0a0f1d]">
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
