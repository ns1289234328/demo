/* ===================================================================
   ScopeView — the circular cystoscopic ("camera") view, picture-in-
   picture. Reacts to each step's `cam` descriptor.
   =================================================================== */
(function(){

function ScopeView({ cam, wire }){
  cam = cam || {mode:"off"};
  wire = wire || { dark:"#14439e", main:"#2563eb", lite:"#6ea8ff" };
  if(cam.mode === "off") return <ScopeOff/>;

  const open = cam.open!=null ? cam.open : 0.7;
  const lumenR = cam.mode==="bladder" ? 70 : (10 + open*46);   // dark lumen radius
  const showStricture = cam.stricture;
  const pin = showStricture ? Math.max(5, 30*(1-open)) : 0;     // remaining true lumen
  const whiteR = showStricture ? Math.max(pin+11, lumenR*0.86) : 0; // white scar ring

  return (
    <svg viewBox="0 0 200 200" style={{width:"100%",height:"100%",display:"block"}}>
      <defs>
        <radialGradient id="muco" cx="50%" cy="48%" r="60%">
          <stop offset="0%" stopColor="#d23c2f"/>
          <stop offset="42%" stopColor="#c9534a"/>
          <stop offset="78%" stopColor="#e08a7e"/>
          <stop offset="100%" stopColor="#efb3a6"/>
        </radialGradient>
        <radialGradient id="lumenDark" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1b0606"/>
          <stop offset="70%" stopColor="#5a1410"/>
          <stop offset="100%" stopColor="#8f2a20"/>
        </radialGradient>
        <radialGradient id="strictureWhite" cx="50%" cy="50%" r="58%">
          <stop offset="0%" stopColor="#f3ece6"/>
          <stop offset="66%" stopColor="#e9ded5"/>
          <stop offset="100%" stopColor="#d6c5b9"/>
        </radialGradient>
        <radialGradient id="vig" cx="50%" cy="50%" r="50%">
          <stop offset="62%" stopColor="#000" stopOpacity="0"/>
          <stop offset="100%" stopColor="#000" stopOpacity="0.6"/>
        </radialGradient>
        <radialGradient id="balloonCam" cx="42%" cy="38%" r="65%">
          <stop offset="0%" stopColor="#d7ecfb" stopOpacity=".9"/>
          <stop offset="60%" stopColor="#9fcdee" stopOpacity=".55"/>
          <stop offset="100%" stopColor="#6aa6d6" stopOpacity=".35"/>
        </radialGradient>
        <clipPath id="scopeClip"><circle cx="100" cy="100" r="100"/></clipPath>
      </defs>

      <g clipPath="url(#scopeClip)">
        {/* mucosal wall */}
        <rect x="0" y="0" width="200" height="200" fill="url(#muco)"/>
        {/* mucosal folds */}
        <g stroke="#a83a30" strokeWidth="2.4" fill="none" opacity=".45" strokeLinecap="round">
          <path d="M 100 100 L 18 40"/><path d="M 100 100 L 60 8"/>
          <path d="M 100 100 L 150 14"/><path d="M 100 100 L 192 56"/>
          <path d="M 100 100 L 196 132"/><path d="M 100 100 L 150 192"/>
          <path d="M 100 100 L 70 194"/><path d="M 100 100 L 12 150"/>
        </g>

        {cam.mode==="bladder" ? (
          <BladderCam/>
        ) : (
          <>
            {/* receding dark lumen */}
            <circle cx="100" cy="100" r={lumenR} fill="url(#lumenDark)"
                    style={{transition:"r .7s cubic-bezier(.45,.05,.2,1)"}}/>
            {/* white fibrotic stricture narrowing the lumen */}
            {showStricture && (
              <g style={{transition:"opacity .6s"}}>
                <circle cx="100" cy="100" r={whiteR} fill="url(#strictureWhite)"
                        stroke="#cdbfb3" strokeWidth="2"
                        style={{transition:"r .7s cubic-bezier(.45,.05,.2,1)"}}/>
                {/* faint radial scar striations */}
                <g stroke="#d3c4b7" strokeWidth="1.6" opacity=".6" strokeLinecap="round">
                  <line x1="100" y1="100" x2={100+whiteR*0.72} y2={100-whiteR*0.5}/>
                  <line x1="100" y1="100" x2={100-whiteR*0.78} y2={100-whiteR*0.4}/>
                  <line x1="100" y1="100" x2={100+whiteR*0.5} y2={100+whiteR*0.74}/>
                  <line x1="100" y1="100" x2={100-whiteR*0.55} y2={100+whiteR*0.7}/>
                </g>
                {/* remaining true lumen (dark) */}
                <circle cx="100" cy="100" r={pin} fill="url(#lumenDark)"
                        style={{transition:"r .7s cubic-bezier(.45,.05,.2,1)"}}/>
              </g>
            )}
            {/* guidewire crossing into the lumen */}
            {cam.wire && (
              <g style={{transition:"opacity .5s"}}>
                <line x1="26" y1="150" x2="100" y2="100" stroke={wire.dark} strokeWidth="7" strokeLinecap="round"/>
                <line x1="26" y1="150" x2="100" y2="100" stroke={wire.lite} strokeWidth="3" strokeLinecap="round"/>
                <circle cx="100" cy="100" r="4" fill={wire.lite}/>
              </g>
            )}
            {/* balloon filling the view */}
            {cam.balloon && (
              <g style={{transition:"opacity .6s"}}>
                <circle cx="100" cy="100" r={40 + (cam.balloonState||0)*54}
                        fill="url(#balloonCam)" stroke="#bfe0f6" strokeWidth="2"
                        opacity={0.5 + (cam.balloonState||0)*0.4}
                        style={{transition:"r .8s cubic-bezier(.45,.05,.2,1), opacity .6s"}}/>
                <ellipse cx="78" cy="74" rx="22" ry="13" fill="#f2fbff" opacity=".5"
                         transform="rotate(-32 78 74)"/>
              </g>
            )}
          </>
        )}

        {/* vignette (scope edge falloff — no lens glare) */}
        <rect x="0" y="0" width="200" height="200" fill="url(#vig)"/>
      </g>
      {/* scope bezel ring */}
      <circle cx="100" cy="100" r="98" fill="none" stroke="#0a1118" strokeWidth="4" opacity=".5"/>
    </svg>
  );
}

function BladderCam(){
  return (
    <g>
      <circle cx="100" cy="100" r="100" fill="#c85248"/>
      <radialGradient id="bcDeep" cx="54%" cy="46%" r="55%">
        <stop offset="0%" stopColor="#7e241c"/>
        <stop offset="100%" stopColor="#c14f44" stopOpacity="0"/>
      </radialGradient>
      <circle cx="104" cy="92" r="80" fill="url(#bcDeep)"/>
      <g stroke="#9a342a" strokeWidth="3" fill="none" opacity=".5" strokeLinecap="round">
        <path d="M 40 70 C 80 96 120 96 168 78"/>
        <path d="M 36 110 C 84 128 130 126 172 112"/>
        <path d="M 60 150 C 96 162 128 160 154 150"/>
      </g>
      {/* air bubble at dome */}
      <ellipse cx="86" cy="50" rx="34" ry="16" fill="#f6d9cf" opacity=".55"/>
      <ellipse cx="78" cy="46" rx="12" ry="6" fill="#fff" opacity=".5"/>
    </g>
  );
}

function ScopeOff(){
  return (
    <svg viewBox="0 0 200 200" style={{width:"100%",height:"100%",display:"block"}}>
      <rect x="0" y="0" width="200" height="200" fill="#0a0f14"/>
      <g opacity=".5" stroke="#33424f" strokeWidth="0" >
        <circle cx="100" cy="92" r="26" fill="none" stroke="#33424f" strokeWidth="5"/>
        <line x1="118" y1="110" x2="138" y2="130" stroke="#33424f" strokeWidth="6" strokeLinecap="round"/>
      </g>
      <text x="100" y="156" textAnchor="middle" fontFamily="var(--mono)" fontSize="11"
            letterSpacing="2" fill="#46586a">SCOPE OUT</text>
    </svg>
  );
}

window.ScopeView = ScopeView;
})();
