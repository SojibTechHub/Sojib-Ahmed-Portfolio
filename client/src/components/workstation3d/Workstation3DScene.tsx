import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { Sun, Moon, Sparkles, ZoomIn } from 'lucide-react';

interface WorkstationSceneProps {
  isZoomed: boolean;
  onMonitorClick: () => void;
  onToggleZoom?: () => void;
  onToggleLighting?: (mode: 'cyber' | 'warm') => void;
}

export default function Workstation3DScene({ isZoomed, onMonitorClick, onToggleZoom }: WorkstationSceneProps) {
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

  // Responsive camera framing calculator for mobile portrait vs desktop widescreen
  const getCameraTarget = (zoomed: boolean, w: number, h: number) => {
    const isMobile = w < 768;
    const aspect = w / h;

    if (zoomed) {
      return {
        pos: { x: 0, y: 1.72, z: isMobile ? 1.45 : 1.25 },
        look: { x: 0, y: 1.72, z: -0.28 },
      };
    }

    if (isMobile) {
      // Center camera directly at eye-level with the monitor, pull back dynamically based on aspect
      const zDist = aspect < 0.75 ? 3.9 : 3.4;
      return {
        pos: { x: 0, y: 1.70, z: zDist },
        look: { x: 0, y: 1.68, z: -0.28 },
      };
    }

    return {
      pos: { x: 0.12, y: 1.95, z: 3.55 },
      look: { x: 0, y: 1.55, z: -0.20 },
    };
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0a0f1d);
    scene.fog = new THREE.Fog(0x0a0f1d, 15, 30);

    // 2. Camera Setup (Dynamic FOV & Eye-level centering on Mobile)
    const width = container.clientWidth;
    const height = container.clientHeight;
    const aspect = width / height;
    const initialFov = aspect < 1.0 ? Math.min(62, Math.max(45, (45 / aspect) * 0.78)) : 45;
    const camera = new THREE.PerspectiveCamera(initialFov, aspect, 0.1, 80);
    cameraRef.current = camera;
    
    const initialTarget = getCameraTarget(isZoomed, width, height);
    camera.position.set(initialTarget.pos.x, initialTarget.pos.y, initialTarget.pos.z);
    camera.lookAt(initialTarget.look.x, initialTarget.look.y, initialTarget.look.z);

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    container.appendChild(renderer.domElement);

    // 4. Lighting System — High-Definition Cozy Studio & Cinematic Cyber Lighting
    const ambientLight = new THREE.AmbientLight(0xfff7ed, 2.2);
    ambientLightRef.current = ambientLight;
    scene.add(ambientLight);

    // Main warm overhead studio key light
    const keyLight = new THREE.DirectionalLight(0xffedd5, 3.2);
    keyLight.position.set(3.5, 6.5, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.bias = -0.0004;
    keyLightRef.current = keyLight;
    scene.add(keyLight);

    // Window daylight / moonlight (left side)
    const windowLight = new THREE.DirectionalLight(0x93c5fd, 1.8);
    windowLight.position.set(-6, 5, 1);
    scene.add(windowLight);

    // Back accent rim light (purple/cyan)
    const rimLight = new THREE.PointLight(0x8b5cf6, 2.8, 10);
    rimLight.position.set(2.8, 3.2, -1.2);
    scene.add(rimLight);

    // Atmospheric Desk Backlight Wall-Wash LED Strip (Cyan Ambient Glow)
    const deskBacklight = new THREE.PointLight(0x06b6d4, 3.8, 6.0);
    deskBacklight.position.set(0, 1.45, -0.6);
    scene.add(deskBacklight);

    // Shelf Underglow Accent (Soft Violet)
    const shelfUnderglow = new THREE.PointLight(0x8b5cf6, 2.6, 5.0);
    shelfUnderglow.position.set(0, 3.25, -2.6);
    scene.add(shelfUnderglow);

    // Internal Custom PC Tower Illumination
    const pcInternalLight = new THREE.PointLight(0x06b6d4, 3.0, 3.0);
    pcInternalLight.position.set(1.45, 1.58, -0.1);
    scene.add(pcInternalLight);

    // Desk Lamp warm pool of light
    const deskLampLight = new THREE.PointLight(0xf59e0b, 5.0, 7.0);
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

    // Back Wall
    const backWallGeo = new THREE.PlaneGeometry(16, 9);
    const backWallMat = new THREE.MeshStandardMaterial({
      color: 0x0f1422,
      roughness: 0.65,
    });
    const backWall = new THREE.Mesh(backWallGeo, backWallMat);
    backWall.position.set(0, 4.5, -3.1);
    backWall.receiveShadow = true;
    scene.add(backWall);

    // Left Wall
    const leftWallGeo = new THREE.PlaneGeometry(16, 9);
    const leftWallMat = new THREE.MeshStandardMaterial({ color: 0x0a0e1a, roughness: 0.7 });
    const leftWall = new THREE.Mesh(leftWallGeo, leftWallMat);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-6, 4.5, 0);
    scene.add(leftWall);

    // 6. Signature Modern Fluted Wood Acoustic Slat Wall Panel
    const slatMat = new THREE.MeshStandardMaterial({
      color: 0x6e4726,
      roughness: 0.5,
    });
    const slatGroup = new THREE.Group();
    for (let s = -22; s <= 22; s++) {
      const slatGeo = new THREE.BoxGeometry(0.045, 3.4, 0.035);
      const slat = new THREE.Mesh(slatGeo, slatMat);
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

    // Trailing Potted Plant on Shelf
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

    // Canvas inside frame (Ultra High-Res 1024x680 with 4 Verified Credentials)
    const certCanvas = document.createElement('canvas');
    certCanvas.width = 1024;
    certCanvas.height = 680;
    const cCtx = certCanvas.getContext('2d')!;
    cCtx.fillStyle = '#060B17';
    cCtx.fillRect(0, 0, 1024, 680);
    
    // Glowing gradient frame border
    const cGrad = cCtx.createLinearGradient(0, 0, 1024, 680);
    cGrad.addColorStop(0, '#7C3AED');
    cGrad.addColorStop(0.5, '#06B6D4');
    cGrad.addColorStop(1, '#10B981');
    cCtx.strokeStyle = cGrad;
    cCtx.lineWidth = 10;
    cCtx.strokeRect(18, 18, 988, 644);

    cCtx.fillStyle = '#FFFFFF';
    cCtx.font = 'bold 54px sans-serif';
    cCtx.fillText('SOJIB AHMED', 56, 100);

    cCtx.fillStyle = '#06B6D4';
    cCtx.font = 'bold 32px sans-serif';
    cCtx.fillText('FULL STACK DEVELOPER', 56, 155);

    cCtx.fillStyle = 'rgba(6, 182, 212, 0.15)';
    cCtx.fillRect(56, 185, 912, 48);
    cCtx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
    cCtx.lineWidth = 2;
    cCtx.strokeRect(56, 185, 912, 48);
    cCtx.fillStyle = '#22D3EE';
    cCtx.font = 'bold 22px monospace';
    cCtx.fillText('★ 4 OFFICIALLY VERIFIED CREDENTIALS & INDUSTRY RECORDS ★', 76, 218);

    cCtx.fillStyle = '#E2E8F0';
    cCtx.font = '22px monospace';
    cCtx.fillText('1. FlyRank — Full Stack Web Development Appointment', 56, 285);
    cCtx.fillText('2. Programming Hero — Official Letter of Recommendation', 56, 335);
    cCtx.fillText('3. Programming Hero — Complete Web Development Course', 56, 385);
    cCtx.fillText('4. Datheon AI Systems — Full Stack Engineering Internship', 56, 435);

    cCtx.fillStyle = '#94A3B8';
    cCtx.font = '20px monospace';
    cCtx.fillText('// Tech: React 19 · Next.js 16 · Node.js · Express · MongoDB · TypeScript', 56, 505);

    cCtx.fillStyle = '#10B981';
    cCtx.font = 'bold 26px sans-serif';
    cCtx.fillText('● SYSTEM STATUS: PRODUCTION READY & AVAILABLE FOR HIRE', 56, 580);

    const certTex = new THREE.CanvasTexture(certCanvas);
    certTex.minFilter = THREE.LinearFilter;
    certTex.magFilter = THREE.LinearFilter;
    const certMat = new THREE.MeshStandardMaterial({ map: certTex, roughness: 0.15 });
    const certPlane = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.0), certMat);
    certPlane.position.set(2.45, 2.45, -3.02);
    scene.add(certPlane);

    // Frame backlight glow
    const frameGlow = new THREE.PointLight(0x06b6d4, 1.2, 3);
    frameGlow.position.set(2.45, 2.45, -2.8);
    scene.add(frameGlow);

    // 9. The Developer Desk (Solid Charcoal Walnut)
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

    // Heavy-duty Dual-Motor Standing Desk Steel Frame
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

    // Giant Microfiber Desk Mat
    const padGeo = new THREE.BoxGeometry(2.7, 0.015, 0.9);
    const padMat = new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.7 });
    const deskPad = new THREE.Mesh(padGeo, padMat);
    deskPad.position.set(0, 1.218, 0.06);
    deskPad.receiveShadow = true;
    scene.add(deskPad);

    // 10. Studio Monitor Audio Speakers (Left & Right)
    const speakerMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3, metalness: 0.4 });
    const coneMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.2 });
    const tweeterMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.2 });

    [-1.38, 1.16].forEach((sx, idx) => {
      const spkGroup = new THREE.Group();
      const spkGeo = new THREE.BoxGeometry(0.24, 0.42, 0.26);
      const spk = new THREE.Mesh(spkGeo, speakerMat);
      spk.castShadow = true;
      spkGroup.add(spk);

      const coneGeo = new THREE.CylinderGeometry(0.07, 0.04, 0.02, 16);
      const cone = new THREE.Mesh(coneGeo, coneMat);
      cone.rotation.x = Math.PI / 2;
      cone.position.set(0, -0.06, 0.135);
      spkGroup.add(cone);

      const tweetGeo = new THREE.SphereGeometry(0.028, 14, 14);
      const tweet = new THREE.Mesh(tweetGeo, tweeterMat);
      tweet.position.set(0, 0.1, 0.135);
      spkGroup.add(tweet);

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

    // Monitor Active Canvas Screen (2048x840 Ultra-High Definition with Maximum Clarity)
    const screenGeo = new THREE.PlaneGeometry(2.22, 0.90);
    const screenCanvas = document.createElement('canvas');
    screenCanvas.width = 2048;
    screenCanvas.height = 840;
    const sCtx = screenCanvas.getContext('2d')!;

    const drawScreen = () => {
      // Deep cyber dark background
      sCtx.fillStyle = '#030712';
      sCtx.fillRect(0, 0, 2048, 840);

      // Top glowing neon bar
      const grad = sCtx.createLinearGradient(0, 0, 2048, 0);
      grad.addColorStop(0, '#7C3AED');
      grad.addColorStop(0.5, '#06B6D4');
      grad.addColorStop(1, '#10B981');
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 2048, 14);

      // Top OS Navigation / Window Controls Bar
      sCtx.fillStyle = '#080E20';
      sCtx.fillRect(0, 14, 2048, 64);
      sCtx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      sCtx.lineWidth = 1;
      sCtx.beginPath();
      sCtx.moveTo(0, 78);
      sCtx.lineTo(2048, 78);
      sCtx.stroke();

      // Window dots (Traffic lights)
      const dotColors = ['#EF4444', '#F59E0B', '#10B981'];
      dotColors.forEach((color, i) => {
        sCtx.beginPath();
        sCtx.arc(50 + i * 36, 46, 12, 0, Math.PI * 2);
        sCtx.fillStyle = color;
        sCtx.fill();
      });

      // Window title
      sCtx.fillStyle = '#94A3B8';
      sCtx.font = 'bold 24px monospace';
      sCtx.fillText('sojib@workstation:~ (production-main)', 180, 54);

      // Status Badge (Top Right)
      sCtx.fillStyle = 'rgba(16, 185, 129, 0.2)';
      sCtx.fillRect(1680, 24, 310, 44);
      sCtx.strokeStyle = 'rgba(16, 185, 129, 0.6)';
      sCtx.lineWidth = 2;
      sCtx.strokeRect(1680, 24, 310, 44);
      sCtx.fillStyle = '#10B981';
      sCtx.font = 'bold 20px sans-serif';
      sCtx.fillText('● AVAILABLE FOR HIRE', 1715, 52);

      // Main Branding Title (Huge, High Contrast, Shadowed for crystal clear legibility)
      sCtx.shadowColor = 'rgba(6, 182, 212, 0.5)';
      sCtx.shadowBlur = 12;
      sCtx.fillStyle = '#FFFFFF';
      sCtx.font = 'bold 68px sans-serif';
      sCtx.fillText('SOJIB AHMED', 80, 168);
      sCtx.shadowBlur = 0;

      sCtx.fillStyle = '#38BDF8';
      sCtx.font = 'bold 32px sans-serif';
      sCtx.fillText('FULL STACK DEVELOPER · PRODUCTION SYSTEMS', 80, 218);

      // Central Terminal Window
      sCtx.fillStyle = '#080E1E';
      sCtx.strokeStyle = 'rgba(6, 182, 212, 0.7)';
      sCtx.lineWidth = 3;
      sCtx.beginPath();
      sCtx.roundRect(80, 250, 1888, 410, 20);
      sCtx.fill();
      sCtx.stroke();

      // Terminal Header inside box
      sCtx.fillStyle = '#0C152E';
      sCtx.beginPath();
      sCtx.roundRect(80, 250, 1888, 56, [20, 20, 0, 0]);
      sCtx.fill();

      sCtx.fillStyle = '#38BDF8';
      sCtx.font = 'bold 24px monospace';
      sCtx.fillText('$ git status --production-verified', 120, 287);

      // Terminal Body Content (Crisp, High Contrast, Bold Fonts)
      sCtx.fillStyle = '#10B981';
      sCtx.font = 'bold 26px monospace';
      sCtx.fillText('✔ 10 Flagship Production Repositories Live:', 120, 350);

      sCtx.fillStyle = '#FFFFFF';
      sCtx.font = 'bold 24px monospace';
      sCtx.fillText('● ShopX BD Enterprise   ● FoodFlow Logistics   ● SkillForge AI   ● StartupForge ATS', 150, 395);
      sCtx.fillText('● TypeMarket Store      ● InvestProp AI        ● Issue Tracker   ● Pet Adoption API', 150, 440);

      sCtx.fillStyle = '#C084FC';
      sCtx.font = 'bold 26px monospace';
      sCtx.fillText('✔ 4 Verified Credentials & Industry Records:', 120, 505);

      sCtx.fillStyle = '#FFFFFF';
      sCtx.font = 'bold 24px monospace';
      sCtx.fillText('★ FlyRank Appointment   ★ PH Recommendation   ★ PH Course Batch 13   ★ Datheon AI', 150, 550);

      sCtx.fillStyle = '#38BDF8';
      sCtx.font = 'bold 24px monospace';
      sCtx.fillText('⚡ Tech Stack: React 19 • Next.js 16 • TypeScript • Node.js • Express • MongoDB Atlas', 120, 615);

      // Bottom Clickable Interactive CTA Bar (Vibrant High-Contrast Button)
      const ctaGrad = sCtx.createLinearGradient(80, 0, 1968, 0);
      ctaGrad.addColorStop(0, '#7C3AED');
      ctaGrad.addColorStop(0.5, '#06B6D4');
      ctaGrad.addColorStop(1, '#10B981');
      sCtx.fillStyle = ctaGrad;
      sCtx.beginPath();
      sCtx.roundRect(80, 680, 1888, 115, 18);
      sCtx.fill();

      sCtx.fillStyle = '#FFFFFF';
      sCtx.font = 'bold 40px sans-serif';
      sCtx.textAlign = 'center';
      sCtx.fillText('👉 CLICK OR TAP THIS MONITOR TO OPEN SOJIB OS (VIRTUAL DESKTOP) 🚀', 1024, 752);
      sCtx.textAlign = 'left';
    };
    drawScreen();

    const screenTexture = new THREE.CanvasTexture(screenCanvas);
    screenTexture.generateMipmaps = true;
    screenTexture.minFilter = THREE.LinearMipmapLinearFilter;
    screenTexture.magFilter = THREE.LinearFilter;
    if (renderer.capabilities) {
      screenTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    }
    screenTexture.needsUpdate = true;

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

    // 12. Architectural Articulated Desk Lamp (Left Side)
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
    upperArm.rotation.z = Math.PI / 8;
    upperArm.rotation.x = Math.PI / 12;
    upperArm.position.set(-1.08, 2.12, -0.05);
    upperArm.castShadow = true;
    scene.add(upperArm);

    // Conical Lampshade
    const lampShadeGeo = new THREE.ConeGeometry(0.16, 0.28, 24, 1, true);
    const lampShadeMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.3,
      metalness: 0.8,
      side: THREE.DoubleSide,
    });
    const lampShade = new THREE.Mesh(lampShadeGeo, lampShadeMat);
    lampShade.rotation.z = -Math.PI / 3.5;
    lampShade.rotation.x = -Math.PI / 10;
    lampShade.position.set(-0.95, 2.18, 0.1);
    lampShade.castShadow = true;
    lampShade.name = 'DeskLamp';
    scene.add(lampShade);

    // Glowing bulb inside shade
    const bulbGeo = new THREE.SphereGeometry(0.055, 16, 16);
    const bulbMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    const bulb = new THREE.Mesh(bulbGeo, bulbMat);
    bulb.position.set(-0.97, 2.15, 0.1);
    lampBulbRef.current = bulb;
    scene.add(bulb);

    // 13. Aesthetic Modern Designer Office Chair (Positioned neatly on the right so it never blocks the desk or monitor!)
    const chairGroup = new THREE.Group();
    chairGroup.rotation.y = -Math.PI / 4.5;
    chairGroup.position.set(0.95, 0, 1.15);

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

    // Sculpted Ergonomic Seat Cushion
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

    // Lumbar spine curve
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

    // 14. Mechanical Keyboard
    const kbGeo = new THREE.BoxGeometry(0.86, 0.035, 0.28);
    const kbMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.35, metalness: 0.4 });
    const keyboard = new THREE.Mesh(kbGeo, kbMat);
    keyboard.position.set(-0.15, 1.23, 0.14);
    keyboard.castShadow = true;
    scene.add(keyboard);

    // RGB glow under keyboard
    const kbGlow = new THREE.PointLight(0x06b6d4, 1.2, 0.8);
    kbGlow.position.set(-0.15, 1.23, 0.14);
    scene.add(kbGlow);

    // 15. Wireless Ergonomic Mouse
    const mouseGeo = new THREE.BoxGeometry(0.11, 0.038, 0.18);
    const mouseMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3 });
    const mouse = new THREE.Mesh(mouseGeo, mouseMat);
    mouse.position.set(0.62, 1.23, 0.14);
    mouse.castShadow = true;
    scene.add(mouse);

    // 16. Developer Ceramic Coffee Mug (Teal)
    const mugGeo = new THREE.CylinderGeometry(0.075, 0.065, 0.16, 20);
    const mugMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.2 });
    const mug = new THREE.Mesh(mugGeo, mugMat);
    mug.position.set(-0.68, 1.28, 0.24);
    mug.castShadow = true;
    mug.name = 'CoffeeMug';
    scene.add(mug);

    // Coffee surface inside mug
    const coffeeGeo = new THREE.CircleGeometry(0.068, 16);
    const coffeeMat = new THREE.MeshBasicMaterial({ color: 0x3d2314 });
    const coffee = new THREE.Mesh(coffeeGeo, coffeeMat);
    coffee.rotation.x = -Math.PI / 2;
    coffee.position.set(-0.68, 1.35, 0.24);
    scene.add(coffee);

    // Mug handle
    const handleGeo = new THREE.TorusGeometry(0.045, 0.015, 8, 16, Math.PI);
    const handle = new THREE.Mesh(handleGeo, mugMat);
    handle.rotation.z = -Math.PI / 2;
    handle.position.set(-0.76, 1.28, 0.24);
    scene.add(handle);

    // Potted Mini Desk Succulent
    const potGeo = new THREE.CylinderGeometry(0.09, 0.07, 0.14, 16);
    const potMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
    const pot = new THREE.Mesh(potGeo, potMat);
    pot.position.set(0.95, 1.28, -0.15);
    pot.castShadow = true;
    scene.add(pot);

    const plantMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.4 });
    for (let l = 0; l < 7; l++) {
      const leafGeo = new THREE.ConeGeometry(0.04, 0.14, 5);
      const leaf = new THREE.Mesh(leafGeo, plantMat);
      const ang = (l * Math.PI * 2) / 7;
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

    // 18. Atmospheric Glowing Floating Dust / Ambient Particles
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

      fans.forEach(fan => {
        fan.rotation.z += 0.07;
      });

      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 1; i < particleCount * 3; i += 3) {
        positions[i] += Math.sin(elapsedTime + i) * 0.002;
      }
      particleGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };
    animate();

    // 20. Mouse & Touch Interaction
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
        const target = getCameraTarget(false, container.clientWidth, container.clientHeight);
        gsap.to(cameraRef.current.position, {
          x: target.pos.x + mousePos.x * 0.22,
          y: target.pos.y + mousePos.y * 0.14,
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

    // Touch event listener for smooth mobile phone interaction
    const handleTouchEnd = (e: TouchEvent) => {
      if (!e.changedTouches || e.changedTouches.length === 0) return;
      const touch = e.changedTouches[0];
      const rect = container.getBoundingClientRect();
      mousePos.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
      mousePos.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mousePos, camera);
      const intersects = raycaster.intersectObjects([screenMesh, lampShade, lampBase, mug]);

      if (intersects.length > 0) {
        const clickedName = intersects[0].object.name;
        if (clickedName === 'InteractiveMonitor') {
          onMonitorClick();
        } else if (clickedName === 'DeskLamp') {
          toggleLight();
        }
      } else {
        // If tapped anywhere in central monitor area on mobile, trigger monitor click
        if (Math.abs(mousePos.x) < 0.75 && Math.abs(mousePos.y) < 0.75) {
          onMonitorClick();
        }
      }
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('click', handleClick);
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Resize Handler with Dynamic FOV for Mobile & Tablet
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;

      if (camera.aspect < 1.0) {
        camera.fov = Math.min(62, Math.max(45, (45 / camera.aspect) * 0.78));
      } else {
        camera.fov = 45;
      }

      const target = getCameraTarget(isZoomed, w, h);
      camera.position.set(target.pos.x, target.pos.y, target.pos.z);
      camera.lookAt(target.look.x, target.look.y, target.look.z);
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('click', handleClick);
      container.removeEventListener('touchend', handleTouchEnd);
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  // GSAP Camera Zoom Transition (Seamless zoom into monitor)
  useEffect(() => {
    const camera = cameraRef.current;
    const container = mountRef.current;
    if (!camera || !container) return;

    const w = container.clientWidth;
    const h = container.clientHeight;
    const target = getCameraTarget(isZoomed, w, h);

    gsap.to(camera.position, {
      x: target.pos.x,
      y: target.pos.y,
      z: target.pos.z,
      duration: 1.3,
      ease: 'power3.inOut',
      onUpdate: () => camera.lookAt(target.look.x, target.look.y, target.look.z),
    });
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
    <div className="relative w-full h-[460px] sm:h-[540px] md:h-[700px] lg:h-[740px] rounded-2xl sm:rounded-3xl overflow-hidden border border-[rgba(255,255,255,0.12)] shadow-2xl bg-[#0a0f1d]">
      {/* Three.js Canvas Container */}
      <div ref={mountRef} className="w-full h-full" />

      {/* Interactive Tooltip Overlay */}
      {hoveredObject && !isZoomed && (
        <div className="absolute top-6 sm:top-8 left-1/2 -translate-x-1/2 pointer-events-none z-20">
          <div className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#030712]/95 backdrop-blur-md border border-[#06B6D4] text-[11px] sm:text-xs font-bold text-[#06B6D4] flex items-center gap-1.5 shadow-2xl animate-bounce">
            <Sparkles size={13} />
            {hoveredObject === 'InteractiveMonitor' && 'Click Monitor to Zoom in & Launch Sojib OS 🚀'}
            {hoveredObject === 'DeskLamp' && 'Click Desk Lamp to Switch Warm/Cyber Lighting 💡'}
            {hoveredObject === 'CoffeeMug' && "Sojib's Coffee Mug ☕"}
          </div>
        </div>
      )}

      {/* Floating 3D Room Controls HUD (Bottom Left) */}
      <div className="absolute bottom-3 left-3 sm:bottom-6 sm:left-6 z-20 flex flex-wrap items-center gap-2">
        <button
          onClick={onToggleZoom ? onToggleZoom : onMonitorClick}
          className="px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-[11px] sm:text-xs font-bold text-white hover:opacity-95 shadow-xl flex items-center gap-1.5 cursor-pointer transition-transform hover:scale-105"
        >
          <ZoomIn size={13} />
          <span>{isZoomed ? 'Zoom Out Room' : 'Zoom into Screen'}</span>
        </button>

        <button
          onClick={toggleLight}
          className="px-2.5 py-1.5 sm:px-3.5 sm:py-2.5 rounded-xl bg-[#090D1A]/90 border border-white/10 text-[11px] sm:text-xs font-semibold text-gray-200 hover:text-white hover:border-[#06B6D4] flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
          title="Toggle Room Lighting"
        >
          {lightMode === 'warm' ? <Sun size={13} className="text-[#F59E0B]" /> : <Moon size={13} className="text-[#06B6D4]" />}
          <span>{lightMode === 'warm' ? 'Warm Mode 💡' : 'Cyber Neon ⚡'}</span>
        </button>
      </div>

      {/* Tip Badge (Top Right) */}
      {!isZoomed && (
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#090D1A]/90 border border-white/15 text-[11px] font-medium text-gray-300 backdrop-blur-md shadow-lg">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
          <span>Move mouse to pan · Click monitor to enter Virtual OS</span>
        </div>
      )}
    </div>
  );
}
