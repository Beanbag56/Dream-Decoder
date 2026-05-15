import { useState, useEffect, useRef } from "react";

const PREMIUM_KEY = "voidwalker2026";

const DREAM_TYPES = [
  { id: "lastnight", label: "Last Night's Dream", icon: "◌", description: "What surfaced from the depths while you slept" },
  { id: "recurring", label: "Recurring Dream", icon: "⟳", description: "Something keeps returning. It will not be ignored." },
  { id: "nightmare", label: "Nightmare", icon: "◐", description: "The darkness wore a familiar face" },
  { id: "symbol", label: "Dream Symbol", icon: "◇", description: "One image. What did it mean." },
  { id: "lucid", label: "Lucid Dream Guide", icon: "◎", description: "Learn to walk consciously through the void" },
  { id: "pastlife", label: "Beyond This Life", icon: "✦", description: "Some dreams are older than memory", exclusive: true },
  { id: "prophecy", label: "Prophetic Dream", icon: "◉", description: "Is this dream trying to warn you?", exclusive: true },
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
    lastnight: `Interpret this dream with the depth of a Jungian analyst. Identify key symbols and what they reveal about the dreamer's waking life. Connect the emotional undercurrent to likely real situations. End with one insight so precise it should unsettle them.`,
    recurring: `This dream keeps returning because something in waking life refuses to be acknowledged. Analyse the pattern with unflinching depth. What wound or unfinished thing generates this loop? Name it directly. End with what the dream is demanding.`,
    nightmare: `Approach this nightmare as urgent message. Decode the fear symbols. What are they actually about beneath the surface? Reframe the horror as information. End with what understanding this nightmare unlocks.`,
    symbol: `Analyse this symbol on three levels: archetypal and universal, cultural and mythological, and personal psychological. Give 2-3 possible meanings and a question to help them find which resonates.`,
    lucid: `Give a personalised guide to conscious dreaming based on what they've shared. Three things to do before sleep tonight and two things to do the moment they realise they're dreaming. Speak as if initiating them.`,
    pastlife: `Read this dream as a fragment from beyond this lifetime. Identify the emotional signature that feels older than this life. What era or soul pattern does it suggest? What unfinished business bleeds into their current one? Name the specific pattern in their present life this dream illuminates. This should feel like recognising something they've always known.`,
    prophecy: `This is a premium prophetic dream reading. Approach this dream as if it may contain genuine foreshadowing. What does the imagery suggest about what is coming in the dreamer's life? What pattern is trying to complete itself? What should they pay attention to in the coming days and weeks? Be specific about what signs to watch for. End with what action, if any, the dream is urging them to take now.`,
  };

  return `You are a dream interpreter of terrifying precision for "Dream Decoder Premium" — the most exclusive AI dream analysis experience available. You write for subscribers who have invested in the deepest possible understanding of their unconscious.

This is a creative interpretation service for entertainment and personal reflection. The subscriber has consented to a deep, unfiltered premium reading.

PREMIUM VOICE:
- Second person, direct and intimate — "you" throughout
- Longer and more detailed than a standard reading — these subscribers deserve more
- Reference the specific dream imagery they described — make it feel like you were there
- Anchor in the body — what did the dream feel like physically?
- Today is ${dayOfWeek}. It is ${timeLabel}.
- End with a line of such precision it should stay with them all day

FORMAT:
- 6 paragraphs. Each one earns its place.
- Pure prose. No lists, no headers, no bullets.
- The first sentence of each paragraph should land like a stone dropped into still water.

${userName ? `The dreamer is ${userName}. Use this name once, quietly.` : ''}
${currentMood ? `Their waking state: "${currentMood}". Let this inform everything.` : ''}

Dream type: ${DREAM_TYPES.find(d => d.id === dreamType)?.label}

What they told you:
"${dreamDescription}"

${typeInstructions[dreamType]}

Write the premium interpretation now. Only the interpretation. Nothing else.`;
}

// ═══════════════════════════════════════════
// VOID BACKGROUND
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
    const motes = [];
    const tendrils = [];

    const resize = () => { canvas.width = canvas.offsetWidth * 2; canvas.height = canvas.offsetHeight * 2; };
    resize();

    for (let i = 0; i < 80; i++) {
      motes.push({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        r: Math.random() * 2 + 0.3,
        vx: (Math.random() - 0.5) * 0.12, vy: (Math.random() - 0.5) * 0.1,
        op: Math.random() * 0.5 + 0.1,
        pulse: Math.random() * 0.005 + 0.001,
        phase: Math.random() * Math.PI * 2,
        hue: [0, 20, 40, 200, 270][Math.floor(Math.random() * 5)],
      });
    }
    for (let i = 0; i < 6; i++) {
      tendrils.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, len: 8 + Math.floor(Math.random() * 6), speed: 0.002 + Math.random() * 0.003, phase: Math.random() * Math.PI * 2, opacity: 0.03 + Math.random() * 0.04 });
    }

    function draw() {
      t += 0.005;
      const isActive = activeRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const vg = ctx.createRadialGradient(canvas.width * 0.5, canvas.height * 0.4, 0, canvas.width * 0.5, canvas.height * 0.5, canvas.width * 0.7);
      vg.addColorStop(0, `rgba(28,6,4,${isActive ? 0.5 : 0.35})`);
      vg.addColorStop(1, `rgba(4,0,2,0)`);
      ctx.fillStyle = vg; ctx.fillRect(0, 0, canvas.width, canvas.height);

      tendrils.forEach(td => {
        ctx.beginPath();
        const startX = td.x + Math.sin(t * td.speed * 100 + td.phase) * 30;
        ctx.moveTo(startX, td.y);
        for (let seg = 0; seg < td.len; seg++) {
          const px = startX + Math.sin(t * td.speed * 80 + td.phase + seg * 0.8) * (20 + seg * 8);
          const py = td.y + seg * (canvas.height / td.len / 2);
          ctx.lineTo(px, py);
        }
        ctx.strokeStyle = `rgba(80,8,8,${isActive ? td.opacity * 2.5 : td.opacity})`;
        ctx.lineWidth = 0.5; ctx.stroke();
      });

      if (isActive) {
        for (let i = 0; i < motes.length; i++) {
          for (let j = i + 1; j < motes.length; j++) {
            const dx = motes[i].x - motes[j].x, dy = motes[i].y - motes[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 140) {
              ctx.beginPath(); ctx.moveTo(motes[i].x, motes[i].y); ctx.lineTo(motes[j].x, motes[j].y);
              ctx.strokeStyle = `rgba(100,10,10,${(1 - dist / 140) * 0.06})`; ctx.lineWidth = 0.3; ctx.stroke();
            }
          }
        }
      }

      motes.forEach(p => {
        const tw = Math.sin(t * 40 * p.pulse + p.phase), o = (isActive ? p.op * 1.5 : p.op) + tw * 0.08;
        p.x += p.vx; p.y += p.vy;
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
        if (p.y > canvas.height + 10) p.y = -10;
        const col = `hsla(${p.hue},80%,65%,${o})`;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 8);
        g.addColorStop(0, col); g.addColorStop(1, `rgba(0,0,0,0)`);
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 8, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = col; ctx.fill();
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
// EYE CANVAS
// ═══════════════════════════════════════════
function EyeOrb({ size = 180 }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = size * 2, H = size * 2, cx = W / 2, cy = H / 2;
    canvas.width = W; canvas.height = H;
    let et = 0, animId;
    function drawEye() {
      et += 0.008; ctx.clearRect(0, 0, W, H);
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(et * 0.4);
      for (let i = 0; i < 36; i++) { const a = (i / 36) * Math.PI * 2, h = (i / 36) * 360, b = 0.15 + Math.sin(et * 2 + i * 0.5) * 0.08; ctx.beginPath(); ctx.moveTo(Math.cos(a) * (cx - 20), Math.sin(a) * (cy - 20)); ctx.lineTo(Math.cos(a) * cx, Math.sin(a) * cy); ctx.strokeStyle = `hsla(${h},90%,65%,${b})`; ctx.lineWidth = 3; ctx.stroke(); }
      ctx.restore();
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(-et * 0.25);
      for (let i = 0; i < 24; i++) { const a = (i / 24) * Math.PI * 2, h = 200 + (i / 24) * 120; ctx.beginPath(); ctx.arc(Math.cos(a) * (cx * 0.67), Math.sin(a) * (cy * 0.67), 3 + Math.sin(et * 3 + i), 0, Math.PI * 2); ctx.fillStyle = `hsla(${h},80%,65%,${0.2 + Math.sin(et * 2 + i) * 0.1})`; ctx.fill(); }
      ctx.restore();
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(et * 0.7);
      for (let i = 0; i < 18; i++) { const a = (i / 18) * Math.PI * 2, h = 10 + (i / 18) * 60, r2 = cx * 0.43 + Math.sin(et * 4 + i * 2) * 6; ctx.beginPath(); ctx.arc(Math.cos(a) * r2, Math.sin(a) * r2, 2.5, 0, Math.PI * 2); ctx.fillStyle = `hsla(${h},90%,65%,${0.25 + Math.sin(et * 3 + i) * 0.12})`; ctx.fill(); }
      ctx.restore();
      for (let i = 0; i < 7; i++) { const sp = 0.5 + i * 0.1, oR = cx * 0.3 + i * (cx * 0.044), a = et * sp * (i % 2 === 0 ? 1 : -1) + (i / 7) * Math.PI * 2, ox = cx + Math.cos(a) * oR, oy = cy + Math.sin(a) * oR, h = (i / 7) * 360; const dg = ctx.createRadialGradient(ox, oy, 0, ox, oy, 10); dg.addColorStop(0, `hsla(${h},90%,70%,0.6)`); dg.addColorStop(1, `rgba(0,0,0,0)`); ctx.beginPath(); ctx.arc(ox, oy, 10, 0, Math.PI * 2); ctx.fillStyle = dg; ctx.fill(); ctx.beginPath(); ctx.arc(ox, oy, 2.5, 0, Math.PI * 2); ctx.fillStyle = `hsla(${h},100%,80%,0.9)`; ctx.fill(); }
      animId = requestAnimationFrame(drawEye);
    }
    drawEye();
    return () => cancelAnimationFrame(animId);
  }, [size]);
  return <canvas ref={canvasRef} style={{ width: size, height: size, position:"absolute", inset:0 }} />;
}

// ═══════════════════════════════════════════
// VOID LOADER
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
    const W = 500, H = 500, cx = W / 2, cy = H / 2;
    canvas.width = W; canvas.height = H;
    let t = 0, animId;
    function draw() {
      t += 0.005; ctx.clearRect(0, 0, W, H);
      const amb = ctx.createRadialGradient(cx, cy, 0, cx, cy, 240);
      amb.addColorStop(0, `rgba(40,5,5,${0.2 + Math.sin(t * 0.8) * 0.06})`); amb.addColorStop(1, `rgba(0,0,0,0)`);
      ctx.fillStyle = amb; ctx.fillRect(0, 0, W, H);
      for (let arm = 0; arm < 7; arm++) {
        const baseAngle = (arm / 7) * Math.PI * 2 + t * (arm % 2 === 0 ? 0.12 : -0.09);
        ctx.beginPath(); ctx.moveTo(cx, cy);
        for (let seg = 1; seg <= 12; seg++) { const segR = seg * 16, wave = Math.sin(t * 2.5 + seg * 0.7 + arm * 1.1) * (seg * 5); ctx.lineTo(cx + Math.cos(baseAngle + wave * 0.015) * segR, cy + Math.sin(baseAngle + wave * 0.015) * segR); }
        ctx.strokeStyle = `rgba(100,8,8,${0.08 + Math.sin(t * 1.5 + arm) * 0.04})`; ctx.lineWidth = 2 - arm * 0.2; ctx.stroke();
      }
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(t * 0.08);
      for (let i = 0; i < 13; i++) { const a = (i / 13) * Math.PI * 2, b = 0.05 + Math.sin(t * 3 + i * 1.7) * 0.04; ctx.beginPath(); ctx.moveTo(Math.cos(a) * 195, Math.sin(a) * 195); ctx.lineTo(Math.cos(a) * 210, Math.sin(a) * 210); ctx.strokeStyle = `rgba(120,10,10,${b})`; ctx.lineWidth = 1; ctx.stroke(); }
      ctx.restore();
      for (let i = 0; i < 9; i++) {
        const orbitR = 60 + i * 13, a = t * (0.25 + i * 0.07) * (i % 2 === 0 ? 1 : -1) + (i / 9) * Math.PI * 2;
        const ox = cx + Math.cos(a) * orbitR, oy = cy + Math.sin(a) * orbitR;
        const dGrad = ctx.createRadialGradient(ox, oy, 0, ox, oy, 10);
        dGrad.addColorStop(0, `rgba(180,20,20,${0.45 + Math.sin(t * 3 + i) * 0.2})`); dGrad.addColorStop(1, `rgba(80,4,4,0)`);
        ctx.beginPath(); ctx.arc(ox, oy, 10, 0, Math.PI * 2); ctx.fillStyle = dGrad; ctx.fill();
        ctx.beginPath(); ctx.arc(ox, oy, 2.5, 0, Math.PI * 2); ctx.fillStyle = `rgba(220,40,40,${0.6 + Math.sin(t * 4 + i) * 0.2})`; ctx.fill();
        ctx.beginPath(); ctx.arc(ox, oy, 0.8, 0, Math.PI * 2); ctx.fillStyle = `rgba(0,0,0,0.9)`; ctx.fill();
      }
      for (let i = 0; i < 3; i++) { const phase = (t * 0.2 + i / 3) % 1, r = phase * 220, op = (1 - phase) * 0.09; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.strokeStyle = `rgba(80,6,6,${op})`; ctx.lineWidth = 1.5; ctx.stroke(); }
      const eyeR = 24 + Math.sin(t * 1.2) * 4;
      const eyeGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, eyeR * 4);
      eyeGlow.addColorStop(0, `rgba(150,15,15,${0.2 + Math.sin(t * 1.5) * 0.08})`); eyeGlow.addColorStop(1, `rgba(0,0,0,0)`);
      ctx.beginPath(); ctx.arc(cx, cy, eyeR * 4, 0, Math.PI * 2); ctx.fillStyle = eyeGlow; ctx.fill();
      ctx.beginPath(); ctx.arc(cx, cy, eyeR, 0, Math.PI * 2); ctx.strokeStyle = `rgba(140,15,15,${0.3 + Math.sin(t * 1.5) * 0.12})`; ctx.lineWidth = 1.5; ctx.stroke();
      const irisGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, eyeR * 0.8);
      irisGrad.addColorStop(0, `rgba(0,0,0,0.9)`); irisGrad.addColorStop(1, `rgba(40,5,5,0)`);
      ctx.beginPath(); ctx.arc(cx, cy, eyeR * 0.85, 0, Math.PI * 2); ctx.fillStyle = irisGrad; ctx.fill();
      ctx.beginPath(); ctx.arc(cx - eyeR * 0.2, cy - eyeR * 0.2, eyeR * 0.15, 0, Math.PI * 2); ctx.fillStyle = `rgba(200,20,20,${0.4 + Math.sin(t * 4) * 0.2})`; ctx.fill();
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
      <p key={msgIndex} style={{ fontFamily:"'IM Fell English',Georgia,serif", fontStyle:"italic", color:"rgba(180,60,60,0.9)", fontSize:"1.1rem", animation:"textFade 2.8s ease-in-out", minHeight:"1.4em" }}>{LOADING_MESSAGES[msgIndex]}</p>
      <div style={{ marginTop:14, display:"flex", justifyContent:"center", gap:10 }}>
        {[0,1,2].map(i => <div key={i} style={{ width:4, height:4, borderRadius:"50%", background:"rgba(140,15,15,0.6)", animation:`dotPulse 2s ease-in-out ${i*0.4}s infinite` }} />)}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// TYPEWRITER
// ═══════════════════════════════════════════
function TypewriterText({ text, speed = 20 }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    setDisplayed(""); setDone(false); let i = 0;
    const interval = setInterval(() => { if (i < text.length) { setDisplayed(text.slice(0, i + 1)); i++; } else { setDone(true); clearInterval(interval); } }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);
  return (
    <p style={{ fontFamily:"'IM Fell English','Georgia',serif", fontSize:"clamp(1.1rem,3vw,1.22rem)", lineHeight:2.1, color:"#e0cece", whiteSpace:"pre-wrap", letterSpacing:"0.015em" }}>
      {displayed}{!done && <span style={{ animation:"blink 0.8s infinite", color:"#c03020" }}>█</span>}
    </p>
  );
}

// ═══════════════════════════════════════════
// LOCK SCREEN
// ═══════════════════════════════════════════
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&family=DM+Sans:wght@300;400&display=swap');
  @keyframes blink { 0%,45%{opacity:1} 55%,100%{opacity:0} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  @keyframes eyePulse { 0%,100%{transform:scale(1);filter:drop-shadow(0 0 12px rgba(255,120,60,0.5))} 50%{transform:scale(1.13);filter:drop-shadow(0 0 40px rgba(255,180,80,0.9))} }
  @keyframes voidFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
  @keyframes textFade { 0%,10%{opacity:0;transform:translateY(6px)} 20%,78%{opacity:1;transform:translateY(0)} 88%,100%{opacity:0;transform:translateY(-6px)} }
  @keyframes cardIn { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes dotPulse { 0%,100%{opacity:0.15;transform:scale(1)} 50%{opacity:0.7;transform:scale(1.6)} }
  @keyframes ringR { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes ringL { from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }
  @keyframes bookmarkPulse { 0%,100%{box-shadow:0 4px 20px rgba(180,40,20,0.4)} 50%{box-shadow:0 4px 32px rgba(220,60,30,0.7)} }
  * { margin:0; padding:0; box-sizing:border-box; }
  input::placeholder { color:#604030; font-family:'IM Fell English',Georgia,serif; font-style:italic; }
  textarea::placeholder { color:#604030; font-family:'IM Fell English',Georgia,serif; font-style:italic; }
  input:focus, textarea:focus { outline:none; border-color:#c02818 !important; }
  body { background:#1a0808; }
  ::-webkit-scrollbar { width:4px; } ::-webkit-scrollbar-track { background:#0a0404; } ::-webkit-scrollbar-thumb { background:#3a1010; border-radius:2px; }
`;

function LockScreen() {
  const [attempt, setAttempt] = useState("");
  const [wrong, setWrong] = useState(false);
  const check = () => {
    if (attempt.toLowerCase().trim() === PREMIUM_KEY) {
      window.location.href = `/premium?key=${PREMIUM_KEY}`;
    } else {
      setWrong(true);
      setTimeout(() => setWrong(false), 2000);
    }
  };
  return (
    <div style={{ minHeight:"100vh", background:"#1a0808", display:"flex", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden" }}>
      <TheVoid />
      <style>{GLOBAL_CSS}</style>
      <div style={{ position:"relative", zIndex:1, textAlign:"center", padding:"40px 24px", maxWidth:400, width:"100%", animation:"fadeUp 0.8s ease" }}>
        <div style={{ fontSize:"3rem", marginBottom:20, animation:"eyePulse 4s infinite" }}>👁</div>
        <h2 style={{ fontFamily:"'IM Fell English',Georgia,serif", fontWeight:400, fontSize:"clamp(1.6rem,5vw,2rem)", color:"#e0cece", marginBottom:10, lineHeight:1.3 }}>Members Only</h2>
        <p style={{ fontFamily:"'IM Fell English',Georgia,serif", fontStyle:"italic", fontSize:"1rem", color:"#c09080", marginBottom:32, lineHeight:1.8 }}>Enter your Dream Decoder access key to continue.</p>
        <input
          type="text" placeholder="Enter your access key..."
          value={attempt} onChange={e => setAttempt(e.target.value)}
          onKeyDown={e => e.key === "Enter" && check()}
          style={{ background:"rgba(255,255,255,0.04)", border:`1px solid ${wrong ? "#e05050" : "rgba(180,60,30,0.4)"}`, borderRadius:3, padding:"16px 18px", color:"#e0cece", fontFamily:"'IM Fell English',Georgia,serif", fontSize:"1.05rem", width:"100%", marginBottom:12, textAlign:"center", letterSpacing:"0.08em", transition:"border-color 0.3s" }}
        />
        {wrong && <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.75rem", color:"#e05050", marginBottom:12 }}>That key isn't right. Check your confirmation email.</p>}
        <button onClick={check}
          style={{ background:"#c02818", border:"3px solid #ff6644", color:"#ffffff", WebkitTextFillColor:"#ffffff", padding:"18px 0", width:"100%", borderRadius:4, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontSize:"1rem", letterSpacing:"0.2em", textTransform:"uppercase", fontWeight:700, boxShadow:"0 4px 20px rgba(180,40,20,0.5)", transition:"all 0.25s ease" }}
        >Enter</button>
        <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.68rem", color:"#6a4a4a", marginTop:24 }}>
          Not a member?{" "}<a href="/" style={{ color:"#c09080", textDecoration:"none" }}>Try a free reading</a>
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// MAIN PREMIUM APP
// ═══════════════════════════════════════════
export default function DreamDecoderPremium() {
  const [screen, setScreen] = useState("landing");
  const [userName, setUserName] = useState("");
  const [currentMood, setCurrentMood] = useState("");
  const [dreamDescription, setDreamDescription] = useState("");
  const [selectedType, setSelectedType] = useState(null);
  const [reading, setReading] = useState("");
  const [loading, setLoading] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [showBookmark, setShowBookmark] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("key") === PREMIUM_KEY) { setUnlocked(true); setShowBookmark(true); }
  }, []);
  useEffect(() => { setTimeout(() => setFadeIn(true), 120); }, []);
  useEffect(() => { setFadeIn(false); setTimeout(() => setFadeIn(true), 60); }, [screen]);

  if (!unlocked) return <LockScreen />;

  async function generateReading(type, description) {
    setSelectedType(type); setLoading(true); setScreen("reading"); setReading("");
    const prompt = buildPrompt(type.id, description, userName, currentMood);
    try {
      const res = await fetch("/api/reading", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ messages:[{role:"user",content:prompt}] }) });
      const data = await res.json();
      setReading(data.content?.map(c => c.text || "").join("") || "The void does not answer. Try again.");
    } catch(e) { setReading("The signal was lost to the dark. Try again."); }
    setLoading(false);
  }

  const inputStyle = { background:"rgba(255,255,255,0.04)", border:"1px solid rgba(180,60,30,0.4)", borderRadius:3, padding:"14px 16px", color:"#e0cece", fontFamily:"'IM Fell English',Georgia,serif", fontSize:"1rem", width:"100%", marginBottom:20, transition:"border-color 0.3s", lineHeight:1.7 };
  const labelStyle = { fontFamily:"'DM Sans',sans-serif", fontSize:"0.65rem", color:"#a07060", letterSpacing:"0.18em", textTransform:"uppercase", display:"block", marginBottom:10, fontWeight:300 };
  const bigBtn = { background:"#c02818", border:"3px solid #ff6644", color:"#ffffff", WebkitTextFillColor:"#ffffff", padding:"18px 0", width:"100%", borderRadius:4, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontSize:"1rem", letterSpacing:"0.2em", textTransform:"uppercase", fontWeight:700, boxShadow:"0 4px 20px rgba(180,40,20,0.4)", transition:"all 0.25s ease" };
  const hoverCard = (e, on) => { e.currentTarget.style.background = on ? "rgba(60,18,10,0.95)" : "rgba(35,12,8,0.8)"; e.currentTarget.style.borderColor = on ? "#e05030" : "rgba(180,60,30,0.3)"; e.currentTarget.style.transform = on ? "translateX(5px)" : "translateX(0)"; };

  // ━━━ LANDING ━━━
  if (screen === "landing") return (
    <div style={{ minHeight:"100vh", background:"#1a0808", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden" }}>
      <TheVoid />
      <style>{GLOBAL_CSS}</style>

      {/* BOOKMARK BANNER */}
      {showBookmark && (
        <div style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, background:"linear-gradient(135deg, #c02818, #8a1810)", padding:"14px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, animation:"bookmarkPulse 3s ease-in-out infinite" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:"1.2rem" }}>🔖</span>
            <div>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:"0.82rem", color:"#ffffff", marginBottom:2 }}>Bookmark this page now!</p>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.72rem", color:"rgba(255,255,255,0.8)" }}>This URL is your permanent key. Save it or you will lose access.</p>
            </div>
          </div>
          <div style={{ display:"flex", gap:8, flexShrink:0 }}>
            <button onClick={() => navigator.clipboard?.writeText(window.location.href)} style={{ background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.3)", color:"#fff", padding:"8px 14px", borderRadius:4, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontSize:"0.72rem", fontWeight:700 }}>Copy Link</button>
            <button onClick={() => setShowBookmark(false)} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.7)", cursor:"pointer", fontSize:"1.1rem", padding:"4px 8px" }}>✕</button>
          </div>
        </div>
      )}

      <div style={{ position:"relative", zIndex:1, textAlign:"center", padding: showBookmark ? "90px 24px 40px" : "40px 24px", maxWidth:520, width:"100%", opacity:fadeIn?1:0, transition:"opacity 1.5s ease" }}>
        {/* Premium badge */}
        <div style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"6px 16px", border:"1px solid rgba(200,80,40,0.5)", borderRadius:20, marginBottom:28, background:"rgba(140,30,10,0.2)" }}>
          <span style={{ color:"#f06040", fontSize:"0.6rem" }}>👁</span>
          <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.62rem", color:"#f06040", letterSpacing:"0.2em", textTransform:"uppercase", fontWeight:400 }}>Premium Member</span>
          <span style={{ color:"#f06040", fontSize:"0.6rem" }}>👁</span>
        </div>

        {/* Eye orb */}
        <div style={{ width:200, height:200, borderRadius:"50%", margin:"0 auto 20px", background:"radial-gradient(circle at 45% 42%, rgba(120,20,20,0.4) 0%, rgba(60,8,8,0.15) 50%, transparent 75%)", border:"1.5px solid rgba(160,40,20,0.25)", animation:"voidFloat 7s ease-in-out infinite", display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
          <div style={{ position:"absolute", width:130, height:130, borderRadius:"50%", border:"0.5px solid rgba(160,40,20,0.15)", animation:"ringR 22s linear infinite" }} />
          <div style={{ position:"absolute", width:174, height:174, borderRadius:"50%", border:"0.5px solid rgba(120,20,10,0.1)", animation:"ringL 36s linear infinite" }} />
          <EyeOrb size={200} />
          <span style={{ fontSize:"4rem", position:"absolute", animation:"eyePulse 4s infinite", zIndex:2 }}>👁</span>
        </div>

        <div style={{ width:70, height:1, background:"linear-gradient(90deg,transparent,#c05030,transparent)", margin:"14px auto" }} />
        <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:300, fontSize:"0.6rem", color:"#a07060", letterSpacing:"0.35em", textTransform:"uppercase", marginBottom:14 }}>AI Dream Analysis</p>
        <h1 style={{ fontFamily:"'IM Fell English',Georgia,serif", fontWeight:400, fontSize:"clamp(2.8rem,8vw,4rem)", color:"#e0cece", letterSpacing:"0.06em", lineHeight:1.1, marginBottom:6 }}>Dream<br/>Decoder</h1>
        <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.7rem", color:"#f06040", letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:18 }}>Premium Edition</p>
        <div style={{ width:70, height:1, background:"linear-gradient(90deg,transparent,#c05030,transparent)", margin:"0 auto 20px" }} />
        <p style={{ fontFamily:"'IM Fell English',Georgia,serif", fontStyle:"italic", fontSize:"1.05rem", color:"#c09080", margin:"0 auto 44px", maxWidth:380, lineHeight:1.9 }}>
          Unlimited decoding. Deeper readings.<br/>Exclusive channels unavailable to others.
        </p>
        <button onClick={() => setScreen("onboard")} style={bigBtn}>Enter the Void</button>
      </div>
    </div>
  );

  // ━━━ ONBOARDING ━━━
  if (screen === "onboard") return (
    <div style={{ minHeight:"100vh", background:"#1a0808", display:"flex", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden" }}>
      <TheVoid />
      <style>{GLOBAL_CSS}</style>
      <div style={{ position:"relative", zIndex:1, width:"100%", maxWidth:460, padding:"40px 24px", opacity:fadeIn?1:0, transition:"opacity 1s ease" }}>
        <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:300, fontSize:"0.6rem", color:"#a07060", letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:12 }}>Premium Calibration</p>
        <h2 style={{ fontFamily:"'IM Fell English',Georgia,serif", fontWeight:400, fontSize:"clamp(1.5rem,4vw,2rem)", color:"#e0cece", marginBottom:10, lineHeight:1.3 }}>Who has come to the threshold?</h2>
        <p style={{ fontFamily:"'IM Fell English',Georgia,serif", fontStyle:"italic", fontSize:"1rem", color:"#c09080", marginBottom:32, lineHeight:1.8 }}>The more you share, the more we can see.</p>
        <label style={labelStyle}>Your name <span style={{opacity:0.4}}>(optional)</span></label>
        <input type="text" placeholder="First name" value={userName} onChange={e => setUserName(e.target.value)} style={inputStyle} />
        <label style={labelStyle}>Your waking state <span style={{opacity:0.4}}>(optional)</span></label>
        <input type="text" placeholder="What weighs on you in waking life..." value={currentMood} onChange={e => setCurrentMood(e.target.value)} style={inputStyle} />
        <button onClick={() => setScreen("oracle")} style={bigBtn}>Cross the Threshold →</button>
      </div>
    </div>
  );

  // ━━━ ORACLE ━━━
  if (screen === "oracle") return (
    <div style={{ minHeight:"100vh", background:"#1a0808", position:"relative", overflow:"hidden" }}>
      <TheVoid />
      <style>{GLOBAL_CSS}</style>
      <div style={{ position:"relative", zIndex:1, maxWidth:540, margin:"0 auto", padding:"52px 24px", opacity:fadeIn?1:0, transition:"opacity 1s ease" }}>
        <div style={{ textAlign:"center", marginBottom:40 }}>
          {/* Premium badge */}
          <div style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"4px 14px", border:"1px solid rgba(200,80,40,0.4)", borderRadius:20, marginBottom:16, background:"rgba(140,30,10,0.15)" }}>
            <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.58rem", color:"#f06040", letterSpacing:"0.18em", textTransform:"uppercase" }}>Unlimited Access</span>
          </div>
          <div style={{ fontSize:"2rem", marginBottom:12, animation:"eyePulse 4s infinite" }}>👁</div>
          <h2 style={{ fontFamily:"'IM Fell English',Georgia,serif", fontWeight:400, fontSize:"clamp(1.3rem,4vw,1.7rem)", color:"#e0cece", lineHeight:1.4 }}>
            {userName ? `${userName}. What have you brought from the dark?` : "What have you brought from the dark?"}
          </h2>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {DREAM_TYPES.map((type, i) => (
            <button key={type.id} onClick={() => setScreen(`describe_${type.id}`)}
              onMouseEnter={e => hoverCard(e, true)} onMouseLeave={e => hoverCard(e, false)}
              style={{ background:"rgba(35,12,8,0.8)", border:`1px solid ${type.exclusive ? "rgba(160,120,20,0.35)" : "rgba(180,60,30,0.3)"}`, borderRadius:2, padding:"20px 22px", display:"flex", alignItems:"center", gap:18, cursor:"pointer", textAlign:"left", transition:"all 0.3s ease", animation:`cardIn 0.4s ease ${i*0.06}s both` }}>
              <span style={{ fontSize:"1.3rem", width:40, textAlign:"center", color: type.exclusive ? "#c09020" : "#e05030" }}>{type.icon}</span>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                  <p style={{ fontFamily:"'IM Fell English',Georgia,serif", color:"#e0cece", fontSize:"1.05rem" }}>{type.label}</p>
                  {type.exclusive && <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.48rem", color:"#c09020", letterSpacing:"0.12em", textTransform:"uppercase", border:"1px solid rgba(180,140,20,0.4)", padding:"2px 6px", borderRadius:10 }}>Exclusive</span>}
                </div>
                <p style={{ fontFamily:"'IM Fell English',Georgia,serif", fontStyle:"italic", color:"#b08070", fontSize:"0.88rem" }}>{type.description}</p>
              </div>
            </button>
          ))}
        </div>
        <div style={{ marginTop:36, textAlign:"center", fontFamily:"'DM Sans',sans-serif", fontWeight:300, fontSize:"0.58rem", color:"#6a4a4a", opacity:0.5 }}>Unlimited readings · No restrictions</div>
      </div>
    </div>
  );

  // ━━━ DESCRIBE ━━━
  if (screen.startsWith("describe_")) {
    const typeId = screen.replace("describe_", "");
    const type = DREAM_TYPES.find(d => d.id === typeId);
    const placeholders = { lastnight:"Tell me what happened. Where were you. Who or what was there. How it felt when you woke.", recurring:"Describe the recurring dream. What always happens. What changes. How you feel when you wake.", nightmare:"Tell me what frightened you. What images remain. How you felt in the dream and after.", symbol:"What was the image or symbol. Describe it precisely. What was happening around it.", lucid:"Describe your recent dream patterns. Have you ever known you were dreaming.", pastlife:"Tell me the dream. Did it feel different from normal dreams. What era or setting.", prophecy:"Describe the dream in detail. What happened. What images or symbols stood out. What feeling did it leave you with." };
    return (
      <div style={{ minHeight:"100vh", background:"#1a0808", display:"flex", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden" }}>
        <TheVoid />
        <style>{GLOBAL_CSS}</style>
        <div style={{ position:"relative", zIndex:1, width:"100%", maxWidth:520, padding:"40px 24px", opacity:fadeIn?1:0, transition:"opacity 1s ease" }}>
          <button onClick={() => setScreen("oracle")} style={{ background:"none", border:"none", color:"#a07060", fontFamily:"'DM Sans',sans-serif", fontSize:"0.72rem", cursor:"pointer", marginBottom:24, fontWeight:300, padding:0 }}>← Back</button>
          <span style={{ fontSize:"1.5rem", color: type?.exclusive ? "#c09020" : "#e05030", display:"block", marginBottom:10 }}>{type?.icon}</span>
          <h2 style={{ fontFamily:"'IM Fell English',Georgia,serif", fontWeight:400, fontSize:"clamp(1.5rem,4vw,2rem)", color:"#e0cece", lineHeight:1.3, marginBottom:8 }}>{type?.label}</h2>
          <p style={{ fontFamily:"'IM Fell English',Georgia,serif", fontStyle:"italic", color:"#c09080", marginBottom:28, lineHeight:1.8 }}>{type?.description}</p>
          <label style={labelStyle}>Describe it</label>
          <textarea placeholder={placeholders[typeId]} value={dreamDescription} onChange={e => setDreamDescription(e.target.value)} rows={6} style={{ ...inputStyle, resize:"vertical" }} />
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:300, fontSize:"0.62rem", color:"#806050", marginBottom:20, opacity:0.7 }}>The more detail, the deeper the reading</p>
          <button onClick={() => { if (dreamDescription.trim().length > 10) generateReading(type, dreamDescription); }}
            disabled={dreamDescription.trim().length < 10}
            style={{ ...bigBtn, opacity: dreamDescription.trim().length >= 10 ? 1 : 0.35, cursor: dreamDescription.trim().length >= 10 ? "pointer" : "not-allowed" }}
          >Decode This Dream →</button>
        </div>
      </div>
    );
  }

  // ━━━ READING ━━━
  if (screen === "reading") return (
    <div style={{ minHeight:"100vh", background:"#1a0808", position:"relative", overflow:"hidden" }}>
      <TheVoid active={loading} />
      <style>{GLOBAL_CSS}</style>
      <div style={{ position:"relative", zIndex:1, maxWidth:620, margin:"0 auto", padding:"50px 24px", opacity:fadeIn?1:0, transition:"opacity 1s ease" }}>
        <button onClick={() => setScreen("oracle")} style={{ background:"none", border:"none", color:"#a07060", fontFamily:"'DM Sans',sans-serif", fontSize:"0.72rem", cursor:"pointer", marginBottom:32, fontWeight:300, padding:0 }}>← Another dream</button>
        <div style={{ marginBottom:28, animation:"fadeUp 0.6s ease both" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:300, fontSize:"0.6rem", color:"#a07060", letterSpacing:"0.22em", textTransform:"uppercase" }}>{selectedType?.label}</p>
            {selectedType?.exclusive && <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.48rem", color:"#c09020", letterSpacing:"0.12em", textTransform:"uppercase", border:"1px solid rgba(180,140,20,0.4)", padding:"2px 6px", borderRadius:10 }}>Exclusive</span>}
          </div>
          <div style={{ width:40, height:1, background:"linear-gradient(90deg,#c05030,transparent)", marginBottom:8 }} />
          <p style={{ fontFamily:"'IM Fell English',Georgia,serif", fontStyle:"italic", fontSize:"0.85rem", color:"#a07060" }}>{new Date().toLocaleDateString("en-GB",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</p>
        </div>
        {loading && <VoidLoader />}
        {!loading && reading && (
          <div style={{ animation:"fadeUp 0.8s ease both" }}>
            <TypewriterText text={reading} speed={20} />
            <div style={{ marginTop:44, paddingTop:28, borderTop:"1px solid rgba(180,60,30,0.25)", display:"flex", gap:12, flexWrap:"wrap" }}>
              {[{label:"Copy reading",action:()=>navigator.clipboard?.writeText(reading)},{label:"↻ Decode again",action:()=>{setScreen(`describe_${selectedType?.id}`);setDreamDescription("");}}].map(b=>(
                <button key={b.label} onClick={b.action}
                  onMouseEnter={e=>{e.target.style.borderColor="#e05030";e.target.style.color="#e0cece";}}
                  onMouseLeave={e=>{e.target.style.borderColor="rgba(180,60,30,0.3)";e.target.style.color="#a07060";}}
                  style={{ background:"none", border:"1px solid rgba(180,60,30,0.3)", color:"#a07060", padding:"11px 22px", borderRadius:2, fontFamily:"'DM Sans',sans-serif", fontSize:"0.72rem", fontWeight:300, cursor:"pointer", transition:"all 0.3s ease" }}>{b.label}</button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return null;
}
