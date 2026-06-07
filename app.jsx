/* ===================================================================
   App shell — orchestrates steps, autoplay, scaling, and composites
   the anatomy/equipment stage + scope PiP + caption + controls.
   =================================================================== */
(function(){
const { useState, useEffect, useRef, useCallback } = React;

const STEPS = window.STEPS, CHAPTERS = window.CHAPTERS;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "wireColor": "blue",
  "cameraSide": "left",
  "showCamera": true,
  "showLabels": true,
  "gaugeSide": "right",
  "autoSpeed": 4.2
}/*EDITMODE-END*/;

const WIRE_COLORS = {
  blue:   { dark:"#14439e", main:"#2563eb", lite:"#6ea8ff" },
  green:  { dark:"#137a42", main:"#1f9d55", lite:"#2ec06a" },
  violet: { dark:"#5b21b6", main:"#7c3aed", lite:"#a78bfa" },
  amber:  { dark:"#a85b00", main:"#e08a1e", lite:"#f6c061" },
};

function describeArc(cx,cy,r,a0,a1){
  const polar=(c,d,rr,deg)=>{const a=(deg-90)*Math.PI/180;return {x:c+rr*Math.cos(a),y:d+rr*Math.sin(a)};};
  const s=polar(cx,cy,r,a1),e=polar(cx,cy,r,a0);
  const large=a1-a0<=180?"0":"1";
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 0 ${e.x} ${e.y}`;
}
/* red zone drawn in the SAME convention as the needle/ticks
   (atm -> angle = -210 + v/30*240, math degrees) */
function redZoneArc(cx,cy,r,v0,v1,w){
  const pt=(v)=>{const a=(-210+(Math.min(v,30)/30)*240)*Math.PI/180;
    return [cx+Math.cos(a)*r, cy+Math.sin(a)*r];};
  const [x0,y0]=pt(v0), [x1,y1]=pt(v1);
  return <path d={`M ${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1}`}
               stroke="#d6453a" strokeWidth={w} fill="none" opacity=".9"/>;
}

function Icon({name}){
  const p = {
    play:  <path d="M6 4l13 8-13 8z"/>,
    pause: <g><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></g>,
    prev:  <path d="M15 5l-8 7 8 7M9 5v14" strokeWidth="2.2" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>,
    next:  <path d="M9 5l8 7-8 7M15 5v14" strokeWidth="2.2" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>,
    replay:<path d="M4 12a8 8 0 1 0 2.3-5.6M4 4v4h4" strokeWidth="2.2" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>,
  }[name];
  const filled = name==="play"||name==="pause";
  return <svg width="20" height="20" viewBox="0 0 24 24" fill={filled?"currentColor":"none"}>{p}</svg>;
}

function App(){
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const wire = WIRE_COLORS[t.wireColor] || WIRE_COLORS.blue;
  const AUTO_MS = Math.round((t.autoSpeed||4.2) * 1000);

  const [i, setI] = useState(()=>{
    const s = parseInt(localStorage.getItem("cysto_step")||"0",10);
    return isNaN(s)?0:Math.max(0,Math.min(STEPS.length-1,s));
  });
  const [playing, setPlaying] = useState(false);
  const [prog, setProg] = useState(0);
  const raf = useRef(null), t0 = useRef(0);

  const step = STEPS[i];
  const atEnd = i >= STEPS.length-1;

  useEffect(()=>{ localStorage.setItem("cysto_step", String(i)); }, [i]);

  // autoplay timer
  useEffect(()=>{
    if(!playing) return;
    t0.current = performance.now();
    setProg(0);
    const tick = (now)=>{
      const p = Math.min(1, (now - t0.current)/AUTO_MS);
      setProg(p);
      if(p >= 1){
        if(i < STEPS.length-1){ setI(i+1); }
        else { setPlaying(false); setProg(0); return; }
      } else {
        raf.current = requestAnimationFrame(tick);
      }
    };
    raf.current = requestAnimationFrame(tick);
    return ()=> cancelAnimationFrame(raf.current);
  }, [playing, i, AUTO_MS]);

  const go = useCallback((n)=>{
    setI(Math.max(0, Math.min(STEPS.length-1, n)));
    setProg(0);
  },[]);

  const togglePlay = ()=>{
    if(atEnd && !playing){ go(0); setPlaying(true); return; }
    setPlaying(p=>!p);
  };

  // keyboard
  useEffect(()=>{
    const h=(e)=>{
      if(e.key==="ArrowRight"){ setPlaying(false); go(i+1); }
      else if(e.key==="ArrowLeft"){ setPlaying(false); go(i-1); }
      else if(e.key===" "){ e.preventDefault(); togglePlay(); }
    };
    window.addEventListener("keydown",h);
    return ()=>window.removeEventListener("keydown",h);
  },[i, playing, atEnd]);

  const ch = step.chapter;

  return (
    <div className="app">
      {/* header */}
      <header className="hdr">
        <div className="col" style={{gap:0}}>
          <div className="wordmark"><span className="h1c">Henry</span> <span className="fc">Ford</span> <span className="h2c">Health</span></div>
          <div className="hdr-sub">Urology · Endoscopic Procedure Guide</div>
        </div>
        <div className="hdr-spacer"></div>
        <div className="kit-pill">Cystoscopy + Balloon Dilation</div>
      </header>

      {/* chapter rail */}
      <nav className="chapters">
        {CHAPTERS.map((c,ci)=>(
          <div key={ci} className={"chip "+(ci===ch?"active":(ci<ch?"done":""))}>{c}</div>
        ))}
      </nav>

      {/* stage */}
      <div className="stage">
        <div className="scene-badge">{step.scene==="equipment"?"Setup · Bench":"Sagittal cross-section"}</div>
        {step.scene==="equipment"
          ? <Equipment step={step} wire={wire}/>
          : <Anatomy step={step} wire={wire} showLabels={t.showLabels}/>}

        {/* scope PiP */}
        {t.showCamera && step.cam && step.cam.mode!=="off" && (
          <div className={"pip "+(t.cameraSide==="right"?"right":"left")}>
            <div className="pip-cap">CYSTOSCOPE VIEW</div>
            <ScopeView cam={step.cam} wire={wire}/>
          </div>
        )}

        {/* inflator gauge inset during dilation */}
        {step.anat && step.anat.gauge && (
          <GaugeInset pressure={step.anat.pressure||0} hold={step.anat.hold}
                      rep={step.anat.rep} side={t.gaugeSide}/>
        )}
      </div>

      {/* caption */}
      <section className="caption">
        <div className="fade-key" key={i}>
          <div className="cap-top">
            <span className="step-num">{String(i+1).padStart(2,"0")} / {STEPS.length}</span>
            <span className="cap-chapter">{CHAPTERS[ch]}</span>
          </div>
          <h2 className="cap-title" dangerouslySetInnerHTML={{__html:step.title}}/>
          <p className="cap-body" dangerouslySetInnerHTML={{__html:step.body}}/>
          <div className="callouts-list">
            {(step.tags||[]).map((t,ti)=>(
              <span key={ti} className={"tag"+(t.crit?" crit":"")+(t.mono?" mono":"")}>
                <span className="ic"></span>{t.text}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* controls */}
      <div className="controls">
        <div className="scrub">
          {STEPS.map((_,si)=>(
            <div key={si}
                 className={"seg "+(si<i?"done":(si===i?"active":""))}
                 onClick={()=>{ setPlaying(false); go(si); }}
                 style={{cursor:"pointer"}}>
              <i style={ si===i ? {width:(playing?prog*100:0)+"%"} : {} }></i>
            </div>
          ))}
        </div>
        <div className="ctl-row">
          <button className="btn nav" onClick={()=>{ setPlaying(false); go(i-1); }} disabled={i===0}>
            <Icon name="prev"/> Prev
          </button>
          <button className="btn play" onClick={togglePlay}>
            <Icon name={atEnd && !playing ? "replay" : (playing?"pause":"play")}/>
            {atEnd && !playing ? "Replay" : (playing?"Pause":"Play")}
          </button>
          <button className="btn nav" onClick={()=>{ setPlaying(false); go(i+1); }} disabled={atEnd}>
            Next <Icon name="next"/>
          </button>
        </div>
      </div>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Guidewire"/>
        <TweakColor label="Wire color" value={wireSwatch(t.wireColor)}
          options={["#2563eb","#1f9d55","#7c3aed","#e08a1e"]}
          onChange={(v)=>setTweak("wireColor", SWATCH_TO_KEY[v]||"blue")}/>

        <TweakSection label="Cystoscope view"/>
        <TweakToggle label="Show camera view" value={t.showCamera}
          onChange={(v)=>setTweak("showCamera", v)}/>
        <TweakRadio label="Camera position" value={t.cameraSide}
          options={["left","right"]} onChange={(v)=>setTweak("cameraSide", v)}/>

        <TweakSection label="Inflator gauge"/>
        <TweakRadio label="Gauge position" value={t.gaugeSide}
          options={["left","right"]} onChange={(v)=>setTweak("gaugeSide", v)}/>

        <TweakSection label="Diagram & playback"/>
        <TweakToggle label="Show callout labels" value={t.showLabels}
          onChange={(v)=>setTweak("showLabels", v)}/>
        <TweakSlider label="Auto-play step time" value={t.autoSpeed}
          min={2.5} max={8} step={0.1} unit="s"
          onChange={(v)=>setTweak("autoSpeed", v)}/>
      </TweaksPanel>
    </div>
  );
}

const SWATCH_TO_KEY = {"#2563eb":"blue","#1f9d55":"green","#7c3aed":"violet","#e08a1e":"amber"};
function wireSwatch(key){
  return {blue:"#2563eb",green:"#1f9d55",violet:"#7c3aed",amber:"#e08a1e"}[key]||"#2563eb";
}

function GaugeInset({pressure,hold,rep,side}){
  const pos = side==="left" ? {left:18} : {right:18};
  return (
    <div className="gauge-inset" style={{
      position:"absolute", bottom:18, ...pos, width:150, height:150,
      background:"rgba(255,255,255,.96)", border:"1px solid var(--line)",
      borderRadius:16, boxShadow:"var(--shadow)", display:"flex",
      flexDirection:"column", alignItems:"center", justifyContent:"center", gap:2,
    }}>
      <div style={{position:"absolute",top:9,fontFamily:"var(--mono)",fontSize:8.5,
        letterSpacing:".14em",color:"#96a6b4"}}>INFLATOR</div>
      <svg viewBox="0 0 120 120" style={{width:118,height:94,marginTop:6}}>
        <GaugeFace pressure={pressure}/>
      </svg>
      <div style={{fontFamily:"var(--mono)",fontSize:11.5,fontWeight:600,color:"#0067b1",letterSpacing:".06em"}}>
        {pressure>0 ? pressure+" atm" : "0 atm"}{rep?`  · T${rep}`:""}
      </div>
      {hold && <div style={{fontFamily:"var(--mono)",fontSize:9,color:"#c0392b",letterSpacing:".1em"}}>HOLD 30s</div>}
    </div>
  );
}

function GaugeFace({pressure}){
  const cx=60, cy=64, r=44;
  const ang = (-210 + (Math.min(pressure,30)/30)*240) * Math.PI/180;
  const nx = cx + Math.cos(ang)*(r-8), ny = cy + Math.sin(ang)*(r-8);
  const ticks=[];
  for(let k=0;k<=6;k++){
    const ta=(-210+(k/6)*240)*Math.PI/180;
    const v=k*5;
    ticks.push(<line key={k} x1={cx+Math.cos(ta)*(r-2)} y1={cy+Math.sin(ta)*(r-2)}
      x2={cx+Math.cos(ta)*(r-8)} y2={cy+Math.sin(ta)*(r-8)} stroke="#33424f" strokeWidth="1.5"/>);
    ticks.push(<text key={"t"+k} x={cx+Math.cos(ta)*(r-16)} y={cy+Math.sin(ta)*(r-16)+3}
      textAnchor="middle" fontFamily="var(--mono)" fontSize="7" fill="#5a6b2e">{v}</text>);
  }
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#f4f7e6" stroke="#2b3a48" strokeWidth="3"/>
      {redZoneArc(cx,cy,r-3,22,30,"3.5")}
      {ticks}
      <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="#c0392b" strokeWidth="2.6"
            strokeLinecap="round" style={{transition:"all .8s cubic-bezier(.45,.05,.2,1)"}}/>
      <circle cx={cx} cy={cy} r="3.6" fill="#2b3a48"/>
    </g>
  );
}

/* ---- scaler: scaled "card" on desktop, full-bleed fluid layout on phones ----
   On narrow screens the fixed 820×1180 card would scale down to ~0.45 and
   float in the middle with big margins. Instead we let the frame fill the
   viewport at native size so the content is legible without zooming. */
function fit(){
  const f=document.getElementById("frame");
  const vw=window.innerWidth, vh=window.innerHeight;
  // phones / narrow viewports → fill the screen, no scaling
  if(vw < 760){
    f.classList.add("fluid");
    f.style.transform="none";
    return;
  }
  f.classList.remove("fluid");
  const pad=24;
  const s=Math.min((vw-pad)/820,(vh-pad)/1180);
  f.style.transform=`scale(${s})`;
}
window.addEventListener("resize",fit);
window.addEventListener("orientationchange",fit);
fit();

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
})();
