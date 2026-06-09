/* ============================================================
   Content model — da Vinci SP instrument-arm draping
   Source: SP System In-Service Guide (OR Staff) + reference video
   ============================================================ */
(function () {
  const IMG = "assets/steps/";

  const SECTIONS = [
    { key: "deploy", n: "01", name: "Deploy for Draping", short: "Position the arm" },
    { key: "ring",   n: "02", name: "Install Drape Ring", short: "Lock the collar" },
    { key: "arm",    n: "03", name: "Drape the Arm",      short: "Two-person walk" },
    { key: "straps", n: "04", name: "Straps & Cannula",   short: "Secure & extend" },
    { key: "drives", n: "05", name: "Instrument Drives",  short: "Seat 4 adapters" },
    { key: "stow",   n: "06", name: "Inspect & Stow",     short: "Finish up" },
  ];

  const STEPS = [
    /* ---------------- DEPLOY ---------------- */
    {
      id: "d1", section: "deploy", role: "nonsterile",
      title: "Start Deploy for Draping — Step 1",
      lede: "On the Patient Cart touchpad, <b>press and hold “Deploy for Draping — Step 1.”</b> The cart moves itself into the draping position. Hold until the motion finishes and the screen shows <b>“Waiting on Sterile Tasks.”</b>",
      image: "deploy1_pad.jpg", caption: "Patient Cart touchpad",
      interaction: { type: "hold", action: "deploy1" },
      callouts: [
        { kind: "note", text: "The instrument drives <b>rotate as they move</b> — that turn is intentional and expected, not a fault." },
      ],
      side: {
        title: "What the cart does",
        type: "moves",
        items: [
          "Column lowers",
          "Boom extends",
          "Instrument arm swings vertical",
          "Cannula arm retracts",
          "Drives rotate, then retract to the loading position",
        ],
      },
    },
    {
      id: "d2", section: "deploy", role: "nonsterile",
      title: "Open the drape package",
      lede: "Set the packaged drape on a table with the <b>sterile-wrap folds facing up.</b> Open the outer packaging using standard sterile technique, then unfold the cover by pulling the corners away until the drape is fully exposed.",
      image: "unpack_drape.jpg", caption: "Opening the drape",
      interaction: {
        type: "checklist",
        items: [
          "Packaged drape placed on the table, <b>folds facing the ceiling</b>",
          "Outer packaging opened with sterile technique",
          "Cover unfolded by the corners — drape fully exposed",
        ],
      },
      callouts: [
        { kind: "caution", label: "Sterility barrier", text: "The <b>green band marks the sterility barrier.</b> The non-sterile person must never grasp the drape below the green band." },
      ],
      side: {
        title: "Before you start", type: "tips",
        items: [
          "Two people required: one sterile, one non-sterile",
          "Have at least one backup drape ready",
          "Keep the drape insert nearby for reference",
        ],
      },
    },

    /* ---------------- RING ---------------- */
    {
      id: "r1", section: "ring", role: "sterile",
      title: "Orient the drape and carry it over",
      lede: "Position the drape so the three installation-collar clips sit at <b>3, 6, and 9 o’clock.</b> Pick it up by the clips — <b>right hand at 3, left hand at 9</b> — let the instrument-drive drapes hang from the pouch, and carry it to the cart held away from your body.",
      image: "carry_ring.jpg", caption: "Carrying the drape",
      interaction: {
        type: "checklist",
        items: [
          "Instructions for use removed (keep for reference)",
          "Clips oriented to <b>3, 6, and 9 o’clock</b>",
          "Lifted by the clips — right hand 3 o’clock, left hand 9 o’clock",
          "Drive drapes allowed to extend; carried away from the body",
        ],
      },
      side: { title: "Your role", type: "partner", role: "sterile",
        text: "You are sterile. Handle only the drape itself — keep your hands on the clips and within the sterile zone above the green band." },
    },
    {
      id: "r2", section: "ring", role: "sterile",
      title: "Lock the drape ring onto the arm",
      lede: "Approach with the <b>column on your right.</b> Line the <b>four dark-gray marks</b> on the drape ring up with the four dark-gray connectors on the instrument arm, place the ring around the drives, then lift and press until each tab <b>clicks</b>. Tap each connector below as it seats.",
      image: "install_ring.jpg", caption: "Seating the ring",
      interaction: { type: "ring" },
      callouts: [
        { kind: "caution", label: "Confirm all four", text: "Visually confirm the ring is attached at <b>all four connectors.</b> “Deploy — Step 2” will not appear until every tab is seated." },
      ],
      side: { title: "Tactile check", type: "tips",
        items: ["Listen and feel for an audible + tactile click at each tab", "Gently tug to confirm the ring is captured", "If a tab won’t seat, re-align the gray marks"] },
    },

    /* ---------------- ARM ---------------- */
    {
      id: "a1", section: "arm", role: "nonsterile",
      title: "Deploy for Draping — Step 2",
      lede: "Back at the touchpad, <b>press and hold “Deploy for Draping — Step 2.”</b> The instrument arm pitches forward into the draping position.",
      image: "deploy2_pitch.jpg", caption: "Arm pitches forward",
      interaction: { type: "hold", action: "deploy2" },
      callouts: [
        { kind: "note", text: "No “Step 2” button? The ring isn’t fully seated — go back and confirm all four tabs are locked." },
      ],
      side: { title: "Your role", type: "partner", role: "nonsterile",
        text: "You are non-sterile. You drive the touchpad and handle the drape only by its outer handles — never below the green band." },
    },
    {
      id: "a2", section: "arm", role: "sterile",
      title: "Release the installation collar",
      lede: "Remove the <b>white band</b> to release the installation collar, then carefully lift the collar away with its clips and pouch. The instrument-drive drapes will extend from the installed portion as you do.",
      image: "remove_collar.jpg", caption: "Removing the collar",
      interaction: {
        type: "checklist",
        items: [
          "White band removed to release the collar",
          "Collar (with clips + pouch) lifted away carefully",
          "Folded drape <b>not</b> pulled away with the collar",
        ],
      },
      side: { title: "Watch for", type: "tips",
        items: ["The drive drapes should hang free once the collar is off", "Don’t let the main drape body lift with the collar"] },
    },
    {
      id: "a3", section: "arm", role: "team",
      title: "Walk the drape over the arm",
      lede: "A coordinated two-person move. The <b>non-sterile nurse leads with the drape handles;</b> the <b>sterile nurse follows with hands in the green-iconed cuffs.</b> First handle: guide over the instrument-arm clutch button until the top is covered. Second handle: down the arm, over the cannula-arm joint, around the port clutch button, and up toward the boom.",
      image: "drape_arm_2.jpg", caption: "Walking the drape on",
      interaction: {
        type: "checklist",
        items: [
          "<b>Non-sterile:</b> first handle guided over the instrument-arm clutch button",
          "<b>Sterile:</b> hands in cuffs, following over the top of the arm",
          "<b>Non-sterile:</b> second handle down the arm, over joints, up to the boom",
          "Open end never folded back on itself",
        ],
      },
      callouts: [
        { kind: "caution", text: "Move in sync and avoid tension — <b>excess pull can tear the drape.</b> Sterile waits until the non-sterile nurse has the next handle before advancing." },
      ],
      side: { title: "Two-person move", type: "partner", role: "team",
        text: "Non-sterile leads the direction with the handles. Sterile mirrors with hands inside the cuffs. Communicate every hand-off out loud." },
    },
    {
      id: "a4", section: "arm", role: "team",
      title: "Anchor the magnetic discs",
      lede: "Mate the drape’s metal discs to the <b>red magnetic sockets</b> on the arm. <b>Sterile:</b> left-cuff disc to the front socket (then free your left hand), right-cuff disc to the back socket. <b>Non-sterile:</b> side disc to the side socket, then fold the plastic flap and press the Velcro closure.",
      image: "green_band.jpg", caption: "Green sterility band",
      interaction: {
        type: "checklist",
        items: [
          "<b>Sterile:</b> front + back discs seated on red sockets",
          "<b>Non-sterile:</b> side disc seated on red socket",
          "<b>Non-sterile:</b> plastic flap folded, Velcro pressed closed",
        ],
      },
      callouts: [
        { kind: "warning", label: "Stay above the line", text: "The non-sterile nurse must <b>not touch below the green line</b> at any point." },
      ],
      side: { title: "Disc map", type: "tips",
        items: ["Front socket — sterile (left cuff disc)", "Back socket — sterile (right cuff disc)", "Side socket — non-sterile (flap disc)"] },
    },

    /* ---------------- STRAPS ---------------- */
    {
      id: "s1", section: "straps", role: "sterile",
      title: "Secure the top drape strap",
      lede: "Find the drape strap on the uppermost part of the drape, <b>just below the sterility barrier.</b> Detach the green-arrow end, wrap it around the arm on the side <b>opposite the port clutch button,</b> and attach it to the Velcro.",
      image: "secure_top.jpg", caption: "Top strap",
      interaction: {
        type: "checklist",
        items: [
          "Green-arrow end detached",
          "Wrapped opposite the port clutch button",
          "Attached firmly to the Velcro",
        ],
      },
      side: { title: "Leave for later", type: "tips",
        items: ["The camera strap (Velcro tip) stays as-is — it secures the camera cable during surgery"] },
    },
    {
      id: "s2", section: "straps", role: "sterile",
      title: "Extend and dock the cannula arm",
      lede: "Bunch the cannula-arm drape, grasp the cannula arm through it, and <b>pull down until it clicks</b> fully extended. Then align the <b>indented edges</b> of the cannula sterile adapter and the cannula mount — no twist, no excess drape between them — and press until it clicks.",
      image: "cannula_extend.jpg", caption: "Extending the cannula arm",
      interaction: {
        type: "checklist",
        items: [
          "Cannula arm pulled down to a <b>fully-extended click</b>",
          "Sterile adapter indents aligned to the mount indents",
          "No twist or trapped drape between adapter and mount",
          "Adapter pressed until it <b>clicks</b> home",
        ],
      },
      side: { title: "Why it matters", type: "tips",
        items: ["Trapped drape or a twist will keep the adapter from seating", "A clean click confirms the sterile interface is set"] },
    },
    {
      id: "s3", section: "straps", role: "sterile",
      title: "Wrap remaining straps & flatten the top",
      lede: "Wrap the <b>two remaining straps</b> (between cannula arm and drives) tightly, peeling the adhesive backs. Center the <b>plastic strip</b> across the top of the arm and fold its flaps onto the Velcro so it lies flat. Attach the last metal disc, push the arm fully <b>vertical</b>, and remove the cross-shaped plastic from the drive adapters.",
      image: "straps_finish.jpg", caption: "Finishing the straps",
      interaction: {
        type: "checklist",
        items: [
          "Two straps wrapped tight; adhesive backs attached",
          "Plastic strip centered and flaps pressed flat",
          "Final metal disc seated on its red socket",
          "Arm pushed to fully vertical (clutch button)",
          "Cross-shaped plastic removed from drive adapters",
        ],
      },
      callouts: [
        { kind: "note", text: "A flat plastic strip keeps the drape from snagging as the top of the arm passes under the boom." },
      ],
      side: { title: "Almost there", type: "tips",
        items: ["With the arm vertical and discs set, the drives are ready to drape", "Confirm nothing is hanging loose near the boom"] },
    },

    /* ---------------- DRIVES ---------------- */
    {
      id: "v1", section: "drives", role: "sterile",
      title: "Drape the four instrument drives",
      lede: "Repeat for <b>each of the four drives.</b> Confirm the <b>blue pulsing ball,</b> press and quickly release the drive clutch (the drive lowers into the drape), pull the thick drape up so it doesn’t bunch, then press the sterile adapter in until it <b>clicks and the display turns solid blue.</b>",
      image: "drive_clutch.jpg", caption: "Draping a drive",
      interaction: { type: "drives" },
      callouts: [
        { kind: "caution", text: "<b>Solid blue</b> = adapter engaged. A <b>looping yellow circle</b> means reseat it — squeeze the release buttons, then reinstall." },
      ],
      side: { title: "Per-drive sequence", type: "moves",
        items: [
          "Blue pulsing ball = ready",
          "Press + release clutch — drive extends",
          "Lift thick drape so it won’t bunch",
          "Seat adapter → solid blue + beep",
          "Retract drive to loading position",
        ] },
    },

    /* ---------------- STOW ---------------- */
    {
      id: "f1", section: "stow", role: "sterile",
      title: "Inspect the drape",
      lede: "Carefully inspect the entire drape for <b>tears or damage</b> — especially near the tear-away tabs and handles — <b>without contacting the arm.</b> If you find a tear or any damage, do not use the drape.",
      image: "full_draped.jpg", caption: "Fully draped arm",
      interaction: {
        type: "checklist",
        items: [
          "Drape inspected end-to-end for tears or damage",
          "Tabs and handle areas checked closely",
          "Inspection done without touching the arm",
        ],
      },
      callouts: [
        { kind: "warning", label: "Head height", text: "The top of the arm may be near head level — keep <b>non-sterile headwear clear</b> of the sterile drape." },
      ],
      side: { title: "If damaged", type: "tips",
        items: ["A tear is a sterility breach — discard and re-drape with your backup", "Don’t attempt to patch or tape a torn drape"] },
    },
    {
      id: "f2", section: "stow", role: "nonsterile",
      title: "Sterile Stow the Patient Cart",
      lede: "Back at the touchpad, <b>press and hold “Sterile Stow”</b> to return the cart to its parked sterile position — or proceed directly to docking. Draping is complete.",
      image: "stow_1.jpg", caption: "Sterile stow",
      interaction: { type: "hold", action: "stow" },
      side: { title: "What’s next", type: "tips",
        items: ["From here: drive to the patient, dock, and proceed to port placement", "Instrument & accessory setup come later in this program"] },
    },
  ];

  window.SP_SECTIONS = SECTIONS;
  window.SP_STEPS = STEPS;
})();
