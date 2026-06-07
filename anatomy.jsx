/* ===================================================================
   Anatomy — sagittal lower urinary tract cross-section.
   Instruments (scope / wire / balloon catheter) are strokes revealed
   ALONG the true urethral centerline via stroke-dashoffset, so motion
   follows the curve. The balloon is positioned by sampling the path.
   =================================================================== */
(function(){
const { useRef, useState, useLayoutEffect } = React;

/* urethral centerline: meatus (lower-left) -> bladder neck (upper-right) */
const CENTERLINE =
  "M 95 612 C 175 600 250 580 320 525 C 380 478 405 455 445 415 " +
  "C 485 376 520 350 560 315 C 580 298 595 285 612 262";

const STRICTURE_FRAC = 0.30;

function Anatomy({ step, wire, showLabels }){
  wire = wire || { dark:"#14439e", main:"#2563eb", lite:"#6ea8ff" };
  if(showLabels===undefined) showLabels = true;
  const a = step.anat || {};
  const lineRef = useRef(null);
  const offRef  = useRef(null);
  const [geom, setGeom] = useState(null);

  useLayoutEffect(()=>{
    const path = lineRef.current;
    if(!path) return;
    const L = path.getTotalLength();
    // sample for offset (scope) path
    const N = 200, samp = [];
    for(let i=0;i<=N;i++){
      const p = path.getPointAtLength((i/N)*L);
      samp.push([p.x,p.y]);
    }
    const off = samp.map((p,i)=>{
      const a = samp[Math.max(0,i-1)], b = samp[Math.min(N,i+1)];
      let dx=b[0]-a[0], dy=b[1]-a[1];
      const m=Math.hypot(dx,dy)||1; dx/=m; dy/=m;
      // normal (rotate +90), push "below/outside" by d
      const d=15;
      return [p[0]-dy*d, p[1]+dx*d];
    });
    let offD = "M "+off[0][0].toFixed(1)+" "+off[0][1].toFixed(1);
    for(let i=1;i<off.length;i++) offD += " L "+off[i][0].toFixed(1)+" "+off[i][1].toFixed(1);
    const Lo = offRef.current ? offRef.current.getTotalLength() : L;
    const pos = (frac)=>{
      const len=Math.max(0,Math.min(1,frac))*L;
      const p=path.getPointAtLength(len);
      const p2=path.getPointAtLength(Math.min(len+1.5,L));
      return {x:p.x,y:p.y,a:Math.atan2(p2.y-p.y,p2.x-p.x)*180/Math.PI};
    };
    setGeom({L, Lo, offD, pos});
  },[]);

  // need geom for offset path length; render offset hidden first pass
  const L  = geom? geom.L : 1000;
  const Lo = geom? geom.Lo : 1000;
  const offD = geom? geom.offD : CENTERLINE;
  const strict = geom? geom.pos(STRICTURE_FRAC) : {x:372,y:498,a:-35};
  const balloonPos = (geom && a.balloon!=null)? geom.pos(a.balloon) : null;

  const reveal = (frac, len)=>({
    strokeDasharray: len,
    strokeDashoffset: (frac==null? len : len*(1-frac)),
    transition:"stroke-dashoffset .85s cubic-bezier(.45,.05,.2,1), opacity .45s",
    opacity: (frac==null||frac<=0)? 0 : 1,
  });

  const inflate = a.inflate||0;
  const dilate  = a.dilate||0;

  return (
    <svg className="stage-svg" viewBox="0 0 820 700" preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id="bg" cx="64%" cy="26%" r="90%">
          <stop offset="0%" stopColor="#fcf6f2"/>
          <stop offset="60%" stopColor="#f4ece8"/>
          <stop offset="100%" stopColor="#ead8d2"/>
        </radialGradient>
        <radialGradient id="bladderG" cx="42%" cy="34%" r="78%">
          <stop offset="0%" stopColor="#f6c9b6"/>
          <stop offset="55%" stopColor="#e29c84"/>
          <stop offset="100%" stopColor="#c2735c"/>
        </radialGradient>
        <radialGradient id="bladderLumen" cx="46%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#fbe4d6"/>
          <stop offset="100%" stopColor="#eab59c"/>
        </radialGradient>
        <radialGradient id="prostateG" cx="40%" cy="34%" r="80%">
          <stop offset="0%" stopColor="#d9b48b"/>
          <stop offset="60%" stopColor="#bf9466"/>
          <stop offset="100%" stopColor="#9c7548"/>
        </radialGradient>
        <linearGradient id="spongyG" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#f3b4a0"/>
          <stop offset="100%" stopColor="#d98a73"/>
        </linearGradient>
        <linearGradient id="boneG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f3ecd9"/>
          <stop offset="100%" stopColor="#ddcfa9"/>
        </linearGradient>
        <linearGradient id="balloonG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bfe0f4"/>
          <stop offset="48%" stopColor="#8ec5ea"/>
          <stop offset="100%" stopColor="#5d9fd0"/>
        </linearGradient>
        <linearGradient id="scopeG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#454f5c"/>
          <stop offset="100%" stopColor="#222a34"/>
        </linearGradient>
        <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="6"/>
          <feOffset dy="6" result="o"/>
          <feComponentTransfer><feFuncA type="linear" slope="0.22"/></feComponentTransfer>
          <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      <rect x="0" y="0" width="820" height="700" fill="url(#bg)"/>

      {/* faint peritoneal / muscle shading strokes */}
      <g opacity="0.5" stroke="#e7cabd" strokeWidth="2" fill="none">
        <path d="M 60 250 C 240 210 470 180 760 150" opacity=".5"/>
        <path d="M 40 360 C 220 330 430 320 700 300" opacity=".35"/>
      </g>

      {/* ---- pubic bone ---- */}
      <g filter="url(#soft)">
        <ellipse cx="452" cy="352" rx="46" ry="66" transform="rotate(-18 452 352)"
                 fill="url(#boneG)" stroke="#c9b787" strokeWidth="2.5"/>
        <ellipse cx="452" cy="352" rx="30" ry="48" transform="rotate(-18 452 352)"
                 fill="#e7dcc0" opacity=".55"/>
      </g>

      {/* ---- bladder ---- */}
      <g filter="url(#soft)">
        <path d="M 600 290 C 560 250 552 170 612 120 C 678 66 778 78 800 170
                 C 818 246 770 312 686 318 C 648 320 618 312 600 290 Z"
              fill="url(#bladderG)" stroke="#a55c47" strokeWidth="3"/>
        <path d="M 615 282 C 582 250 578 182 626 142 C 682 100 760 112 778 182
                 C 792 244 752 296 684 300 C 654 302 632 298 615 282 Z"
              fill="url(#bladderLumen)" opacity=".92"/>
        {/* trabeculation hints */}
        <g stroke="#cf9077" strokeWidth="2" fill="none" opacity=".5" strokeLinecap="round">
          <path d="M 648 160 C 678 178 690 210 678 244"/>
          <path d="M 700 150 C 726 176 730 214 712 248"/>
          <path d="M 632 200 C 660 212 676 232 672 258"/>
        </g>
      </g>

      {/* ---- prostate gland ---- */}
      <g filter="url(#soft)">
        <ellipse cx="538" cy="350" rx="86" ry="70" transform="rotate(-28 538 350)"
                 fill="url(#prostateG)" stroke="#7d5c34" strokeWidth="3"/>
        <ellipse cx="538" cy="350" rx="86" ry="70" transform="rotate(-28 538 350)"
                 fill="none" stroke="#caa674" strokeWidth="1.2" opacity=".6"/>
      </g>

      {/* ---- corpus spongiosum / penile body (along centerline) ---- */}
      <path d={CENTERLINE} fill="none" stroke="url(#spongyG)" strokeWidth="78"
            strokeLinecap="round" strokeDasharray="430 1000"/>
      <path d={CENTERLINE} fill="none" stroke="#c47f68" strokeWidth="78"
            strokeLinecap="round" strokeDasharray="430 1000" opacity=".0"/>
      {/* bulbar bulge */}
      <ellipse cx="300" cy="540" rx="62" ry="48" transform="rotate(-22 300 540)"
               fill="url(#spongyG)"/>
      {/* glans */}
      <ellipse cx="92" cy="616" rx="40" ry="34" transform="rotate(-18 92 616)"
               fill="#e9a48f" stroke="#d2826c" strokeWidth="2"/>

      {/* ---- urethral lumen (open passage) ---- */}
      <path ref={lineRef} d={CENTERLINE} fill="none" stroke="#7d2f28"
            strokeWidth="15" strokeLinecap="round"/>
      <path d={CENTERLINE} fill="none" stroke="#a8463b" strokeWidth="8"
            strokeLinecap="round" opacity=".85"/>

      {/* irrigation flow */}
      {a.irrig && (
        <path d={CENTERLINE} fill="none" stroke="#7fd6ef" strokeWidth="4.5"
              strokeLinecap="round" strokeDasharray="3 26" opacity=".55"
              className="irrig-flow"/>
      )}

      {/* offset path (measuring) for scope */}
      <path ref={offRef} d={offD} fill="none" stroke="none"/>

      {/* ---- guidewire ---- */}
      <path d={CENTERLINE} fill="none" stroke={wire.dark} strokeWidth="5.5"
            strokeLinecap="round" style={reveal(a.wire, L)}/>
      <path d={CENTERLINE} fill="none" stroke={wire.main} strokeWidth="2.4"
            strokeLinecap="round" style={reveal(a.wire, L)} opacity=".9"/>
      {/* wire coil in bladder — continues from the urethral wire into the lumen */}
      {a.wire!=null && a.wire>0.6 && (
        <g style={{transition:"opacity .5s", opacity:1}}>
          <path d="M 612 262 C 648 244 690 248 708 220 C 724 194 706 168 681 173
                   C 658 178 654 204 675 214 C 691 221 704 211 701 196"
                fill="none" stroke={wire.dark} strokeWidth="6" strokeLinecap="round"/>
          <path d="M 612 262 C 648 244 690 248 708 220 C 724 194 706 168 681 173
                   C 658 178 654 204 675 214 C 691 221 704 211 701 196"
                fill="none" stroke={wire.main} strokeWidth="2.6" strokeLinecap="round"/>
        </g>
      )}

      {/* ---- cystoscope (on offset path) ---- */}
      <path d={offD} fill="none" stroke="url(#scopeG)" strokeWidth="17"
            strokeLinecap="round" style={reveal(a.scope, Lo)}/>
      <path d={offD} fill="none" stroke="#6b7585" strokeWidth="3"
            strokeLinecap="round" style={reveal(a.scope, Lo)} opacity=".5"/>
      {/* scope tip advanced into the bladder lumen (final survey) */}
      {a.scopeTip==="bladder" && (
        <g style={{transition:"opacity .5s"}}>
          <path d="M 624 271 C 652 250 670 230 688 212" fill="none"
                stroke="url(#scopeG)" strokeWidth="17" strokeLinecap="round"/>
          <circle cx="692" cy="209" r="10" fill="#bfe3ff" stroke="#7fb6e6" strokeWidth="1.5"/>
          <circle cx="692" cy="209" r="4" fill="#eaf6ff"/>
        </g>
      )}

      {/* ---- balloon catheter shaft (tan) ---- */}
      <path d={CENTERLINE} fill="none" stroke="#c9b48d" strokeWidth="9"
            strokeLinecap="round" style={reveal(a.shaft, L)}/>
      <path d={CENTERLINE} fill="none" stroke="#efe2c4" strokeWidth="3"
            strokeLinecap="round" style={reveal(a.shaft, L)} opacity=".7"/>

      {/* ---- balloon ---- */}
      {balloonPos && (
        <g transform={`translate(${balloonPos.x} ${balloonPos.y}) rotate(${balloonPos.a})`}
           style={{transition:"transform .85s cubic-bezier(.45,.05,.2,1)"}}>
          <Balloon inflate={inflate} wire={wire}/>
        </g>
      )}

      {/* ---- stricture (over balloon so the waist shows) ---- */}
      <g transform={`translate(${strict.x} ${strict.y}) rotate(${strict.a})`}>
        <Stricture dilate={dilate}/>
      </g>

      {/* ---- labels ---- */}
      {showLabels && (step.labels||[]).map((lb,i)=> <Label key={i} {...lb}/>) }
    </svg>
  );
}

/* balloon capsule oriented along +x, centered at origin */
function Balloon({inflate, wire}){
  wire = wire || { main:"#2563eb" };
  const half = 76;                 // 4 cm
  const r = 5.5 + inflate*19;       // profile radius
  const sh = 18;                    // shoulder length
  const W = r;
  const d =
    `M ${-half} 0 `+
    `L ${-half+sh} ${-W} `+
    `L ${half-sh} ${-W} `+
    `L ${half} 0 `+
    `L ${half-sh} ${W} `+
    `L ${-half+sh} ${W} Z`;
  return (
    <g style={{transition:"all .8s cubic-bezier(.45,.05,.2,1)"}}>
      <path d={d} fill="url(#balloonG)" stroke="#3f7fb4" strokeWidth="1.6"
            opacity={inflate>0?0.92:0.8}
            style={{transition:"all .8s cubic-bezier(.45,.05,.2,1)"}}/>
      {/* specular highlight */}
      <path d={`M ${-half+sh+4} ${-W+3} L ${half-sh-4} ${-W+3}`} stroke="#eaf6ff"
            strokeWidth="2.4" strokeLinecap="round" opacity=".7"
            style={{transition:"all .8s"}}/>
      {/* radio-opaque markers */}
      <line x1={-half+sh} y1={-W-1} x2={-half+sh} y2={W+1} stroke="#2c3a47" strokeWidth="2.4"/>
      <line x1={half-sh}  y1={-W-1} x2={half-sh}  y2={W+1} stroke="#2c3a47" strokeWidth="2.4"/>
      {/* inner wire line */}
      <line x1={-half} y1="0" x2={half+30} y2="0" stroke={wire.main} strokeWidth="2.4" opacity=".9"/>
    </g>
  );
}

/* stricture: white fibrotic wedges pinching the lumen.
   Baseline ~2.5 (tight pinhole); at full dilation the opening reaches
   ±7.5 — matching the 15px normal urethral lumen. The scar tissue stays
   visible but the caliber is restored to normal. */
function Stricture({dilate}){
  const gap = 2.5 + dilate*5;        // half-opening: 2.5 (tight) -> 7.5 (= normal lumen)
  const wedge = (sign)=>(
    <path d={`M -34 ${sign*34} C -14 ${sign*12} -10 ${sign*(gap+3)} 0 ${sign*gap}
              C 10 ${sign*(gap+3)} 14 ${sign*12} 34 ${sign*34} Z`}
          fill="#f1e8e1" stroke="#cdb6a8" strokeWidth="1.4"
          style={{transition:"d .8s, opacity .6s"}} opacity={0.92}/>
  );
  return (
    <g>
      {/* pale fibrotic halo — fades as the scar is stretched open */}
      <ellipse cx="0" cy="0" rx="18" ry="30" fill="#ead8cd" opacity={0.55*(1-dilate)}
               style={{transition:"opacity .6s"}}/>
      {wedge(1)}
      {wedge(-1)}
    </g>
  );
}

/* SVG callout label with leader line */
function Label({x,y,text,anchor="left",warn,to}){
  const pad=8, fs=13, w=text.length*7.0+pad*2, h=24;
  const bx = anchor==="right" ? x-w : x;
  const fill = warn? "#fff6e8" : "#ffffff";
  const stroke = warn? "#eec49a" : "#dbe5ec";
  const dotc = warn? "#c77b1e" : "#0067b1";
  return (
    <g style={{transition:"opacity .5s"}}>
      {to && <line x1={anchor==="right"?x:x+w} y1={y+h/2} x2={to.x} y2={to.y}
                   stroke={dotc} strokeWidth="1.6" strokeDasharray="3 3" opacity=".8"/>}
      {to && <circle cx={to.x} cy={to.y} r="3.4" fill={dotc}/>}
      <rect x={bx} y={y} width={w} height={h} rx="6" fill={fill} stroke={stroke} strokeWidth="1.2"/>
      <circle cx={bx+pad+2} cy={y+h/2} r="3.2" fill={dotc}/>
      <text x={bx+pad+11} y={y+h/2+4.5} fontFamily="var(--font)" fontSize={fs}
            fontWeight="600" fill="#11293c">{text}</text>
    </g>
  );
}

window.Anatomy = Anatomy;
})();
