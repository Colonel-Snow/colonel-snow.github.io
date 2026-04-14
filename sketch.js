// ── config ────────────────────────────────────────────────────────
const POLLEN_COUNT   = 2000;
const ATTRACT_RADIUS = 240;
const FACE_SPREAD    = 110;   // half-size of face scatter zone
const ATTRACT_FORCE  = 2.8;
const STICK_FORCE    = 4.5;   // spring toward assigned face position
const FRICTION       = 0.82;
const CONFIDENCE     = 0.2;

// ── wipe config ───────────────────────────────────────────────────
const WIPE_RADIUS      = 50;
const WIPE_SPEED_MIN   = 4;
const WIPE_FLING_SCALE = 0.2;

// ── wind config ───────────────────────────────────────────────────
const WIND_COLS     = 28;
const WIND_ROWS     = 18;
const WIND_SCALE    = 0.0018;
const WIND_EVOLVE   = 0.00025;
const WIND_STRENGTH = 0.55;
const GUST_INTERVAL = 280;
const GUST_DURATION = 90;
const SHOW_WIND     = true;

const WIND_DRAG = { tree: 1.0, grass: 0.65, weed: 0.35 };

const HEAD_KEYPOINTS = [0, 1, 2, 3, 4];
const HAND_KEYPOINTS = [9, 10];

let currentScale = 1.0;
let vScale = 1, vX = 0, vY = 0; // Added for video proportion scaling

// ── zone definitions ──────────────────────────────────────────────
const ZONE_DEFS = [
  { type: 'tree',  label: 'Spring',  tint: [60, 160, 60,  18] },
  { type: 'grass', label: 'Summer',  tint: [200, 110, 30, 18] },
  { type: 'weed',  label: 'Fall',    tint: [50,  90, 200, 18] },
];

// ── pollen type definitions ───────────────────────────────────────
const POLLEN_TYPES = {
  tree: {
    baseCol: () => [random(210,240), random(220,245), random(80,140)],
    alpha:   () => random(170, 230),
    r:       () => random(3.5, 7.5),
    vy:      () => random(0.04, 0.22),
    vx:      () => random(-0.2, 0.2),
    draw(g, r, col, alpha, angle) {
      g.fill(col[0], col[1], col[2], alpha);
      g.beginShape();
      for (let i = 0; i < 16; i++) {
        const ang = (i / 16) * TWO_PI + angle;
        const rad = i % 2 === 0 ? r : r * 0.55;
        g.vertex(cos(ang) * rad, sin(ang) * rad);
      }
      g.endShape(CLOSE);
      g.fill(240, 255, 160, alpha * 0.9);
      g.ellipse(0, 0, r * 0.55, r * 0.55);
    }
  },
  grass: {
    baseCol: () => [random(180,220), random(210,240), random(100,160)],
    alpha:   () => random(140, 210),
    r:       () => random(2.5, 5.5),
    vy:      () => random(0.08, 0.38),
    vx:      () => random(-0.12, 0.12),
    draw(g, r, col, alpha, angle) {
      g.fill(col[0], col[1], col[2], alpha);
      g.ellipse(0, 0, r * 0.6, r * 1.85);
      g.stroke(col[0] - 30, col[1] - 20, col[2] + 40, alpha * 0.7);
      g.strokeWeight(0.8);
      g.line(0, -r * 0.8, 0, r * 0.8);
      g.noStroke();
      g.fill(col[0] + 20, col[1] + 10, col[2] + 60, alpha * 0.8);
      g.ellipse(0, -r * 0.85, r * 0.35, r * 0.35);
      g.ellipse(0,  r * 0.85, r * 0.35, r * 0.35);
    }
  },
  weed: {
    baseCol: () => [random(200,240), random(160,200), random(40,100)],
    alpha:   () => random(150, 220),
    r:       () => random(4, 8.5),
    vy:      () => random(0.18, 0.55),
    vx:      () => random(-0.08, 0.08),
    draw(g, r, col, alpha, angle) {
      g.fill(col[0], col[1], col[2], alpha);
      const lobes = 6;
      g.beginShape();
      for (let i = 0; i < lobes * 4; i++) {
        const ang = (i / (lobes * 4)) * TWO_PI + angle;
        const bump = 1 + 0.28 * sin(i * (lobes / 2));
        g.curveVertex(cos(ang) * r * bump, sin(ang) * r * bump);
      }
      g.endShape(CLOSE);
      g.fill(col[0] - 25, col[1] - 20, col[2] - 10, alpha * 0.6);
      g.ellipse(0, 0, r * 0.75, r * 0.75);
      g.fill(col[0] + 20, col[1] + 15, col[2] + 30, alpha * 0.9);
      g.ellipse(0, 0, r * 0.3, r * 0.3);
    }
  }
};

// ── Wind system ───────────────────────────────────────────────────
class WindField {
  constructor() {
    this.cellW = 0; this.cellH = 0;
    this.tOffset = random(1000);
    this.gustTimer = 0; this.gustActive = false;
    this.gustDirX = 1; this.gustDirY = 0; this.gustStrength = 0;
  }
  init(w, h) { this.cellW = w / WIND_COLS; this.cellH = h / WIND_ROWS; }
  sample(x, y) {
    const col = floor(x / this.cellW);
    const row = floor(y / this.cellH);
    const nx = col * WIND_SCALE + this.tOffset;
    const ny = row * WIND_SCALE + this.tOffset * 0.7;
    const nz = frameCount * WIND_EVOLVE;
    const angle = noise(nx, ny, nz) * TWO_PI * 2;
    let wx = cos(angle) * WIND_STRENGTH;
    let wy = sin(angle) * WIND_STRENGTH * 0.45;
    if (this.gustActive) { wx += this.gustDirX * this.gustStrength; wy += this.gustDirY * this.gustStrength; }
    return { wx, wy };
  }
  update() {
    this.tOffset += WIND_EVOLVE * 0.5;
    this.gustTimer++;
    if (!this.gustActive && this.gustTimer >= GUST_INTERVAL) {
      this.gustActive = true; this.gustTimer = 0;
      const gustAngle = random(-0.4, 0.4);
      const side = random() < 0.5 ? 1 : -1;
      this.gustDirX = cos(gustAngle) * side;
      this.gustDirY = sin(gustAngle);
      this.gustStrength = 0;
    }
    if (this.gustActive) {
      const half = GUST_DURATION / 2, t = this.gustTimer;
      this.gustStrength = t < half ? map(t, 0, half, 0, 2.2) : map(t, half, GUST_DURATION, 2.2, 0);
      if (this.gustTimer >= GUST_DURATION) { this.gustActive = false; this.gustTimer = 0; }
    }
  }
  drawOverlay() {
    noFill();
    for (let col = 0; col < WIND_COLS; col++) {
      for (let row = 0; row < WIND_ROWS; row++) {
        const cx = (col + 0.5) * this.cellW, cy = (row + 0.5) * this.cellH;
        const { wx, wy } = this.sample(cx, cy);
        const spd = sqrt(wx*wx + wy*wy);
        const a = map(spd, 0, 2.5, 5, 26), len = map(spd, 0, 2.5, 4, 13);
        stroke(200, 190, 140, a); strokeWeight(0.6);
        const ang = atan2(wy, wx);
        const ex = cx + cos(ang) * len, ey = cy + sin(ang) * len;
        line(cx, cy, ex, ey);
        line(ex, ey, ex + cos(ang + PI * 0.8) * 3, ey + sin(ang + PI * 0.8) * 3);
        line(ex, ey, ex + cos(ang - PI * 0.8) * 3, ey + sin(ang - PI * 0.8) * 3);
      }
    }
    noStroke();
  }
}

// ── globals ───────────────────────────────────────────────────────
let pollenGfx, bodyPose, video;
let poses = [];
let particles = [];
let W, H;
let typeCounts = { tree: 0, grass: 0, weed: 0 };
let wind;
let statusMsg = '📷 Starting camera…';

let handPoints     = [];
let prevHandPoints = [];

// ── Pollen class ──────────────────────────────────────────────────
class Pollen {
  constructor(zoneIndex) {
    this.zoneIndex   = zoneIndex;
    this.type        = ZONE_DEFS[zoneIndex].type;
    this.faceOffsetX = 0;
    this.faceOffsetY = 0;
    this.hasFaceSlot = false;
    this.reset(true);
  }

  zoneLeft()  { return this.zoneIndex * (W / 3); }
  zoneRight() { return (this.zoneIndex + 1) * (W / 3); }

  reset(initial = false) {
    const T = POLLEN_TYPES[this.type];
    const zl = this.zoneLeft();
    const zw = W / 3;
    this.x       = zl + random(zw);
    this.y       = initial ? random(H) : random(-40, -5);
    this.r       = T.r();
    this.baseCol = T.baseCol();
    this.alpha   = T.alpha();
    this.vx      = T.vx();
    this.vy      = T.vy();
    this.baseVy  = this.vy;
    this.angle   = random(TWO_PI);
    this.spin    = random(-0.025, 0.025);
    this.inOrbit = false;
    this.hasFaceSlot = false;
    this.stunTimer = 0;
  }
  
  attract(hx, hy) {
    if (this.stunTimer > 0) {
      this.stunTimer--;
      return; 
    }

    if (hx < this.zoneLeft() || hx > this.zoneRight()) {
      this.hasFaceSlot = false;
      return;
    }
    const d = dist(this.x, this.y, hx, hy);
    if (d > ATTRACT_RADIUS) {
      this.hasFaceSlot = false;
      return;
    }
    if (!this.hasFaceSlot) {
      const angle = random(TWO_PI);
      const rx = FACE_SPREAD * random(0.05, 1.0);
      const ry = FACE_SPREAD * 1.35 * random(0.05, 1.0);
      this.faceOffsetX = cos(angle) * rx;
      this.faceOffsetY = sin(angle) * ry;
      this.hasFaceSlot = true;
    }
    const targetX = hx + this.faceOffsetX;
    const targetY = hy + this.faceOffsetY;
    const dx = targetX - this.x;
    const dy = targetY - this.y;
    const dd = sqrt(dx*dx + dy*dy) + 0.001;
    const force = map(dd, 0, 200, 0.06, 0.22) * STICK_FORCE;
    this.vx += (dx / dd) * force;
    this.vy += (dy / dd) * force;
    this.spin    = random(-0.08, 0.08);
    this.inOrbit = true;
  }

  wipe(handX, handY, hdx, hdy) {
    if (!this.hasFaceSlot) return;
    const d = dist(this.x, this.y, handX, handY);
    if (d > WIPE_RADIUS) return;
    const handSpeed = sqrt(hdx*hdx + hdy*hdy);
    if (handSpeed < WIPE_SPEED_MIN) return;
    
    this.inOrbit     = false;
    this.vx = hdx * WIPE_FLING_SCALE + random(-5, 5);
    this.vy = hdy * WIPE_FLING_SCALE + random(-5, 5);
    this.spin = random(-0.5, 0.5);

    this.stunTimer = random(30, 70);
  }

  update() {
    const { wx, wy } = wind.sample(this.x, this.y);
    const drag = WIND_DRAG[this.type];

    this.x += this.vx + sin(frameCount * 0.01 + this.y * 0.05) * 0.1 + wx * drag;
    this.y += this.vy + wy * drag * 0.5;
    this.angle += this.spin;

    const windSpd = sqrt(wx*wx + wy*wy);
    this.spin += (windSpd * drag * 0.004 - this.spin) * 0.05;

    if (this.inOrbit) {
      this.vx *= FRICTION;
      this.vy *= FRICTION;
      this.vy += 0.002;
      this.inOrbit = false;
    } else {
      this.vy += 0.003;
      if (this.vy < this.baseVy * 0.25) this.vy += 0.006;
    }

    const zl = this.zoneLeft();
    const zr = this.zoneRight();

    if (this.hasFaceSlot) {
      if (this.x < 0) { this.x = 0; this.vx = abs(this.vx) * 0.5; }
      if (this.x > W) { this.x = W; this.vx = -abs(this.vx) * 0.5; }
    } else {
      if (this.x < zl) { 
        this.vx += 0.08; 
      } else if (this.x > zr) { 
        this.vx -= 0.08; 
      }
      
      if (this.x < 0) { this.x = 0; this.vx = abs(this.vx) * 0.5; }
      if (this.x > W) { this.x = W; this.vx = -abs(this.vx) * 0.5; }
    }

    if (this.y > H + 20) this.reset();
    if (this.y < -60)    this.y = -40;
  }

  draw(g) {
    const T = POLLEN_TYPES[this.type];
    g.push();
    g.translate(this.x, this.y);
    g.rotate(this.angle);
    g.noStroke();
    const a = this.inOrbit ? min(this.alpha * 1.18, 255) : this.alpha;
    T.draw(g, this.r, this.baseCol, a, this.angle);
    g.pop();
  }
}

// ── p5 setup ──────────────────────────────────────────────────────
function setup() {
  W = 3072;
  H = 1280;
  
  let cnv = createCanvas(W, H);
  cnv.style('position', 'absolute');
  cnv.style('top', '0px');
  cnv.style('left', '0px');
  cnv.style('transform-origin', 'top left');
  
  pollenGfx = createGraphics(W, H);
  wind = new WindField();
  wind.init(W, H);

  const perZone = floor(POLLEN_COUNT / 3);
  for (let z = 0; z < 3; z++) {
    for (let i = 0; i < perZone; i++) particles.push(new Pollen(z));
  }

  ['clearBtn','bloomBtn','modeBtn','status'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });

  startBodyPose();
}

function startBodyPose() {
  statusMsg = '';
  video = createCapture(VIDEO, () => {
    video.style('position', 'absolute');
    video.style('opacity', '0');
    video.style('pointer-events', 'none');
    bodyPose = ml5.bodyPose(video, { flipped: false }, () => {
      statusMsg = '';
      bodyPose.detectStart(video, (results) => {
        poses = results;
        if (results.length > 0) statusMsg = '';
      });
    });
  });
}

// ── p5 draw ───────────────────────────────────────────────────────
function draw() {
  // Proportional scaling for anti-stretch video
  if (video && video.width > 0) {
    vScale = max(W / video.width, H / video.height);
    const vW = video.width * vScale;
    const vH = video.height * vScale;
    vX = (W - vW) / 2;
    vY = (H - vH) / 2;

    push(); 
    translate(W, 0); 
    scale(-1, 1);
    image(video, vX, vY, vW, vH);
    pop();
  } else {
    background(26, 18, 5);
  }

  wind.update();

  noStroke();
  for (let z = 0; z < 3; z++) {
    const [r, g, b, a] = ZONE_DEFS[z].tint;
    fill(r, g, b, a);
    rect(z * (W / 3), 0, W / 3, H);
  }

  const ctx = drawingContext;
  ctx.save();
  const grad = ctx.createRadialGradient(W/2, H/2, H*0.3, W/2, H/2, H*0.85);
  grad.addColorStop(0, 'rgba(0,0,0,0)');
  grad.addColorStop(1, 'rgba(0,0,0,0.55)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();


  for (let z = 0; z < 3; z++) {
    const zx = z * (W / 3);
    if (z > 0) {
      stroke(255, 255, 255, 30); strokeWeight(1);
      line(zx, 0, zx, H);
      noStroke();
    }
  }

  if (SHOW_WIND) wind.drawOverlay();

  // ── face attractor ────────────────────────────────────────────
  const attractors = [];
  if (poses.length > 0) {
    const pose = poses[0];
    let sumX = 0, sumY = 0, count = 0;
    for (const idx of HEAD_KEYPOINTS) {
      const kp = pose.keypoints[idx];
      if (!kp || kp.confidence < CONFIDENCE) continue;
      // Updated coordinate math for anti-stretch
      sumX += W - (kp.x * vScale + vX);
      sumY += (kp.y * vScale + vY);
      count++;
    }
    if (count > 0) attractors.push({ hx: sumX / count, hy: sumY / count });
  }

  // ── hand tracking ─────────────────────────────────────────────
  prevHandPoints = handPoints.slice();
  handPoints = [];
  if (poses.length > 0) {
    const pose = poses[0];
    
    const getHandPos = (elbowIdx, wristIdx) => {
      const elbow = pose.keypoints[elbowIdx];
      const wrist = pose.keypoints[wristIdx];
      if (elbow && wrist && elbow.confidence > CONFIDENCE && wrist.confidence > CONFIDENCE) {
        // Updated coordinate math for anti-stretch
        const ex = W - (elbow.x * vScale + vX);
        const ey = (elbow.y * vScale + vY);
        const wx = W - (wrist.x * vScale + vX);
        const wy = (wrist.y * vScale + vY);
        
        return { x: wx + (wx - ex) * 0.3, y: wy + (wy - ey) * 0.3 };
      }
      return null;
    };

    const leftPalm = getHandPos(7, 9);
    const rightPalm = getHandPos(8, 10);
    
    if (leftPalm) handPoints.push(leftPalm);
    if (rightPalm) handPoints.push(rightPalm);
  }
  
  const hands = handPoints.map((hp, i) => {
    const prev = prevHandPoints[i];
    return { x: hp.x, y: hp.y, hdx: prev ? hp.x - prev.x : 0, hdy: prev ? hp.y - prev.y : 0 };
  });

  pollenGfx.clear();
  typeCounts = { tree: 0, grass: 0, weed: 0 };

  for (const pk of particles) {
    for (const { hx, hy } of attractors) pk.attract(hx, hy);
    for (const h of hands) pk.wipe(h.x, h.y, h.hdx, h.hdy);
    pk.update();
    pk.draw(pollenGfx);
    typeCounts[pk.type]++;
  }
  image(pollenGfx, 0, 0);

  for (const h of hands) {
    const spd = sqrt(h.hdx*h.hdx + h.hdy*h.hdy);
    if (spd > WIPE_SPEED_MIN * 0.5) {
      const alpha = map(spd, WIPE_SPEED_MIN * 0.5, 20, 25, 110);
      noFill(); stroke(255, 240, 200, alpha); strokeWeight(1.2);
      ellipse(h.x, h.y, WIPE_RADIUS * 2, WIPE_RADIUS * 2);
      noStroke();
    }
  }
  drawDebug(attractors, hands);
}

function drawDebug(attractors, hands) {
  push();
  
  fill(0, 255, 0, 180); 
  noStroke();
  const L = 40;
  triangle(0, 0, L, 0, 0, L);
  triangle(W, 0, W - L, 0, W, L);
  triangle(0, H, L, H, 0, H - L);
  triangle(W, H, W - L, H, W, H - L);

  stroke(0, 255, 0);
  strokeWeight(2);
  line(W/2 - 20, H/2, W/2 + 20, H/2);
  line(W/2, H/2 - 20, W/2, H/2 + 20);

  stroke(0, 255, 0);
  
  for (let x = 0; x <= W; x += 10) {
    let isMajor = (x % 50 === 0);
    let len = isMajor ? 18 : 6;
    strokeWeight(isMajor ? 2 : 1);
    
    line(x, 0, x, len);         
    line(x, H, x, H - len);     

    if (isMajor && x > 0 && x < W) {
      noStroke(); fill(0, 255, 0); textSize(9); textAlign(CENTER, TOP);
      text(x, x, len + 2);
      stroke(0, 255, 0);
    }
  }

  for (let y = 0; y <= H; y += 10) {
    let isMajor = (y % 50 === 0);
    let len = isMajor ? 18 : 6;
    strokeWeight(isMajor ? 2 : 1);
    
    line(0, y, len, y);         
    line(W, y, W - len, y);     

    if (isMajor && y > 0 && y < H) {
      noStroke(); fill(0, 255, 0); textSize(9); textAlign(LEFT, CENTER);
      text(y, len + 4, y);
      stroke(0, 255, 0);
    }
  }

  noFill();
  strokeWeight(3);
  
  stroke(0, 255, 255, 200);
  for (const a of attractors) {
    circle(a.hx, a.hy, 180); 
  }

  stroke(255, 0, 255, 200);
  for (const h of hands) {
    circle(h.x, h.y, 100); 
  }
  pop();
}

function keyPressed() {
  const canvasEl = document.querySelector('canvas');
  if (!canvasEl) return;

  if (keyCode === UP_ARROW) {
    currentScale += 0.1;
    canvasEl.style.transform = `scale(${currentScale})`;
    return false; 
  } else if (keyCode === DOWN_ARROW) {
    currentScale = max(0.1, currentScale - 0.1);
    canvasEl.style.transform = `scale(${currentScale})`;
    return false; 
  }
}
