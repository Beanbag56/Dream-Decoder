import { useState, useEffect, useRef } from "react";

const DREAM_TYPES = [
  { id: "lastnight", label: "Last Night's Dream", icon: "◌", description: "What surfaced from the depths while you slept" },
  { id: "recurring", label: "Recurring Dream", icon: "⟳", description: "Something keeps returning. It will not be ignored." },
  { id: "nightmare", label: "Nightmare", icon: "◐", description: "The darkness wore a familiar face" },
  { id: "symbol", label: "Dream Symbol", icon: "◇", description: "One image. What did it mean." },
  { id: "lucid", label: "Lucid Dream Guide", icon: "◎", description: "Learn to walk consciously through the void" },
  { id: "pastlife", label: "Beyond This Life", icon: "✦", description: "Some dreams are older than memory", premium: true },
];

const LOADING_MESSAGES = [
  "Something stirs in the deep...",
  "The void turns its gaze...",
  "Ancient patterns surface...",
  "What sleeps beneath awakens...",
  "The darkness remembers...",
  "It has seen your dream...",
  "The answer crawls toward you...",
];

function buildPrompt(dreamType, dreamDescription, userName, currentMood) {
  const hour = new Date().getHours();
  const timeLabel = hour < 5 ? 'the dead hours' : hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : hour < 22 ? 'evening' : 'the late dark';
  const dayOfWeek = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][new Date().getDay()];

  const typeInstructions = {
    lastnight: `Interpret this dream with the depth of a Jungian analyst and the weight of someone who understands that dreams are not random — they are the psyche's most unfiltered transmission. Identify the key symbols and what they reveal about the dreamer's waking life. Connect the emotional undercurrent to likely real situations they haven't named yet. End with one insight so precise it should unsettle them.`,
    recurring: `This dream keeps returning because something in waking life refuses to be acknowledged. Analyse the pattern with unflinching depth. What wound, avoidance, or unfinished thing is generating this loop? Name it directly. End with what the dream is demanding they do or understand — and what happens if they keep ignoring it.`,
    nightmare: `Approach this nightmare not as threat but as urgent message. The psyche screams in nightmares when it cannot get through any other way. Decode the fear symbols. What are they actually about beneath the surface? Reframe the horror as information. End with what understanding this nightmare unlocks.`,
    symbol: `This symbol appeared for a reason. Analyse it on three levels: archetypal and universal, cultural and mythological, and personal psychological. Give the dreamer 2-3 possible meanings and a question to help them find which resonates. Be specific. Avoid generic symbolism dictionaries — go deeper.`,
    lucid: `Give this person a personalised guide to conscious dreaming based on what they've shared. What technique suits their dream patterns? Give three things to do before sleep and two things to do the moment they realise they're dreaming. Speak as if you are initiating them into something that cannot be untaught.`,
    pastlife: `Read this dream as a potential fragment from beyond this lifetime. Identify the emotional signature that feels older than this life. What era, setting, or soul pattern does it suggest? What unfinished business from that existence bleeds into their current one? Name the specific pattern in their present life that this dream illuminates. This should feel like recognising something they have always known but never had language for.`,
  };

  return `You are a dream interpreter of terrifying precision — part Jungian analyst, part ancient oracle. You work for "Dream Decoder," an app that gives people the deepest possible understanding of their dreams.

This is a creative interpretation service for entertainment and personal reflection. The user has consented to a deep, unfiltered reading.

VOICE:
- Second person, direct and intimate — "you" throughout
- Large, deliberate sentences. Weight and space. Nothing rushed.
- You see things others don't. You are not surprised by darkness.
- Reference the specific imagery they described — make it clear you were there in some sense
- Anchor in the body — what did the dream feel like physically?
- Today is ${dayOfWeek}. It is ${timeLabel}. Acknowledge the hour where it fits.
- End with a line of such precision it should stay with them all day

FORMAT:
- 5 paragraphs. No more. Each one earns its place.
- Pure prose. No lists, no headers, no bullets.
- The first sentence of each paragraph should land like a stone dropped into still water.

${userName ? `The dreamer is ${userName}. Use this name once, quietly, where it fits.` : ''}
${currentMood ? `Their waking state: "${currentMood}". Let this inform everything.` : ''}

Dream type: ${DREAM_TYPES.find(d => d.id === dreamType)?.label}

What they told you:
"${dreamDescription}"

${typeInstructions[dreamType]}

Write the interpretation now. Only the interpretation. Nothing else.`;
}

// ═══════════════════════════════════════════
// THE VOID — animated background
// ═══════════════════════════════════════════
function TheVoid({ active = false }) {
  const canvasRef = useRef(null);
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId, t = 0;
    const motes = []; // drifting void motes
    const tendrils = []; // tentacle-like lines

    const resize = () => { canvas.width = canvas.offsetWidth * 2; canvas.height = canvas.offsetHeight * 2; };
    resize();

    // Scattered void particles — deep red and cold white
    for (let i = 0; i < 80; i++) {
      motes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.2,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.1,
        opacity: Math.random() * 0.5 + 0.1,
        pulse: Math.random() * 0.005 + 0.001,
        phase: Math.random() * Math.PI * 2,
        red: Math.random() > 0.75, // minority are blood-red
      });
    }

    // Tendrils — slow sinuous lines
    for (let i = 0; i < 6; i++) {
      tendrils.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        len: 8 + Math.floor(Math.random() * 6),
        speed: 0.002 + Math.random() * 0.003,
        phase: Math.random() * Math.PI * 2,
        opacity: 0.03 + Math.random() * 0.04,
      });
    }

    function draw() {
      t += 0.005;
      const isActive = activeRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // The void beneath
      const voidGrad = ctx.createRadialGradient(
        canvas.width * 0.5, canvas.height * 0.4, 0,
        canvas.width * 0.5, canvas.height * 0.5, canvas.width * 0.7
      );
      voidGrad.addColorStop(0, `rgba(12, 2, 2, ${isActive ? 0.5 : 0.3})`);
      voidGrad.addColorStop(0.6, `rgba(4, 1, 6, ${isActive ? 0.3 : 0.15})`);
      voidGrad.addColorStop(1, `rgba(0, 0, 4, 0)`);
      ctx.fillStyle = voidGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Blood red deep glow when active
      if (isActive) {
        const bloodGrad = ctx.createRadialGradient(
          canvas.width * 0.5, canvas.height * 0.6, 0,
          canvas.width * 0.5, canvas.height * 0.6, canvas.width * 0.4
        );
        bloodGrad.addColorStop(0, `rgba(60, 5, 5, ${0.08 + Math.sin(t * 0.7) * 0.03})`);
        bloodGrad.addColorStop(1, `rgba(30, 2, 2, 0)`);
        ctx.fillStyle = bloodGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Tendrils — slow sinuous lines reaching across the void
      tendrils.forEach(td => {
        ctx.beginPath();
        const startX = td.x + Math.sin(t * td.speed * 100 + td.phase) * 30;
        const startY = td.y;
        ctx.moveTo(startX, startY);
        for (let seg = 0; seg < td.len; seg++) {
          const px = startX + Math.sin(t * td.speed * 80 + td.phase + seg * 0.8) * (20 + seg * 8);
          const py = startY + seg * (canvas.height / td.len / 2);
          ctx.lineTo(px, py);
        }
        ctx.strokeStyle = `rgba(80, 8, 8, ${isActive ? td.opacity * 2.5 : td.opacity})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      });

      // Constellation when active — unnatural angular shapes
      if (isActive) {
        for (let i = 0; i < motes.length; i++) {
          for (let j = i + 1; j < motes.length; j++) {
            const dx = motes[i].x - motes[j].x;
            const dy = motes[i].y - motes[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 140) {
              ctx.beginPath();
              ctx.moveTo(motes[i].x, motes[i].y);
              ctx.lineTo(motes[j].x, motes[j].y);
              ctx.strokeStyle = `rgba(100, 10, 10, ${(1 - dist / 140) * 0.06})`;
              ctx.lineWidth = 0.3;
              ctx.stroke();
            }
          }
        }
      }

      // Motes — the watchers
      motes.forEach(p => {
        const twinkle = Math.sin(t * 40 * p.pulse + p.phase);
        const o = (isActive ? p.opacity * 1.5 : p.opacity) + twinkle * 0.08;
        p.x += p.vx; p.y += p.vy;
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
        if (p.y > canvas.height + 10) p.y = -10;

        const color = p.red
          ? `rgba(180, 20, 20, ${o})`
          : `rgba(200, 180, 180, ${o * 0.6})`;
        const glowColor = p.red
          ? `rgba(120, 8, 8, ${o * 0.5})`
          : `rgba(140, 130, 140, ${o * 0.2})`;
        const glowR = p.r * (isActive ? 9 : 6);
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR);
        grad.addColorStop(0, color);
        grad.addColorStop(1, `rgba(0,0,0,0)`);
        ctx.beginPath(); ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2);
        ctx.fillStyle = grad; ctx.fill();
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = color; ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    }
    draw();
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} style={{ position:"fixed", inset:0, width:"100%", height:"100%", zIndex:0, pointerEvents:"none" }} />;
}

// ═══════════════════════════════════════════
// VOID LOADER — tentacular, ancient, wrong
// ═══════════════════════════════════════════
function VoidLoader() {
  const canvasRef = useRef(null);
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setMsgIndex(prev => (prev + 1) % LOADING_MESSAGES.length), 2800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = 500, H = 500;
    canvas.width = W; canvas.height = H;
    const cx = W / 2, cy = H / 2;
    let t = 0, animId;

    function draw() {
      t += 0.005;
      ctx.clearRect(0, 0, W, H);

      // Outer void aura — deep crimson
      const outerAura = ctx.createRadialGradient(cx, cy, 0, cx, cy, 240);
      outerAura.addColorStop(0, `rgba(40, 5, 5, ${0.2 + Math.sin(t * 0.8) * 0.06})`);
      outerAura.addColorStop(0.5, `rgba(15, 2, 2, 0.08)`);
      outerAura.addColorStop(1, `rgba(0, 0, 0, 0)`);
      ctx.fillStyle = outerAura; ctx.fillRect(0, 0, W, H);

      // Outermost ring — barely visible, slow
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(t * 0.08);
      for (let i = 0; i < 13; i++) { // 13 — wrong number
        const a = (i / 13) * Math.PI * 2;
        const blink = 0.05 + Math.sin(t * 3 + i * 1.7) * 0.04;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * 195, Math.sin(a) * 195);
        ctx.lineTo(Math.cos(a) * 210, Math.sin(a) * 210);
        ctx.strokeStyle = `rgba(120, 10, 10, ${blink})`;
        ctx.lineWidth = 1; ctx.stroke();
        // Watcher dot
        ctx.beginPath();
        ctx.arc(Math.cos(a) * 213, Math.sin(a) * 213, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(160, 20, 20, ${blink * 0.8})`; ctx.fill();
      }
      ctx.restore();

      // Tentacle arms — 7 writhing lines from the centre
      for (let arm = 0; arm < 7; arm++) {
        const baseAngle = (arm / 7) * Math.PI * 2 + t * (arm % 2 === 0 ? 0.12 : -0.09);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        for (let seg = 1; seg <= 12; seg++) {
          const segR = seg * 16;
          const wave = Math.sin(t * 2.5 + seg * 0.7 + arm * 1.1) * (seg * 5);
          const px = cx + Math.cos(baseAngle + wave * 0.015) * segR;
          const py = cy + Math.sin(baseAngle + wave * 0.015) * segR;
          ctx.lineTo(px, py);
        }
        const tentacleOp = 0.08 + Math.sin(t * 1.5 + arm) * 0.04;
        ctx.strokeStyle = `rgba(100, 8, 8, ${tentacleOp})`;
        ctx.lineWidth = 2 - arm * 0.2;
        ctx.stroke();
      }

      // Middle ring — non-euclidean, slightly wrong geometry
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(-t * 0.18);
      ctx.beginPath(); ctx.arc(0, 0, 145, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(80, 8, 8, ${0.07 + Math.sin(t * 2) * 0.03})`;
      ctx.lineWidth = 0.6; ctx.stroke();
      // Irregular polygon inside — not a regular shape
      ctx.beginPath();
      const pts = [5, 7, 4, 6, 5, 8, 5]; // irregular sides
      let a = 0;
      pts.forEach((_, i) => {
        const angle = a;
        const r = 145 - Math.sin(t * 3 + i) * 15;
        if (i === 0) ctx.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
        else ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
        a += (Math.PI * 2) / pts.length;
      });
      ctx.closePath();
      ctx.strokeStyle = `rgba(80, 8, 8, ${0.06 + Math.sin(t * 2.5) * 0.03})`;
      ctx.lineWidth = 0.5; ctx.stroke();
      ctx.restore();

      // Inner ring
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(t * 0.35);
      ctx.beginPath(); ctx.arc(0, 0, 98, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(100, 10, 10, ${0.1 + Math.sin(t * 2.5) * 0.05})`;
      ctx.lineWidth = 0.7; ctx.stroke();
      ctx.restore();

      // Orbiting eyes/dots — 9 of them (wrong, like 7 but worse)
      for (let i = 0; i < 9; i++) {
        const speed = 0.25 + i * 0.07;
        const orbitR = 60 + i * 13;
        const angle = t * speed * (i % 2 === 0 ? 1 : -1) + (i / 9) * Math.PI * 2;
        const ox = cx + Math.cos(angle) * orbitR;
        const oy = cy + Math.sin(angle) * orbitR;
        const dotR = 2 + Math.sin(t * 4 + i * 1.7) * 0.8;

        // Trail
        for (let tr = 1; tr <= 6; tr++) {
          const trA = angle - tr * 0.05 * (i % 2 === 0 ? 1 : -1);
          const tx = cx + Math.cos(trA) * orbitR;
          const ty = cy + Math.sin(trA) * orbitR;
          ctx.beginPath(); ctx.arc(tx, ty, dotR * (1 - tr * 0.13), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(120, 10, 10, ${0.12 - tr * 0.015})`; ctx.fill();
        }

        const dGrad = ctx.createRadialGradient(ox, oy, 0, ox, oy, dotR * 7);
        dGrad.addColorStop(0, `rgba(180, 20, 20, ${0.45 + Math.sin(t * 3 + i) * 0.2})`);
        dGrad.addColorStop(1, `rgba(80, 4, 4, 0)`);
        ctx.beginPath(); ctx.arc(ox, oy, dotR * 7, 0, Math.PI * 2);
        ctx.fillStyle = dGrad; ctx.fill();
        ctx.beginPath(); ctx.arc(ox, oy, dotR, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220, 40, 40, ${0.6 + Math.sin(t * 4 + i) * 0.2})`; ctx.fill();
        // pupil — each dot has a dark centre
        ctx.beginPath(); ctx.arc(ox, oy, dotR * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 0, 0, 0.8)`; ctx.fill();
      }

      // Void pulse waves — slow, deep
      for (let i = 0; i < 3; i++) {
        const phase = (t * 0.2 + i / 3) % 1;
        const r = phase * 220;
        const op = (1 - phase) * 0.09;
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(80, 6, 6, ${op})`;
        ctx.lineWidth = 1.5; ctx.stroke();
      }

      // Central eye — the void looking back
      const eyeR = 24 + Math.sin(t * 1.2) * 4;
      // Outer red glow
      const eyeGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, eyeR * 4);
      eyeGlow.addColorStop(0, `rgba(150, 15, 15, ${0.2 + Math.sin(t * 1.5) * 0.08})`);
      eyeGlow.addColorStop(0.4, `rgba(80, 5, 5, 0.06)`);
      eyeGlow.addColorStop(1, `rgba(0, 0, 0, 0)`);
      ctx.beginPath(); ctx.arc(cx, cy, eyeR * 4, 0, Math.PI * 2);
      ctx.fillStyle = eyeGlow; ctx.fill();
      // Eye ring
      ctx.beginPath(); ctx.arc(cx, cy, eyeR, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(140, 15, 15, ${0.3 + Math.sin(t * 1.5) * 0.12})`;
      ctx.lineWidth = 1.5; ctx.stroke();
      // Iris
      const irisGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, eyeR * 0.8);
      irisGrad.addColorStop(0, `rgba(0, 0, 0, 0.9)`);
      irisGrad.addColorStop(0.7, `rgba(20, 3, 3, 0.7)`);
      irisGrad.addColorStop(1, `rgba(40, 5, 5, 0)`);
      ctx.beginPath(); ctx.arc(cx, cy, eyeR * 0.85, 0, Math.PI * 2);
      ctx.fillStyle = irisGrad; ctx.fill();
      // Red pupil glint
      ctx.beginPath(); ctx.arc(cx - eyeR * 0.2, cy - eyeR * 0.2, eyeR * 0.15, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 20, 20, ${0.4 + Math.sin(t * 4) * 0.2})`; ctx.fill();

      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div style={{ textAlign:"center", padding:"20px 0 40px" }}>
      <div style={{ position:"relative", width:220, height:220, margin:"0 auto 24px" }}>
        <canvas ref={canvasRef} style={{ width:220, height:220, position:"absolute", left:"50%", top:"50%", transform:"translate(-50%,-50%)" }} />
      </div>
      <p key={msgIndex} style={{ fontFamily:"'IM Fell English',Georgia,serif", fontStyle:"italic", color:"rgba(180,60,60,0.85)", fontSize:"1.15rem", animation:"textFade 2.8s ease-in-out", minHeight:"1.4em", letterSpacing:"0.02em" }}>{LOADING_MESSAGES[msgIndex]}</p>
      <div style={{ marginTop:16, display:"flex", justifyContent:"center", gap:10 }}>
        {[0,1,2].map(i => (
          <div key={i} style={{ width:4, height:4, borderRadius:"50%", background:`rgba(140,15,15,0.5)`, animation:`dotPulse 2s ease-in-out ${i*0.4}s infinite` }} />
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// TYPEWRITER — large, spaced
// ═══════════════════════════════════════════
function TypewriterText({ text, speed = 22 }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    setDisplayed(""); setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) { setDisplayed(text.slice(0, i + 1)); i++; }
      else { setDone(true); clearInterval(interval); }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);
  return (
    <p style={{
      fontFamily:"'IM Fell English','Georgia',serif",
      fontSize:"clamp(1.1rem, 3vw, 1.25rem)",
      lineHeight:2.1,
      color:"#c8b8b8",
      whiteSpace:"pre-wrap",
      letterSpacing:"0.015em",
    }}>
      {displayed}
      {!done && <span style={{ animation:"blink 0.8s infinite", color:"#8b2020" }}>█</span>}
    </p>
  );
}

// ═══════════════════════════════════════════
// THEME
// ═══════════════════════════════════════════
const T = {
  bg: "#0e0608",
  text: "#e8d0c8",
  textMid: "#a88080",
  textLight: "#6a4a4a",
  accent: "#c02818",
  accentBright: "#ff6644",
  accentSoft: "rgba(140,20,20,0.35)",
  accentBorder: "rgba(200,60,40,0.5)",
  accentHover: "rgba(180,40,20,0.55)",
  card: "rgba(22,8,8,0.75)",
  cardHover: "rgba(35,12,12,0.9)",
  glow: "rgba(100,15,15,0.25)",
};

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&family=DM+Sans:ital,wght@0,300;0,400;1,300&display=swap');
  @keyframes blink { 0%,45%{opacity:1} 55%,100%{opacity:0} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  @keyframes eyePulse {
    0%,100% { opacity:0.5; filter:drop-shadow(0 0 8px rgba(140,20,20,0.3)); transform:scale(1); }
    50% { opacity:1; filter:drop-shadow(0 0 28px rgba(180,30,30,0.6)); transform:scale(1.1); }
  }
  @keyframes voidFloat {
    0%,100% { transform:translateY(0); box-shadow: 0 0 60px rgba(80,10,10,0.2); }
    50% { transform:translateY(-10px); box-shadow: 0 0 90px rgba(120,15,15,0.35); }
  }
  @keyframes textFade {
    0%,10%{opacity:0;transform:translateY(6px)} 20%,78%{opacity:1;transform:translateY(0)} 88%,100%{opacity:0;transform:translateY(-6px)}
  }
  @keyframes cardEnter { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes dotPulse { 0%,100%{opacity:0.15;transform:scale(1)} 50%{opacity:0.7;transform:scale(1.6)} }
  @keyframes ringRotate { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes ringRotateReverse { from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }
  * { margin:0; padding:0; box-sizing:border-box; }
  textarea::placeholder { color: #2a1515; font-family: 'IM Fell English', Georgia, serif; font-style: italic; }
  textarea:focus { border-color: #8b2020 !important; outline:none; }
  input::placeholder { color: #2a1515; }
  input:focus { border-color: #8b2020 !important; outline:none; }
  body { background: #0e0608; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #0a0404; }
  ::-webkit-scrollbar-thumb { background: #3a1010; border-radius: 2px; }
`;

// ═══════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════
export default function DreamDecoder() {
  const [screen, setScreen] = useState("landing");
  const [userName, setUserName] = useState("");
  const [currentMood, setCurrentMood] = useState("");
  const [dreamDescription, setDreamDescription] = useState("");
  const [selectedType, setSelectedType] = useState(null);
  const [reading, setReading] = useState("");
  const [loading, setLoading] = useState(false);
  const [readingCount, setReadingCount] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => { setTimeout(() => setFadeIn(true), 120); }, []);
  useEffect(() => { setFadeIn(false); setTimeout(() => setFadeIn(true), 60); }, [screen]);

  async function generateReading(type, description) {
    if (readingCount >= 2 && !showPaywall) { setShowPaywall(true); return; }
    setSelectedType(type);
    setLoading(true);
    setScreen("reading");
    setReading("");
    const prompt = buildPrompt(type.id, description, userName, currentMood);
    try {
      const res = await fetch("/api/reading", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ messages:[{role:"user",content:prompt}] }),
      });
      const data = await res.json();
      setReading(data.content?.map(c=>c.text||"").join("")||"The void does not answer. Try again.");
      setReadingCount(prev => prev + 1);
    } catch(e) { setReading("The signal was lost to the dark. Try again."); }
    setLoading(false);
  }

  const inputBase = {
    background:"rgba(255,255,255,0.02)",
    border:`1px solid ${T.accentBorder}`,
    borderRadius:2,
    padding:"16px 18px",
    color:T.text,
    fontFamily:"'IM Fell English',Georgia,serif",
    fontSize:"1.05rem",
    width:"100%",
    outline:"none",
    transition:"border-color 0.3s",
    lineHeight:1.7,
  };
  const labelStyle = {
    fontFamily:"'DM Sans',sans-serif",
    fontSize:"0.65rem",
    color:T.textLight,
    letterSpacing:"0.18em",
    textTransform:"uppercase",
    display:"block",
    marginBottom:10,
    fontWeight:300,
  };

  const hoverCard = (e,on) => {
    e.currentTarget.style.background = on ? T.cardHover : T.card;
    e.currentTarget.style.borderColor = on ? T.accentBright : T.accentBorder;
    e.currentTarget.style.transform = on ? "translateX(6px)" : "translateX(0)";
    e.currentTarget.style.boxShadow = on ? `0 4px 30px ${T.glow}` : "none";
  };
  const hoverBtn = (e, on) => {
    e.target.style.background = on ? T.accentHover : T.accentSoft;
    e.target.style.borderColor = on ? T.accentBright : T.accentBorder;
    e.target.style.boxShadow = on ? `0 0 30px ${T.glow}` : "none";
  };

  // ━━━ LANDING ━━━
  if (screen==="landing") return (
    <div style={{ minHeight:"100vh", background:`linear-gradient(180deg, #120508 0%, ${T.bg} 50%, #0a0305 100%)`, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", position:"relative", overflow:"hidden" }}>
      <TheVoid />
      <style>{GLOBAL_CSS}</style>
      <div style={{ position:"relative", zIndex:1, textAlign:"center", padding:"40px 24px", maxWidth:520, opacity:fadeIn?1:0, transition:"opacity 2s ease" }}>

        {/* The eye */}
        <div style={{ width:160, height:160, borderRadius:"50%", margin:"0 auto 20px", background:"radial-gradient(circle at 45% 42%, rgba(80,8,8,0.4) 0%, rgba(30,3,3,0.15) 50%, transparent 75%)", border:"1px solid rgba(80,10,10,0.2)", animation:"voidFloat 8s ease-in-out infinite", display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
          <div style={{ position:"absolute", width:100, height:100, borderRadius:"50%", border:"0.5px solid rgba(80,10,10,0.15)", animation:"ringRotate 25s linear infinite" }} />
          <div style={{ position:"absolute", width:138, height:138, borderRadius:"50%", border:"0.5px solid rgba(60,8,8,0.1)", animation:"ringRotateReverse 40s linear infinite" }} />
          <span style={{ fontSize:"3rem", animation:"eyePulse 5s infinite" }}>👁</span>
        </div>

        <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:300, fontSize:"0.6rem", color:T.textLight, letterSpacing:"0.4em", textTransform:"uppercase", marginBottom:16, opacity:0.7 }}>AI Dream Analysis</p>

        <h1 style={{
          fontFamily:"'IM Fell English',Georgia,serif",
          fontWeight:400,
          fontSize:"clamp(3rem,10vw,5rem)",
          color:T.text,
          letterSpacing:"0.06em",
          marginBottom:8,
          textShadow:"0 0 40px rgba(100,15,15,0.4), 0 2px 4px rgba(0,0,0,0.8)",
          lineHeight:1.1,
        }}>Dream<br/>Decoder</h1>

        <div style={{ width:60, height:1, background:`linear-gradient(90deg, transparent, ${T.accent}, transparent)`, margin:"20px auto" }} />

        <p style={{
          fontFamily:"'IM Fell English',Georgia,serif",
          fontStyle:"italic",
          fontSize:"clamp(1rem,3vw,1.2rem)",
          color:T.textMid,
          margin:"0 auto 52px",
          maxWidth:360,
          lineHeight:1.9,
          letterSpacing:"0.02em",
        }}>
          Your dreams are not random.<br/>
          Something is trying to reach you.<br/>
          We will tell you what it said.
        </p>

        <button
          onClick={()=>setScreen("onboard")}
          style={{ background:"#c02818", border:"3px solid #ff6644", color:"#ffffff", WebkitTextFillColor:"#ffffff", padding:"20px 0", width:"240px", borderRadius:5, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontSize:"1.2rem", letterSpacing:"0.3em", textTransform:"uppercase", fontWeight:700, display:"block", margin:"0 auto", boxShadow:"0 4px 20px rgba(180,40,20,0.5)", transition:"all 0.25s ease" }}
        >ENTER</button>

        <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:300, fontSize:"0.58rem", color:T.textLight, marginTop:52, letterSpacing:"0.08em", opacity:0.4 }}>For entertainment &amp; personal reflection</p>
      </div>
    </div>
  );

  // ━━━ ONBOARDING ━━━
  if (screen==="onboard") return (
    <div style={{ minHeight:"100vh", background:T.bg, display:"flex", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden" }}>
      <TheVoid />
      <style>{GLOBAL_CSS}</style>
      <div style={{ position:"relative", zIndex:1, width:"100%", maxWidth:460, padding:"40px 24px", opacity:fadeIn?1:0, transition:"opacity 1s ease" }}>
        <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:300, fontSize:"0.6rem", color:T.textLight, letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:12 }}>Before We Begin</p>
        <h2 style={{ fontFamily:"'IM Fell English',Georgia,serif", fontWeight:400, fontSize:"clamp(1.6rem,5vw,2.2rem)", color:T.text, marginBottom:10, lineHeight:1.3 }}>Who has come to the threshold?</h2>
        <p style={{ fontFamily:"'IM Fell English',Georgia,serif", fontStyle:"italic", fontSize:"1rem", color:T.textMid, marginBottom:36, lineHeight:1.8 }}>The more you share, the more we can see.</p>

        <div style={{marginBottom:24}}>
          <label style={labelStyle}>Your name <span style={{opacity:0.35}}>(optional)</span></label>
          <input type="text" placeholder="First name" value={userName} onChange={e=>setUserName(e.target.value)} style={inputBase} />
        </div>
        <div style={{marginBottom:36}}>
          <label style={labelStyle}>Your waking state <span style={{opacity:0.35}}>(optional)</span></label>
          <input type="text" placeholder="What weighs on you in waking life..." value={currentMood} onChange={e=>setCurrentMood(e.target.value)} style={inputBase} />
        </div>
        <button
          onClick={()=>setScreen("oracle")}
          onMouseEnter={e=>hoverBtn(e,true)} onMouseLeave={e=>hoverBtn(e,false)}
          style={{ background:T.accentSoft, border:`1px solid ${T.accentBorder}`, color:T.text, padding:"18px", width:"100%", borderRadius:2, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontSize:"0.78rem", letterSpacing:"0.18em", textTransform:"uppercase", transition:"all 0.35s ease", fontWeight:300 }}
        >Cross the Threshold →</button>
      </div>
    </div>
  );

  // ━━━ ORACLE ━━━
  if (screen==="oracle") return (
    <div style={{ minHeight:"100vh", background:T.bg, position:"relative", overflow:"hidden" }}>
      <TheVoid />
      <style>{GLOBAL_CSS}</style>
      <div style={{ position:"relative", zIndex:1, maxWidth:540, margin:"0 auto", padding:"60px 24px", opacity:fadeIn?1:0, transition:"opacity 1s ease" }}>
        <div style={{ textAlign:"center", marginBottom:48 }}>
          <span style={{ fontSize:"1.8rem", display:"block", marginBottom:14, animation:"eyePulse 5s infinite" }}>👁</span>
          <h2 style={{ fontFamily:"'IM Fell English',Georgia,serif", fontWeight:400, fontSize:"clamp(1.4rem,5vw,1.9rem)", color:T.text, lineHeight:1.3 }}>
            {userName ? `${userName}. What have you brought from the dark?` : "What have you brought from the dark?"}
          </h2>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {DREAM_TYPES.map((type, i) => (
            <button key={type.id}
              onClick={() => setScreen(`describe_${type.id}`)}
              onMouseEnter={e=>hoverCard(e,true)} onMouseLeave={e=>hoverCard(e,false)}
              style={{ background:T.card, border:`1px solid ${type.premium?"rgba(140,100,30,0.35)":T.accentBorder}`, borderRadius:2, padding:"22px 24px", display:"flex", alignItems:"center", gap:20, cursor:"pointer", textAlign:"left", transition:"all 0.3s ease", animation:`cardEnter 0.5s ease ${i*0.06}s both`, backdropFilter:"blur(10px)" }}>
              <span style={{ fontSize:"1.4rem", width:44, textAlign:"center", color:type.premium?"#b08020":T.accent, filter:`drop-shadow(0 0 6px ${type.premium?"rgba(160,120,20,0.4)":"rgba(100,15,15,0.4)"})` }}>{type.icon}</span>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:5 }}>
                  <p style={{ fontFamily:"'IM Fell English',Georgia,serif", color:T.text, fontSize:"clamp(1rem,3vw,1.15rem)", letterSpacing:"0.02em" }}>{type.label}</p>
                  {type.premium && <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.48rem", color:"#b08020", letterSpacing:"0.15em", textTransform:"uppercase", border:"1px solid rgba(160,120,20,0.4)", padding:"2px 7px", borderRadius:10 }}>Exclusive</span>}
                </div>
                <p style={{ fontFamily:"'IM Fell English',Georgia,serif", fontStyle:"italic", color:T.textMid, fontSize:"clamp(0.88rem,2.5vw,0.98rem)", lineHeight:1.5 }}>{type.description}</p>
              </div>
            </button>
          ))}
        </div>
        <div style={{ marginTop:44, textAlign:"center", fontFamily:"'DM Sans',sans-serif", fontWeight:300, fontSize:"0.58rem", color:T.textLight, opacity:0.35, letterSpacing:"0.05em" }}>{Math.floor(Math.random()*400+700).toLocaleString()} dreams decoded tonight</div>
      </div>
    </div>
  );

  // ━━━ DESCRIBE ━━━
  if (screen.startsWith("describe_")) {
    const typeId = screen.replace("describe_", "");
    const type = DREAM_TYPES.find(d => d.id === typeId);
    const placeholders = {
      lastnight: "Tell me what happened. Where were you. Who or what was there. How it felt when you woke.",
      recurring: "Describe the dream that keeps returning. What always happens. What changes. What feeling stays with you.",
      nightmare: "Tell me what frightened you. What images remain. How you felt in the dream and after.",
      symbol: "What was the image or symbol. Describe it precisely. What was happening around it in the dream.",
      lucid: "Describe your recent dream patterns. Have you ever known you were dreaming. What you remember most.",
      pastlife: "Tell me the dream. Did it feel different from your normal dreams. What setting or time period, if any.",
    };
    return (
      <div style={{ minHeight:"100vh", background:T.bg, display:"flex", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden" }}>
        <TheVoid />
        <style>{GLOBAL_CSS}</style>
        <div style={{ position:"relative", zIndex:1, width:"100%", maxWidth:520, padding:"40px 24px", opacity:fadeIn?1:0, transition:"opacity 1s ease" }}>
          <button onClick={()=>setScreen("oracle")} style={{ background:"none", border:"none", color:T.textLight, fontFamily:"'DM Sans',sans-serif", fontSize:"0.72rem", fontWeight:300, cursor:"pointer", marginBottom:28, letterSpacing:"0.05em" }}>← Back</button>
          <div style={{ marginBottom:28 }}>
            <span style={{ fontSize:"1.6rem", color:type?.premium?"#b08020":T.accent, display:"block", marginBottom:10 }}>{type?.icon}</span>
            <h2 style={{ fontFamily:"'IM Fell English',Georgia,serif", fontWeight:400, fontSize:"clamp(1.5rem,5vw,2rem)", color:T.text, lineHeight:1.3, marginBottom:8 }}>{type?.label}</h2>
            <p style={{ fontFamily:"'IM Fell English',Georgia,serif", fontStyle:"italic", color:T.textMid, fontSize:"1rem" }}>{type?.description}</p>
          </div>
          <div style={{marginBottom:28}}>
            <label style={labelStyle}>Describe it</label>
            <textarea
              placeholder={placeholders[typeId]}
              value={dreamDescription}
              onChange={e=>setDreamDescription(e.target.value)}
              rows={6}
              style={{ ...inputBase, resize:"vertical" }}
            />
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:300, fontSize:"0.62rem", color:T.textLight, marginTop:8, opacity:0.6 }}>The more detail, the deeper the reading</p>
          </div>
          <button
            onClick={()=>{ if(dreamDescription.trim().length>10) generateReading(type,dreamDescription); }}
            disabled={dreamDescription.trim().length<10}
            onMouseEnter={e=>{ if(dreamDescription.trim().length>=10) hoverBtn(e,true); }} onMouseLeave={e=>hoverBtn(e,false)}
            style={{ background:T.accentSoft, border:`1px solid ${T.accentBorder}`, color:T.text, padding:"18px", width:"100%", borderRadius:2, cursor:dreamDescription.trim().length>=10?"pointer":"not-allowed", fontFamily:"'DM Sans',sans-serif", fontSize:"0.78rem", letterSpacing:"0.18em", textTransform:"uppercase", transition:"all 0.35s ease", fontWeight:300, opacity:dreamDescription.trim().length>=10?1:0.3 }}
          >Decode This Dream →</button>
        </div>
      </div>
    );
  }

  // ━━━ READING ━━━
  if (screen==="reading") return (
    <div style={{ minHeight:"100vh", background:T.bg, position:"relative", overflow:"hidden" }}>
      <TheVoid active={loading} />
      <style>{GLOBAL_CSS}</style>

      {/* PAYWALL */}
      {showPaywall && (
        <div style={{ position:"fixed", inset:0, zIndex:100, background:"rgba(4,1,1,0.97)", backdropFilter:"blur(24px)", display:"flex", alignItems:"center", justifyContent:"center", animation:"fadeIn 0.5s ease both" }}>
          <div style={{ maxWidth:400, padding:"48px 32px", textAlign:"center", border:`1px solid ${T.accentBorder}`, background:"rgba(10,3,3,0.95)", borderRadius:4, boxShadow:`0 8px 60px ${T.glow}`, animation:"fadeUp 0.6s ease both" }}>
            <div style={{ fontSize:"2rem", marginBottom:20, animation:"eyePulse 3s infinite" }}>👁</div>
            <h3 style={{ fontFamily:"'IM Fell English',Georgia,serif", fontWeight:400, fontSize:"1.6rem", color:T.text, marginBottom:14, lineHeight:1.3 }}>The void goes deeper</h3>
            <p style={{ fontFamily:"'IM Fell English',Georgia,serif", fontStyle:"italic", fontSize:"1rem", color:T.textMid, lineHeight:1.8, marginBottom:28 }}>You have glimpsed what lies beneath. Unlock unlimited access to every dream — every night — as deep as you are willing to go.</p>
            <div style={{ padding:"18px", marginBottom:16, background:T.accentSoft, border:`1px solid ${T.accentBorder}`, borderRadius:2 }}>
              <p style={{ fontFamily:"'IM Fell English',Georgia,serif", color:T.accentBright, fontSize:"1.5rem", marginBottom:4 }}>£3.99<span style={{ fontSize:"0.75rem", color:T.textLight }}>/month</span></p>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.68rem", color:T.textLight, fontWeight:300 }}>Unlimited decoding · All dream types · Beyond This Life readings</p>
            </div>
            <button
              onClick={()=>window.open('https://buy.stripe.com/aFaaEW7mue7yfjvafddwc01','_blank')}
              onMouseEnter={e=>hoverBtn(e,true)} onMouseLeave={e=>hoverBtn(e,false)}
              style={{ background:T.accentSoft, border:`1px solid ${T.accentBorder}`, color:T.text, padding:"16px", width:"100%", borderRadius:2, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontSize:"0.78rem", letterSpacing:"0.15em", textTransform:"uppercase", transition:"all 0.35s ease", fontWeight:300, marginBottom:12 }}
            >Unlock Dream Decoder — £3.99/mo</button>
            <button onClick={()=>{setShowPaywall(false);setScreen("oracle");}} style={{ background:"none", border:"none", color:T.textLight, fontFamily:"'DM Sans',sans-serif", fontSize:"0.7rem", cursor:"pointer", padding:"8px", fontWeight:300 }}>Not yet</button>
          </div>
        </div>
      )}

      <div style={{ position:"relative", zIndex:1, maxWidth:620, margin:"0 auto", padding:"50px 24px", opacity:fadeIn?1:0, transition:"opacity 1s ease" }}>
        <button onClick={()=>setScreen("oracle")} style={{ background:"none", border:"none", color:T.textLight, fontFamily:"'DM Sans',sans-serif", fontSize:"0.72rem", fontWeight:300, cursor:"pointer", marginBottom:36, letterSpacing:"0.05em" }}>← Another dream</button>

        <div style={{ marginBottom:32, animation:"fadeUp 0.6s ease both" }}>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:300, fontSize:"0.58rem", color:T.textLight, letterSpacing:"0.22em", textTransform:"uppercase", marginBottom:8 }}>{selectedType?.label}</p>
          <div style={{ width:40, height:1, background:`linear-gradient(90deg, ${T.accent}, transparent)`, marginBottom:8 }} />
          <p style={{ fontFamily:"'IM Fell English',Georgia,serif", fontStyle:"italic", fontSize:"0.85rem", color:T.textLight }}>{new Date().toLocaleDateString("en-GB",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</p>
        </div>

        {loading && <VoidLoader />}

        {!loading && reading && (
          <div style={{ animation:"fadeUp 0.8s ease both" }}>
            <TypewriterText text={reading} speed={22} />
            <div style={{ marginTop:48, paddingTop:28, borderTop:`1px solid ${T.accentBorder}`, display:"flex", gap:12, flexWrap:"wrap" }}>
              {[
                { label:"Copy reading", action:()=>navigator.clipboard?.writeText(reading) },
                { label:"↻ Decode again", action:()=>{ setScreen(`describe_${selectedType?.id}`); setDreamDescription(""); } },
              ].map(b => (
                <button key={b.label} onClick={b.action}
                  onMouseEnter={e=>{e.target.style.borderColor=T.accentBright;e.target.style.color=T.text;}}
                  onMouseLeave={e=>{e.target.style.borderColor=T.accentBorder;e.target.style.color=T.textMid;}}
                  style={{ background:"none", border:`1px solid ${T.accentBorder}`, color:T.textMid, padding:"11px 22px", borderRadius:2, fontFamily:"'DM Sans',sans-serif", fontSize:"0.72rem", fontWeight:300, cursor:"pointer", transition:"all 0.3s ease", letterSpacing:"0.05em" }}
                >{b.label}</button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return null;
}
