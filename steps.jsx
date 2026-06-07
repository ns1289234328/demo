/* ===================================================================
   STEPS — Flexible cystoscopy + UroMax balloon stricture dilation
   Each step drives: the anatomy scene, the scope (camera) view,
   floating SVG labels, the caption, and the pressure gauge.
   =================================================================== */

window.CHAPTERS = [
  "Setup",
  "Cystoscopy & Wire",
  "Balloon Placement",
  "Dilation",
];

/* anat scene params (all normalized 0..1 unless noted)
   scope    : cystoscope tip position along urethra (null = not inserted)
   wire     : Sensor guidewire tip position (null = absent)
   shaft    : balloon catheter shaft reveal (null = absent)
   balloon  : balloon CENTER position (null = absent)
   inflate  : 0 deflated .. 1 fully inflated
   pressure : atm reading for the gauge
   dilate   : residual lumen opening at the stricture (0 tight .. 1 dilated)
   irrig    : irrigation flowing
   gauge    : show inflator pressure gauge inset                          */

window.STEPS = [

  /* ---------------- CH 0 · SETUP ---------------- */
  {
    chapter:0, scene:"equipment", equip:"overview",
    title:"Indication & equipment",
    body:"Known or suspected <strong>urethral stricture</strong>. Confirm the case, then open your kit: Ambu A4 flexible cystoscope, UroMax 24&nbsp;Fr × 4&nbsp;cm balloon dilator, Encore inflator, 0.035″ straight Sensor wire, and the Tuohy-Borst irrigation manifold.",
    tags:[
      {text:"Cipro × 1 (unless allergy / on abx)"},
      {text:"Saline or water for inflator", mono:true},
      {text:"Drape genitalia"},
    ],
    cam:{mode:"off"},
  },
  {
    chapter:0, scene:"equipment", equip:"prime",
    title:"Prime the inflator",
    body:"Pour saline into the inflator box. Put the <strong>Luer-lock</strong> tip in the saline, <strong>press &amp; hold the yellow button</strong>, and pull the plunger fully back — the syringe draws up fluid. Purge air before connecting.",
    tags:[
      {text:"Hold yellow button + pull plunger back"},
      {text:"Fill with fluid — no air", crit:true},
    ],
    cam:{mode:"off"},
  },
  {
    chapter:0, scene:"equipment", equip:"connect",
    title:"Connect inflator to balloon",
    body:"With the inflator primed, connect its <strong>Luer-lock</strong> to the <strong>“Balloon”</strong> port of the UroMax dilator. The wire port stays open for the guidewire. Keep everything on the sterile field.",
    tags:[
      {text:"Luer-lock → “Balloon” port"},
      {text:"Wire lumen stays free", mono:true},
    ],
    cam:{mode:"off"},
  },

  {
    chapter:0, scene:"equipment", equip:"irrigation",
    title:"Assemble irrigation on the cystoscope",
    body:"Build the irrigation adapter onto the scope's <strong>luer-lock port</strong>, in order: <strong>(1)</strong> Tuohy-Borst directly onto the cystoscope luer-lock → <strong>(2)</strong> 3-way stopcock onto the Tuohy-Borst → <strong>(3)</strong> irrigation tubing onto the stopcock.",
    tags:[
      {text:"Tuohy-Borst goes on the scope FIRST", crit:true},
      {text:"Never put the stopcock on the scope", crit:true},
      {text:"Scope → Tuohy → stopcock → tubing", mono:true},
    ],
    cam:{mode:"off"},
  },

  /* ---------------- CH 1 · CYSTOSCOPY & WIRE ---------------- */
  {
    chapter:1, scene:"anatomy",
    anat:{scope:0.30, wire:null, shaft:null, balloon:null, inflate:0, pressure:0, dilate:0, irrig:true, gauge:false},
    title:"Diagnostic cystoscopy",
    body:"With the <strong>Tuohy-Borst on the scope</strong> and irrigation running, advance the Ambu cystoscope up the urethra under direct vision until flow and view are obstructed at the stricture.",
    tags:[
      {text:"Tuohy-Borst on scope"},
      {text:"Irrigation running", mono:true},
    ],
    cam:{mode:"urethra", open:0.85, stricture:true, wire:false, balloon:false},
    labels:[
      {x:150,y:660,text:"Ambu A4 cystoscope",anchor:"right",to:{x:240,y:600}},
      {x:640,y:120,text:"Bladder",anchor:"left"},
    ],
  },
  {
    chapter:1, scene:"anatomy",
    anat:{scope:0.30, wire:null, shaft:null, balloon:null, inflate:0, pressure:0, dilate:0, irrig:true, gauge:false},
    title:"Locate the stricture",
    body:"Identify the <strong>narrowed segment</strong> — typically bulbar urethra. The lumen pinches to a pinhole. Center it in the field before passing the wire.",
    tags:[
      {text:"Bulbar urethra, most common"},
      {text:"Pinpoint the true lumen", crit:true},
    ],
    cam:{mode:"urethra", open:0.85, stricture:true, focusStricture:true, wire:false, balloon:false},
    labels:[
      {x:300,y:560,text:"Stricture",anchor:"right",warn:true,to:{x:372,y:498}},
    ],
  },
  {
    chapter:1, scene:"anatomy",
    anat:{scope:0.30, wire:1.0, shaft:null, balloon:null, inflate:0, pressure:0, dilate:0, irrig:true, gauge:false},
    title:"Pass the Sensor guidewire",
    body:"Advance the <strong>0.035″ straight Sensor wire</strong> through the working channel, across the stricture, and coil it safely in the bladder. Keep the soft hydrophilic tip atraumatic.",
    tags:[
      {text:"0.035″ straight Sensor wire", mono:true},
      {text:"Coil tip in bladder"},
    ],
    cam:{mode:"urethra", open:0.85, stricture:true, wire:true, balloon:false},
    labels:[
      {x:470,y:175,text:"Wire coiled in bladder",anchor:"left",to:{x:600,y:215}},
      {x:300,y:560,text:"Across the stricture",anchor:"right",to:{x:372,y:498}},
    ],
  },
  {
    chapter:1, scene:"anatomy",
    anat:{scope:0.0, wire:1.0, shaft:null, balloon:null, inflate:0, pressure:0, dilate:0, irrig:false, gauge:false},
    title:"Remove the cystoscope — keep the wire",
    body:"Withdraw the cystoscope <strong>while holding the wire steady</strong>. The wire must not move — it is your rail across the stricture for the balloon.",
    tags:[
      {text:"Hold wire — do not lose access", crit:true},
      {text:"Scope out, wire stays"},
    ],
    cam:{mode:"off"},
    labels:[
      {x:170,y:660,text:"Maintain wire position",anchor:"right",warn:true,to:{x:250,y:602}},
    ],
  },

  /* ---------------- CH 2 · BALLOON PLACEMENT ---------------- */
  {
    chapter:2, scene:"anatomy",
    anat:{scope:null, wire:1.0, shaft:0.30, balloon:0.30, inflate:0, pressure:0, dilate:0, irrig:false, gauge:false},
    title:"Advance the balloon over the wire",
    body:"Backload the <strong>UroMax balloon</strong> onto the wire and advance it up the urethra until the balloon sits at the level of the stricture.",
    tags:[
      {text:"UroMax 24 Fr × 4 cm", mono:true},
      {text:"Track over the wire to the stricture"},
    ],
    cam:{mode:"off"},
    labels:[
      {x:175,y:660,text:"Balloon over wire",anchor:"right",to:{x:255,y:600}},
    ],
  },
  {
    chapter:2, scene:"anatomy",
    anat:{scope:0.27, wire:1.0, shaft:0.30, balloon:0.30, inflate:0, pressure:0, dilate:0, irrig:true, gauge:false},
    title:"Re-pass the cystoscope alongside",
    body:"Reintroduce the cystoscope <strong>alongside the balloon</strong> for direct vision. <strong>Re-tighten the Tuohy-Borst</strong> around the shafts now — otherwise irrigation sprays back out of the manifold.",
    tags:[
      {text:"Re-tighten the Tuohy-Borst", crit:true},
      {text:"Direct vision on the balloon"},
    ],
    cam:{mode:"urethra", open:0.7, stricture:true, wire:true, balloon:true, balloonState:0},
    labels:[
      {x:150,y:648,text:"Scope beside balloon",anchor:"right",to:{x:250,y:596}},
      {x:150,y:690,text:"Tighten Tuohy-Borst",anchor:"right",warn:true},
    ],
  },
  {
    chapter:2, scene:"anatomy",
    anat:{scope:0.27, wire:1.0, shaft:0.30, balloon:0.30, inflate:0, pressure:0, dilate:0, irrig:true, gauge:true},
    title:"Position across the stricture",
    body:"Under direct vision, confirm the <strong>balloon waist straddles the stricture</strong> — the narrowed segment should sit at the mid-balloon. Adjust before any inflation.",
    tags:[
      {text:"Stricture at mid-balloon", crit:true},
      {text:"Confirm under direct vision"},
    ],
    cam:{mode:"urethra", open:0.55, stricture:true, wire:true, balloon:true, balloonState:0},
    labels:[
      {x:300,y:560,text:"Waist on stricture",anchor:"right",to:{x:372,y:498}},
    ],
  },

  /* ---------------- CH 3 · DILATION ---------------- */
  {
    chapter:3, scene:"anatomy",
    anat:{scope:0.27, wire:1.0, shaft:0.30, balloon:0.30, inflate:0, pressure:0, dilate:0, irrig:true, gauge:true},
    title:"Set the pressure",
    body:"Press &amp; hold the <strong>yellow button</strong>, push the plunger in slightly, then release the button. Begin turning the plunger <strong>clockwise</strong> — the gauge needle rises as the balloon takes pressure.",
    tags:[
      {text:"Hold button → seat plunger → release"},
      {text:"Turn plunger clockwise", mono:true},
    ],
    cam:{mode:"urethra", open:0.5, stricture:true, wire:true, balloon:true, balloonState:0},
  },
  {
    chapter:3, scene:"anatomy",
    anat:{scope:0.27, wire:1.0, shaft:0.30, balloon:0.30, inflate:0.6, pressure:20, dilate:0.45, irrig:true, gauge:true},
    title:"Treatment 1 — inflate to 20 atm",
    body:"Inflate steadily to <strong>20 atm</strong>. The balloon waist begins to efface as the scar yields. Watch for the waist to open under direct vision.",
    tags:[
      {text:"20 atm", mono:true},
      {text:"Waist effacing"},
    ],
    cam:{mode:"urethra", open:0.6, stricture:true, wire:true, balloon:true, balloonState:0.6},
    labels:[
      {x:300,y:560,text:"Waist effacing",anchor:"right",to:{x:372,y:498}},
    ],
  },
  {
    chapter:3, scene:"anatomy",
    anat:{scope:0.27, wire:1.0, shaft:0.30, balloon:0.30, inflate:1, pressure:26, dilate:1, irrig:true, gauge:true, hold:true},
    title:"Up to 26 atm — hold 30 s",
    body:"Increase to <strong>26 atm</strong> and <strong>hold ~30 seconds</strong>. The waist fully effaces — the balloon is now a smooth cylinder across the treated segment.",
    tags:[
      {text:"26 atm", mono:true},
      {text:"Hold 30 s", mono:true, crit:true},
    ],
    cam:{mode:"urethra", open:0.9, stricture:false, wire:true, balloon:true, balloonState:1},
    labels:[
      {x:300,y:560,text:"Waist fully effaced",anchor:"right",to:{x:372,y:498}},
    ],
  },
  {
    chapter:3, scene:"anatomy",
    anat:{scope:0.27, wire:1.0, shaft:0.30, balloon:0.30, inflate:0, pressure:0, dilate:1, irrig:true, gauge:true},
    title:"Deflate",
    body:"Press &amp; hold the yellow button and pull the plunger <strong>all the way back</strong> until fluid returns and the balloon is fully deflated. Inspect the dilated segment.",
    tags:[
      {text:"Hold button + pull plunger fully back"},
      {text:"Confirm full deflation before moving", crit:true},
    ],
    cam:{mode:"urethra", open:0.85, stricture:false, wire:true, balloon:true, balloonState:0},
  },
  {
    chapter:3, scene:"anatomy",
    anat:{scope:0.27, wire:1.0, shaft:0.30, balloon:0.30, inflate:1, pressure:26, dilate:1, irrig:true, gauge:true, hold:true, rep:2},
    title:"Treatment 2 — repeat",
    body:"Repeat the cycle for a <strong>second treatment</strong>: re-inflate 20 → 26 atm and hold ~30 s, then deflate fully. Two treatments total.",
    tags:[
      {text:"Treatment 2 of 2", crit:true},
      {text:"20 → 26 atm, hold 30 s", mono:true},
    ],
    cam:{mode:"urethra", open:0.92, stricture:false, wire:true, balloon:true, balloonState:1},
    labels:[
      {x:300,y:560,text:"Second treatment",anchor:"right",to:{x:372,y:498}},
    ],
  },
  {
    chapter:3, scene:"anatomy",
    anat:{scope:1.0, scopeTip:"bladder", wire:null, shaft:null, balloon:null, inflate:0, pressure:0, dilate:1, irrig:true, gauge:false},
    title:"Remove balloon — complete cystoscopy",
    body:"Deflate and remove the balloon and wire. Advance the cystoscope through the <strong>now-patent stricture</strong> to survey the rest of the lower urinary tract and bladder.",
    tags:[
      {text:"Patent lumen", mono:true},
      {text:"Survey LUT & bladder"},
    ],
    cam:{mode:"bladder", open:1, wire:false, balloon:false},
    labels:[
      {x:300,y:560,text:"Dilated, patent",anchor:"right",to:{x:372,y:498}},
      {x:640,y:120,text:"Bladder survey",anchor:"left"},
    ],
  },
];
