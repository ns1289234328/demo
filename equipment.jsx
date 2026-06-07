/* ===================================================================
   Equipment — schematic setup illustrations for the Setup chapter,
   plus the Encore inflator with live pressure gauge used during
   dilation steps.
   =================================================================== */
(function(){

function Equipment({ step, wire }){
  wire = wire || { dark:"#14439e", main:"#2563eb", lite:"#6ea8ff" };
  const which = step.equip || "overview";
  return (
    <svg className="stage-svg" viewBox="0 0 820 700" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="eqScope" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff"/><stop offset="100%" stopColor="#e3e8ee"/>
        </linearGradient>
        <linearGradient id="eqInflator" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a4f6b"/><stop offset="100%" stopColor="#22344b"/>
        </linearGradient>
        <linearGradient id="eqInflatorBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5b76a0"/>
          <stop offset="100%" stopColor="#34547d"/>
        </linearGradient>
        <radialGradient id="eqBalloon" cx="40%" cy="34%" r="70%">
          <stop offset="0%" stopColor="#cfe9fa"/><stop offset="100%" stopColor="#6aa6d6"/>
        </radialGradient>
        <filter id="eqshadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="5" stdDeviation="7" floodColor="#1a2b3c" floodOpacity="0.16"/>
        </filter>
      </defs>
      <rect x="0" y="0" width="820" height="700" fill="none"/>
      {which==="overview"   && <EquipOverview wire={wire}/>}
      {which==="irrigation" && <EquipIrrigation wire={wire}/>}
      {which==="prime"      && <EquipPrime/>}
      {which==="connect"    && <EquipConnect wire={wire}/>}
    </svg>
  );
}

/* ---------- shared sub-drawings ---------- */
function Inflator({x,y,scale=1,pressure=0,highlightButton,highlightPlunger,highlightLuer}){
  // gun-shaped inflator, barrel pointing right
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} filter="url(#eqshadow)">
      {/* barrel / syringe body */}
      <rect x="0" y="-26" width="190" height="52" rx="12" fill="url(#eqInflatorBody)"
            stroke="#24405f" strokeWidth="2"/>
      <rect x="14" y="-15" width="150" height="30" rx="7" fill="#cfe0f2" opacity=".5"/>
      {/* plunger to the left */}
      <rect x="-78" y="-9" width="82" height="18" rx="6"
            fill={highlightPlunger?"#7fd6ef":"#46617f"} stroke="#24405f" strokeWidth="2"/>
      <g>
        <path d="M -78 -22 q -22 22 0 44" fill={highlightPlunger?"#3fa7dc":"#46617f"}
              stroke="#24405f" strokeWidth="2"/>
      </g>
      {highlightPlunger && <text x="-96" y="-30" textAnchor="middle" fontFamily="var(--mono)"
        fontSize="12" fontWeight="600" fill="#0067b1">pull</text>}
      {/* inflate/deflate button (yellow) */}
      <rect x="120" y="20" width="40" height="20" rx="6"
            fill={highlightButton?"#ffd23f":"#f2c12e"} stroke="#b8911c" strokeWidth="2"
            className={highlightButton?"eq-pulse":""}/>
      {highlightButton && <text x="140" y="62" textAnchor="middle" fontFamily="var(--font)"
        fontSize="12" fontWeight="700" fill="#9a6a00">press &amp; hold</text>}
      {/* gauge head on top */}
      <Gauge x={150} y={-58} r={40} pressure={pressure}/>
      {/* nozzle + luer */}
      <rect x="190" y="-7" width="26" height="14" rx="3" fill="#9fb4c9" stroke="#24405f" strokeWidth="1.5"/>
      <rect x="216" y="-9" width="16" height="18" rx="3"
            fill={highlightLuer?"#7fd6ef":"#c7d4e2"} stroke="#24405f" strokeWidth="1.5"/>
    </g>
  );
}

function Gauge({x,y,r,pressure=0}){
  // needle sweeps 0..30 atm across ~240°
  const ang = (-210 + (Math.min(pressure,30)/30)*240) * Math.PI/180;
  const nx = x + Math.cos(ang)*(r-9), ny = y + Math.sin(ang)*(r-9);
  const ticks = [];
  for(let i=0;i<=6;i++){
    const ta=(-210 + (i/6)*240)*Math.PI/180;
    ticks.push(
      <line key={i} x1={x+Math.cos(ta)*(r-3)} y1={y+Math.sin(ta)*(r-3)}
            x2={x+Math.cos(ta)*(r-9)} y2={y+Math.sin(ta)*(r-9)}
            stroke="#33424f" strokeWidth="1.6"/>
    );
  }
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill="#f4f7e6" stroke="#2b3a48" strokeWidth="3"/>
      <circle cx={x} cy={y} r={r} fill="none" stroke="#9fb04a" strokeWidth={r*0.5} opacity=".18"/>
      {/* red zone (high atm) — needle-convention */}
      {(()=>{const pt=(v)=>{const a=(-210+(v/30)*240)*Math.PI/180;return [x+Math.cos(a)*(r-2),y+Math.sin(a)*(r-2)];};
        const [x0,y0]=pt(22),[x1,y1]=pt(30);
        return <path d={`M ${x0} ${y0} A ${r-2} ${r-2} 0 0 1 ${x1} ${y1}`} stroke="#d6453a" strokeWidth="3.5" fill="none" opacity=".85"/>;})()}
      {ticks}
      <line x1={x} y1={y} x2={nx} y2={ny} stroke="#c0392b" strokeWidth="3"
            strokeLinecap="round" style={{transition:"all .7s cubic-bezier(.45,.05,.2,1)"}}/>
      <circle cx={x} cy={y} r="4" fill="#2b3a48"/>
      <text x={x} y={y+r-9} textAnchor="middle" fontFamily="var(--mono)" fontSize="9"
            fontWeight="600" fill="#5a6b2e">atm</text>
    </g>
  );
}
function polar(cx,cy,r,deg){const a=(deg-90)*Math.PI/180;return {x:cx+r*Math.cos(a),y:cy+r*Math.sin(a)};}
function describeArc(cx,cy,r,a0,a1){const s=polar(cx,cy,r,a1),e=polar(cx,cy,r,a0);
  const large=a1-a0<=180?"0":"1";return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 0 ${e.x} ${e.y}`;}

function Scope({x,y,scale=1}){
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} filter="url(#eqshadow)">
      {/* handle */}
      <rect x="0" y="-34" width="150" height="68" rx="26" fill="url(#eqScope)" stroke="#c2cdd8" strokeWidth="2"/>
      <circle cx="128" cy="-22" r="8" fill="#f2c12e" stroke="#b8911c" strokeWidth="1.5"/>
      <text x="60" y="6" fontFamily="var(--font)" fontSize="15" fontWeight="800" fill="#2b6cb0">Ambu</text>
      {/* irrigation luer-lock port (proximal) */}
      <rect x="38" y="-50" width="20" height="18" rx="3" fill="#9fb4c9" stroke="#24405f" strokeWidth="1.4"/>
      <rect x="40" y="-58" width="16" height="10" rx="2" fill="#c7d4e2" stroke="#24405f" strokeWidth="1.4"/>
      {/* green strain relief */}
      <rect x="-30" y="-12" width="36" height="24" rx="8" fill="#9bd11f" stroke="#7caa16" strokeWidth="1.5"/>
      {/* insertion cord */}
      <path d="M -30 0 q -120 6 -210 70" fill="none" stroke="#2b3440" strokeWidth="7" strokeLinecap="round"/>
    </g>
  );
}

function Balloon2({x,y,scale=1,inflate=1}){
  const r=6+inflate*14;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <line x1="-120" y1="0" x2="150" y2="0" stroke="#c9b48d" strokeWidth="7" strokeLinecap="round"/>
      <path d={`M -36 0 L -22 ${-r} L 22 ${-r} L 36 0 L 22 ${r} L -22 ${r} Z`}
            fill="url(#eqBalloon)" stroke="#3f7fb4" strokeWidth="1.6"/>
      <line x1="-22" y1={-r-2} x2="-22" y2={r+2} stroke="#2c3a47" strokeWidth="2"/>
      <line x1="22"  y1={-r-2} x2="22"  y2={r+2} stroke="#2c3a47" strokeWidth="2"/>
    </g>
  );
}

/* ---------- overview ---------- */
function NumBadge({x,y,n}){
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle cx="0" cy="0" r="15" fill="#0067b1" stroke="#fff" strokeWidth="2.5"/>
      <text x="0" y="5" textAnchor="middle" fontFamily="var(--font)" fontSize="15"
            fontWeight="800" fill="#fff">{n}</text>
    </g>
  );
}
function ItemCap({x,y,t,s,anchor="middle"}){
  return (
    <g transform={`translate(${x} ${y})`} textAnchor={anchor}>
      <text x="0" y="0" fontFamily="var(--font)" fontSize="15" fontWeight="800" fill="#11293c">{t}</text>
      <text x="0" y="17" fontFamily="var(--font)" fontSize="12.5" fontWeight="500" fill="#496175">{s}</text>
    </g>
  );
}
function EquipOverview({wire}){
  wire = wire || {dark:"#137a42",main:"#2ec06a"};
  return (
    <g>
      {/* 1 · scope */}
      <Scope x={250} y={108} scale={0.8}/>
      {/* luer-port callout */}
      <line x1="290" y1="62" x2="318" y2="44" stroke="#7a8a99" strokeWidth="1.4"/>
      <circle cx="290" cy="62" r="2.4" fill="#7a8a99"/>
      <text x="322" y="48" fontFamily="var(--mono)" fontSize="11" fontWeight="600" fill="#5a6b7a">irrigation luer-lock</text>
      <NumBadge x={372} y={74} n={1}/>
      <ItemCap x={250} y={170} t="Ambu A4 cystoscope" s="Single-use flexible scope"/>
      {/* 2 · balloon */}
      <Balloon2 x={585} y={232} scale={0.92} inflate={1}/>
      <NumBadge x={585} y={196} n={2}/>
      <ItemCap x={585} y={278} t="UroMax 24 Fr × 4 cm" s="Balloon dilation catheter"/>
      {/* 3 · inflator */}
      <Inflator x={120} y={372} scale={0.6} pressure={0}/>
      <NumBadge x={150} y={300} n={3}/>
      <ItemCap x={188} y={432} t="Encore inflator" s="Pressure device + gauge"/>
      {/* 4 · wire */}
      <path d="M 470 470 q 150 -8 250 26" fill="none" stroke={wire.dark} strokeWidth="4" strokeLinecap="round"/>
      <path d="M 470 470 q 150 -8 250 26" fill="none" stroke={wire.main} strokeWidth="1.8" strokeLinecap="round"/>
      <NumBadge x={470} y={470} n={4}/>
      <ItemCap x={610} y={520} t="0.035″ Sensor wire" s="Straight hydrophilic tip"/>
      {/* 5 · manifold */}
      <TuohyManifold x={470} y={585} scale={0.86}/>
      <NumBadge x={398} y={560} n={5}/>
      <ItemCap x={300} y={636} t="Tuohy-Borst manifold" s="3-way stopcock + irrigation" anchor="end"/>
    </g>
  );
}

/* ---------- prime ---------- */
function EquipPrime(){
  return (
    <g>
      {/* saline basin */}
      <g filter="url(#eqshadow)">
        <path d="M 120 470 h 240 l -20 90 h -200 Z" fill="#d9edf8" stroke="#9cc6e2" strokeWidth="2"/>
        <ellipse cx="240" cy="470" rx="120" ry="22" fill="#bfe0f1" stroke="#9cc6e2" strokeWidth="2"/>
        <ellipse cx="240" cy="470" rx="104" ry="16" fill="#e6f4fb"/>
        <text x="240" y="540" textAnchor="middle" fontFamily="var(--font)" fontSize="14"
              fontWeight="700" fill="#2b6cb0">Saline</text>
      </g>
      {/* inflator dipped, tip in basin */}
      <Inflator x={300} y={300} scale={0.74} pressure={0} highlightButton highlightPlunger highlightLuer/>
      {/* draw arrow from luer down into basin */}
      <path d="M 520 300 q 30 90 -180 150" fill="none" stroke="#0067b1" strokeWidth="2.5"
            strokeDasharray="6 5"/>
      {/* up arrow on plunger */}
      <g stroke="#0067b1" strokeWidth="3" fill="none">
        <path d="M 196 250 l 0 -54"/><path d="M 184 214 l 12 -18 12 18"/>
      </g>
      <text x="196" y="180" textAnchor="middle" fontFamily="var(--font)" fontSize="13"
            fontWeight="700" fill="#0067b1">draw up fluid</text>
    </g>
  );
}

/* ---------- connect ---------- */
function EquipConnect({wire}){
  wire = wire || {dark:"#137a42",main:"#2ec06a"};
  return (
    <g>
      <Inflator x={120} y={300} scale={0.78} pressure={0} highlightLuer/>
      <Balloon2 x={560} y={430} scale={1.0} inflate={1}/>
      {/* connection line luer -> balloon port */}
      <path d="M 304 300 C 380 300 410 410 452 426" fill="none" stroke="#0067b1"
            strokeWidth="3" strokeDasharray="7 5"/>
      <circle cx="452" cy="426" r="6" fill="#0067b1"/>
      <text x="360" y="350" textAnchor="middle" fontFamily="var(--font)" fontSize="13"
            fontWeight="700" fill="#0067b1">Luer-lock → “Balloon” port</text>
      {/* wire port callout */}
      <g>
        <line x1="690" y1="430" x2="740" y2="400" stroke={wire.main} strokeWidth="3" strokeLinecap="round"/>
        <text x="744" y="396" fontFamily="var(--font)" fontSize="13" fontWeight="700" fill={wire.dark}>wire port (open)</text>
      </g>
    </g>
  );
}

/* Tuohy-Borst + 3-way stopcock + irrigation tubing schematic */
function TuohyManifold({x,y,scale=1}){
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} filter="url(#eqshadow)">
      {/* vertical Tuohy body */}
      <rect x="-14" y="-70" width="28" height="80" rx="8" fill="#eef3f8" stroke="#b9c7d4" strokeWidth="2"/>
      {/* compression cap */}
      <rect x="-20" y="-92" width="40" height="26" rx="7" fill="#d7e2ec" stroke="#9fb1c0" strokeWidth="2"/>
      {/* stopcock body */}
      <circle cx="0" cy="30" r="22" fill="#cfd9e4" stroke="#9fb1c0" strokeWidth="2"/>
      <rect x="-5" y="14" width="10" height="32" rx="3" fill="#2b6cb0"/>
      <rect x="-16" y="25" width="32" height="10" rx="3" fill="#2b6cb0"/>
      {/* irrigation tubing out the side */}
      <path d="M 22 30 q 70 0 120 50" fill="none" stroke="#bcd6e8" strokeWidth="8" strokeLinecap="round"/>
      <path d="M 22 30 q 70 0 120 50" fill="none" stroke="#e6f3fb" strokeWidth="3" strokeLinecap="round"/>
      <text x="0" y="-104" textAnchor="middle" fontFamily="var(--font)" fontSize="12"
            fontWeight="700" fill="#2b6cb0">Tuohy-Borst</text>
    </g>
  );
}

/* ---------- irrigation assembly on the cystoscope ----------
   The "completed setup" still + the common-error comparison.
   Correct order: scope luer-lock → Tuohy-Borst → 3-way stopcock → tubing */
function OrderBadge({x,y,n,bad}){
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle cx="0" cy="0" r="13" fill={bad?"#c0392b":"#0067b1"} stroke="#fff" strokeWidth="2.5"/>
      <text x="0" y="4.5" textAnchor="middle" fontFamily="var(--font)" fontSize="13"
            fontWeight="800" fill="#fff">{n}</text>
    </g>
  );
}
function StopcockH({x,y,scale=1}){
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <circle cx="0" cy="0" r="24" fill="#cfd9e4" stroke="#9fb1c0" strokeWidth="2"/>
      {/* three ports */}
      <rect x="-32" y="-7" width="14" height="14" rx="3" fill="#dbe4ee" stroke="#9fb1c0" strokeWidth="1.6"/>
      <rect x="18"  y="-7" width="14" height="14" rx="3" fill="#dbe4ee" stroke="#9fb1c0" strokeWidth="1.6"/>
      <rect x="-7" y="-32" width="14" height="14" rx="3" fill="#dbe4ee" stroke="#9fb1c0" strokeWidth="1.6"/>
      {/* turn lever */}
      <rect x="-5" y="2" width="10" height="24" rx="3" fill="#2b6cb0"/>
      <rect x="-15" y="10" width="30" height="9" rx="3" fill="#2b6cb0"/>
    </g>
  );
}
function ScopeBody({x,y,scale=1}){
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} filter="url(#eqshadow)">
      <rect x="0" y="-44" width="150" height="88" rx="26" fill="url(#eqScope)" stroke="#c2cdd8" strokeWidth="2"/>
      <rect x="-30" y="-14" width="36" height="28" rx="9" fill="#9bd11f" stroke="#7caa16" strokeWidth="1.5"/>
      <path d="M -30 0 q -70 8 -120 60" fill="none" stroke="#2b3440" strokeWidth="6" strokeLinecap="round"/>
      <circle cx="124" cy="-28" r="7" fill="#f2c12e" stroke="#b8911c" strokeWidth="1.5"/>
      <text x="62" y="6" fontFamily="var(--font)" fontSize="15" fontWeight="800" fill="#2b6cb0">Ambu A4</text>
      {/* irrigation luer-lock port on the proximal end */}
      <rect x="150" y="-9" width="22" height="18" rx="3" fill="#9fb4c9" stroke="#24405f" strokeWidth="1.6"/>
      <rect x="172" y="-12" width="14" height="24" rx="3" fill="#c7d4e2" stroke="#24405f" strokeWidth="1.6"/>
    </g>
  );
}

function EquipIrrigation({wire}){
  wire = wire || {dark:"#137a42",main:"#1f9d55"};
  return (
    <g>
      {/* ===================== COMPLETED SETUP (still) ===================== */}
      <text x="160" y="38" fontFamily="var(--font)" fontSize="15" fontWeight="800" fill="#11293c">Completed setup — correct order</text>

      {/* saline source, top-right */}
      <g filter="url(#eqshadow)">
        <rect x="612" y="78" width="160" height="92" rx="14" fill="#e6f4fb" stroke="#9cc6e2" strokeWidth="2"/>
        <rect x="612" y="78" width="160" height="26" rx="14" fill="#bfe0f1"/>
        <text x="692" y="132" textAnchor="middle" fontFamily="var(--font)" fontSize="14" fontWeight="800" fill="#2b6cb0">Irrigation</text>
        <text x="692" y="151" textAnchor="middle" fontFamily="var(--font)" fontSize="12" fontWeight="500" fill="#5a7388">saline source</text>
      </g>

      {/* scope (left), luer port at ~ (228, 250) */}
      <ScopeBody x={50} y={250} scale={1}/>

      {/* ---- Tuohy-Borst (horizontal) centered ~ (300,250) ---- */}
      {/* distal luer collar joining the scope port */}
      <rect x="222" y="241" width="16" height="18" rx="3" fill="#c7d4e2" stroke="#24405f" strokeWidth="1.6"/>
      {/* body */}
      <g filter="url(#eqshadow)">
        <rect x="238" y="232" width="96" height="36" rx="10" fill="#eef3f8" stroke="#b9c7d4" strokeWidth="2"/>
      </g>
      {/* knurled compression cap (wire seal) at the back */}
      <rect x="334" y="236" width="24" height="28" rx="6" fill="#d7e2ec" stroke="#9fb1c0" strokeWidth="2"/>
      <line x1="340" y1="240" x2="340" y2="260" stroke="#9fb1c0" strokeWidth="1.4"/>
      <line x1="346" y1="240" x2="346" y2="260" stroke="#9fb1c0" strokeWidth="1.4"/>
      <line x1="352" y1="240" x2="352" y2="260" stroke="#9fb1c0" strokeWidth="1.4"/>
      <text x="346" y="298" textAnchor="middle" fontFamily="var(--mono)" fontSize="10" fontWeight="600" fill="#5a6b7a">wire / seal cap</text>
      {/* side arm up to stopcock */}
      <rect x="278" y="184" width="16" height="52" rx="5" fill="#eef3f8" stroke="#b9c7d4" strokeWidth="2"/>

      {/* ---- 3-way stopcock on the Tuohy-Borst side arm ---- */}
      <StopcockH x={286} y={176} scale={1}/>

      {/* ---- irrigation tubing: stopcock → saline ---- */}
      <path d="M 304 152 C 380 96 520 110 660 132" fill="none" stroke="#bcd6e8" strokeWidth="9" strokeLinecap="round"/>
      <path d="M 304 152 C 380 96 520 110 660 132" fill="none" stroke="#e6f3fb" strokeWidth="3.5" strokeLinecap="round"/>

      {/* order badges + labels */}
      <OrderBadge x={228} y={224} n={1}/>
      <line x1="228" y1="237" x2="228" y2="300" stroke="#7a8a99" strokeWidth="1.3"/>
      <text x="228" y="318" textAnchor="middle" fontFamily="var(--font)" fontSize="12.5" fontWeight="700" fill="#11293c">Scope luer-lock</text>

      <OrderBadge x={286} y={328} n={2}/>
      <line x1="286" y1="316" x2="286" y2="270" stroke="#7a8a99" strokeWidth="1.3"/>
      <text x="286" y="348" textAnchor="middle" fontFamily="var(--font)" fontSize="12.5" fontWeight="700" fill="#11293c">Tuohy-Borst</text>

      <OrderBadge x={346} y={150} n={3}/>
      <text x="368" y="155" fontFamily="var(--font)" fontSize="12.5" fontWeight="700" fill="#11293c">3-way stopcock</text>

      <OrderBadge x={520} y={92} n={4}/>
      <text x="498" y="80" textAnchor="end" fontFamily="var(--font)" fontSize="12.5" fontWeight="700" fill="#11293c">Irrigation tubing</text>

      {/* ===================== COMMON ERROR ===================== */}
      <rect x="44" y="404" width="732" height="250" rx="16" fill="#fdecea" stroke="#f1b0a8" strokeWidth="1.5"/>
      <g transform="translate(72 444)">
        <circle cx="0" cy="0" r="13" fill="#c0392b"/>
        <line x1="-6" y1="-6" x2="6" y2="6" stroke="#fff" strokeWidth="2.6" strokeLinecap="round"/>
        <line x1="6" y1="-6" x2="-6" y2="6" stroke="#fff" strokeWidth="2.6" strokeLinecap="round"/>
      </g>
      <text x="96" y="442" fontFamily="var(--font)" fontSize="15" fontWeight="800" fill="#8f2e1e">Common error — stopcock placed directly on the scope</text>
      <text x="96" y="464" fontFamily="var(--font)" fontSize="12.5" fontWeight="500" fill="#9a4636">Trainees often skip the Tuohy-Borst. The stopcock cannot pass the guidewire and won't seal.</text>

      {/* wrong assembly: scope luer → stopcock (no Tuohy-Borst) */}
      <ScopeBody x={96} y={560} scale={0.82}/>
      {/* stopcock crammed straight onto the luer */}
      <StopcockH x={266} y={560} scale={0.92}/>
      {/* prohibition sign over the junction */}
      <g>
        <circle cx="250" cy="560" r="34" fill="none" stroke="#c0392b" strokeWidth="5" opacity=".9"/>
        <line x1="226" y1="536" x2="274" y2="584" stroke="#c0392b" strokeWidth="5" opacity=".9"/>
      </g>
      <text x="430" y="552" fontFamily="var(--font)" fontSize="13.5" fontWeight="700" fill="#8f2e1e">Correct fix:</text>
      <text x="430" y="574" fontFamily="var(--font)" fontSize="13" fontWeight="500" fill="#7a3a2b">Seat the Tuohy-Borst on the scope luer-lock</text>
      <text x="430" y="594" fontFamily="var(--font)" fontSize="13" fontWeight="500" fill="#7a3a2b">first, then the 3-way stopcock, then the tubing.</text>
    </g>
  );
}

window.Equipment = Equipment;
window.Gauge = Gauge;
})();
