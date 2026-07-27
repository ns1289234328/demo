/* ============================================================
   App shell — start screen, rail, step card, side panel, finish
   ============================================================ */
(function () {
  const { useState, useEffect, useMemo, useCallback } = React;
  const h = React.createElement;
  const html = (s) => ({ dangerouslySetInnerHTML: { __html: s } });

  const SECTIONS = window.SP_SECTIONS;
  const STEPS = window.SP_STEPS;
  const IMG = "assets/steps/";
  const LS = "sp_draping_v1";

  const ROLE_LABEL = { sterile: "Sterile", nonsterile: "Non-Sterile", team: "Team" };
  const ROLE_DOT = { sterile: "var(--sterile)", nonsterile: "var(--nonsterile)", team: "var(--brand)" };

  const BrandMark = () => h("div", { className: "brand-mark" }, h("span", null, "SP"));

  /* ---------------- Start screen ---------------- */
  function StartScreen({ hasSave, onPick, onResume }) {
    const opts = [
      { role: "sterile", cls: "s", t: "Scrub / Sterile", d: "You handle the drape and seat the adapters. Steps for you are fully interactive; your partner’s steps play out alongside." },
      { role: "nonsterile", cls: "n", t: "Circulating / Non-Sterile", d: "You drive the touchpad and guide the drape by its handles. The “Deploy” and “Stow” controls are yours." },
      { role: "team", cls: "t", t: "Watch the whole flow", d: "See every step from both roles, fully interactive — ideal for facilitators and first run-throughs." },
    ];
    return h("div", { className: "start" },
      h("div", { className: "start-top" },
        h(BrandMark),
        h("div", null,
          h("div", { className: "org" }, "Henry Ford Health"),
          h("div", { className: "sub" }, "Surgical Robotics · OR Staff"),
        ),
      ),
      h("div", { className: "start-inner" },
        h("div", { className: "start-copy" },
          h("div", { className: "eyebrow" }, "Interactive In-Service"),
          h("h1", null, "Draping the ", h("em", null, "da Vinci SP"), " instrument arm"),
          h("p", null, "A guided, hands-on walkthrough of the sterile draping workflow — from “Deploy for Draping” through seating all four instrument drives and stowing the cart."),
          h("p", { style: { fontSize: "14px", color: "#aedccf" } }, "Pick the role you’ll play in the OR. You can switch roles at any time."),
          h("div", { className: "start-facts" },
            h("div", { className: "f" }, h("div", { className: "n" }, "6"), h("div", { className: "l" }, "Sections")),
            h("div", { className: "f" }, h("div", { className: "n" }, "14"), h("div", { className: "l" }, "Guided steps")),
            h("div", { className: "f" }, h("div", { className: "n" }, "2"), h("div", { className: "l" }, "Person team")),
          ),
        ),
        h("div", { className: "role-pick" },
          h("h2", null, "Choose your role"),
          h("p", { className: "rp-sub" }, "Draping is a two-person task — one sterile, one non-sterile, always coordinating."),
          opts.map((o) =>
            h("button", { key: o.role, className: "role-opt", onClick: () => onPick(o.role) },
              h("span", { className: "ri " + o.cls }, ROLE_LABEL[o.role][0]),
              h("span", { className: "rt" }, h("b", null, o.t), h("span", null, o.d)),
            )),
          hasSave ? h("div", { className: "resume-note" },
            "You have progress saved. ",
            h("button", { onClick: onResume }, "Resume where you left off"),
          ) : null,
        ),
      ),
    );
  }

  /* ---------------- Rail ---------------- */
  function Rail({ curSection, sectionState, onJump }) {
    return h("div", { className: "rail" },
      h("h3", null, "Draping workflow"),
      SECTIONS.map((s) => {
        const st = sectionState[s.key];
        const active = s.key === curSection;
        const done = st.done === st.total && st.total > 0;
        const locked = !st.reached;
        const cls = ["sec", active ? "active" : "", done ? "done" : "", locked ? "locked" : ""].join(" ");
        return h("div", { key: s.key, className: cls, onClick: () => !locked && onJump(s.key) },
          h("div", { className: "sec-ico" }, done ? "✓" : s.n),
          h("div", { className: "sec-body" },
            h("div", { className: "sec-name" }, s.name),
            h("div", { className: "sec-meta" }, locked ? s.short : (done ? "Complete" : st.done + " / " + st.total + " done")),
            !locked ? h("div", { className: "sec-bar" }, h("i", { style: { width: (st.total ? (st.done / st.total * 100) : 0) + "%" } })) : null,
          ),
        );
      }),
      h("div", { className: "rail-foot" },
        "Training aid based on the SP System In-Service Guide (OR Staff). Not a substitute for the manufacturer’s instructions for use."),
    );
  }

  /* ---------------- Side info ---------------- */
  function SideInfo({ step }) {
    const s = step.side;
    if (!s) return null;
    return h("div", { className: "side-info" },
      h("h4", null, s.title),
      s.type === "partner"
        ? h("div", { className: "partner" }, h("div", { className: "pt" }, s.text))
        : h("ul", { className: "movelist" },
            s.items.map((it, i) =>
              h("li", { key: i },
                h("span", { className: "mk" }, s.type === "moves" ? "→" : "•"),
                h("span", Object.assign({}, html(it))),
              ))),
    );
  }

  /* ---------------- Finish ---------------- */
  function Finish({ role, onReview, onRestart }) {
    return h("div", { className: "fin" },
      h("div", { className: "seal" },
        h("svg", { viewBox: "0 0 24 24", width: 42, height: 42, fill: "none" },
          h("path", { d: "M5 13l4 4L19 7", stroke: "#fff", strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round" })),
      ),
      h("h1", null, "Arm draped & stowed"),
      h("p", null, "You’ve completed the SP instrument-arm draping workflow — sterile barrier intact, all four drives seated, and the cart sterile-stowed. Next in the OR: drive to the patient, dock, and proceed to port placement."),
      h("div", { className: "recap" },
        h("div", { className: "rc" }, h("div", { className: "rk" }, "ROLE"), h("div", { className: "rv" }, ROLE_LABEL[role])),
        h("div", { className: "rc" }, h("div", { className: "rk" }, "SECTIONS"), h("div", { className: "rv" }, "6 / 6")),
        h("div", { className: "rc" }, h("div", { className: "rk" }, "DRIVES SEATED"), h("div", { className: "rv" }, "4 / 4")),
      ),
      h("div", { className: "fin-btns" },
        h("button", { className: "btn", onClick: onReview }, "Review the steps"),
        h("button", { className: "btn primary", onClick: onRestart }, "Start over"),
      ),
    );
  }

  /* ---------------- App ---------------- */
  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "brand": "#0a5e50",
    "showPhotos": true,
    "cautionStyle": "subtle"
  }/*EDITMODE-END*/;

  function App() {
    const [t, setTweak] = window.useTweaks(TWEAK_DEFAULTS);
    useEffect(() => {
      document.documentElement.style.setProperty("--brand", t.brand);
      document.body.classList.toggle("no-photos", !t.showPhotos);
      document.body.classList.toggle("bold-cautions", t.cautionStyle === "bold");
    }, [t.brand, t.showPhotos, t.cautionStyle]);

    const [phase, setPhase] = useState("start");
    const [role, setRole] = useState("team");
    const [idx, setIdx] = useState(0);
    const [done, setDone] = useState({});
    const [ss, setSS] = useState({});           // per-step interaction state by id
    const [drivesSeated, setDrivesSeated] = useState(0);
    const [hasSave, setHasSave] = useState(false);

    // load save
    useEffect(() => {
      try {
        const raw = localStorage.getItem(LS);
        if (raw) { const s = JSON.parse(raw); if (s && s.role) setHasSave(true); }
      } catch (e) {}
    }, []);

    // persist
    useEffect(() => {
      if (phase === "start") return;
      try {
        localStorage.setItem(LS, JSON.stringify({ role, idx, done, ss, drivesSeated, phase }));
      } catch (e) {}
    }, [phase, role, idx, done, ss, drivesSeated]);

    const step = STEPS[idx];
    const sec = SECTIONS.find((s) => s.key === step.section);

    const isMine = useCallback((stp) =>
      role === "team" || stp.role === "team" || stp.role === role, [role]);

    // section progress for rail
    const sectionState = useMemo(() => {
      const map = {};
      SECTIONS.forEach((s) => { map[s.key] = { total: 0, done: 0, reached: false }; });
      STEPS.forEach((st, i) => {
        const m = map[st.section];
        m.total++;
        if (i < idx) m.done++;
        if (i <= idx) m.reached = true;
      });
      // current section: count current step as done if its interaction is satisfied
      return map;
    }, [idx]);

    const stepSatisfied = useCallback((stp) => {
      if (!isMine(stp)) return true;
      const it = stp.interaction;
      const state = ss[stp.id];
      switch (it.type) {
        case "checklist": return Array.isArray(state) && state.filter(Boolean).length === it.items.length;
        case "hold": return !!done[it.action];
        case "ring": return Array.isArray(state) && state.filter(Boolean).length === 4;
        case "drives": return !!done.drives;
        default: return true;
      }
    }, [ss, done, isMine]);

    const canAdvance = stepSatisfied(step);

    const goNext = useCallback(() => {
      setIdx((i) => {
        if (i < STEPS.length - 1) return i + 1;
        setPhase("done"); return i;
      });
    }, []);
    const goBack = useCallback(() => setIdx((i) => Math.max(0, i - 1)), []);

    const jumpSection = useCallback((key) => {
      const first = STEPS.findIndex((s) => s.section === key);
      if (first >= 0 && first <= idx + 0) setIdx(first); // only allow reached sections (rail enforces)
      else if (first >= 0) setIdx(first);
    }, [idx]);

    // touchpad hold complete
    const onHoldComplete = useCallback((action) => {
      if (!action) return;
      setDone((d) => ({ ...d, [action]: true }));
    }, []);

    // partner continue (auto-complete the partner's hold action)
    const partnerContinue = useCallback(() => {
      const it = step.interaction;
      if (it.type === "hold" && it.action) setDone((d) => ({ ...d, [it.action]: true }));
      if (it.type === "drives") { setDone((d) => ({ ...d, drives: true })); setDrivesSeated(4); }
      goNext();
    }, [step, goNext]);

    const startWith = (r) => { setRole(r); setIdx(0); setDone({}); setSS({}); setDrivesSeated(0); setPhase("sim"); };
    const resume = () => {
      try {
        const s = JSON.parse(localStorage.getItem(LS));
        setRole(s.role); setIdx(s.idx || 0); setDone(s.done || {}); setSS(s.ss || {});
        setDrivesSeated(s.drivesSeated || 0); setPhase(s.phase === "done" ? "done" : "sim");
      } catch (e) { setPhase("sim"); }
    };
    const restart = () => { localStorage.removeItem(LS); setPhase("start"); setHasSave(false); };

    const currentAction = (isMine(step) && step.interaction.type === "hold") ? step.interaction.action : null;

    const jumpToPad = useCallback(() => {
      const el = document.querySelector(".device");
      if (!el) return;
      const y = el.getBoundingClientRect().top + window.pageYOffset - 70;
      window.scrollTo({ top: y, behavior: "smooth" });
    }, []);

    const renderTweaks = () => h(window.TweaksPanel, null,
      h(window.TweakSection, { label: "Brand" }),
      h(window.TweakColor, {
        label: "Henry Ford green", value: t.brand,
        options: ["#0a5e50", "#00674f", "#0e6b6e", "#0c5a3f", "#114c44"],
        onChange: (v) => setTweak("brand", v),
      }),
      h(window.TweakSection, { label: "Display" }),
      h(window.TweakToggle, {
        label: "Reference photos", value: t.showPhotos,
        onChange: (v) => setTweak("showPhotos", v),
      }),
      h(window.TweakRadio, {
        label: "Caution callouts", value: t.cautionStyle,
        options: ["subtle", "bold"],
        onChange: (v) => setTweak("cautionStyle", v),
      }),
    );

    /* ---- render interaction ---- */
    function renderInteraction() {
      const mine = isMine(step);
      const it = step.interaction;
      if (!mine) {
        return h("div", { className: "callout note", style: { marginTop: 0 } },
          h("svg", { className: "c-ico", viewBox: "0 0 24 24" },
            h("circle", { cx: 12, cy: 12, r: 9, fill: "none", stroke: "currentColor", strokeWidth: 2 }),
            h("path", { d: "M12 8.5v5M12 16.2v.2", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" })),
          h("div", null,
            h("span", { className: "lbl" }, "Your teammate (" + ROLE_LABEL[step.role] + ") · "),
            h("span", null, "performs this step. Watch the hand-off, then continue.")),
        );
      }
      switch (it.type) {
        case "checklist":
          return h(window.SPChecklist, {
            items: it.items,
            value: ss[step.id] || it.items.map(() => false),
            onChange: (v) => setSS((s) => ({ ...s, [step.id]: v })),
          });
        case "ring":
          return h(window.SPRingSnap, {
            value: ss[step.id] || [false, false, false, false],
            onChange: (v) => {
              setSS((s) => ({ ...s, [step.id]: v }));
              if (v.filter(Boolean).length === 4) setDone((d) => ({ ...d, ring: true }));
            },
          });
        case "drives":
          return h(window.SPDriveDock, {
            initialDone: !!done.drives,
            onProgress: (n) => { setDrivesSeated(n); if (n === 4) setDone((d) => ({ ...d, drives: true })); },
          });
        case "hold":
          return h("div", { className: "callout note", style: { marginTop: 0 } },
            h("svg", { className: "c-ico", viewBox: "0 0 24 24" },
              h("circle", { cx: 12, cy: 12, r: 9, fill: "none", stroke: "currentColor", strokeWidth: 2 }),
              h("path", { d: "M12 8.5v5M12 16.2v.2", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" })),
            h("div", null,
              h("span", { className: "lbl" }, "Use the touchpad · "),
              h("span", null, done[it.action]
                ? "Done — the cart has moved into position."
                : "Press and hold the highlighted green button on the Patient Cart touchpad."),
              !done[it.action]
                ? h("button", { className: "jump-pad", onClick: jumpToPad }, "Go to touchpad ↓")
                : null));
        default:
          return null;
      }
    }

    /* ---- screens ---- */
    if (phase === "start")
      return h(React.Fragment, null,
        h(StartScreen, { hasSave, onPick: startWith, onResume: resume }),
        renderTweaks());

    const finished = phase === "done";

    return h(React.Fragment, null, h("div", { className: "app" },
      // top bar
      h("div", { className: "topbar" },
        h("div", { className: "brand-lockup" }, h(BrandMark),
          h("div", { className: "brand-text" },
            h("div", { className: "org" }, "Henry Ford Health"),
            h("div", { className: "sub" }, "Surgical Robotics"))),
        h("div", { className: "divider" }),
        h("div", { className: "title" }, "da Vinci SP · ", h("b", null, "Instrument-Arm Draping")),
        h("div", { className: "spacer" }),
        h("div", { className: "role-chip" },
          h("span", { className: "dot", style: { background: ROLE_DOT[role] } }),
          ROLE_LABEL[role],
          h("button", { onClick: restart }, "switch")),
        !finished ? h("div", { className: "prog-pill" }, "STEP " + String(idx + 1).padStart(2, "0") + " / " + STEPS.length) : null,
      ),

      finished
        ? h(Finish, { role, onReview: () => { setPhase("sim"); setIdx(0); }, onRestart: restart })
        : h("div", { className: "stage" },
            h(Rail, { curSection: step.section, sectionState, onJump: jumpSection }),

            // center card
            h("div", { className: "card" },
              h("div", { className: "card-head" },
                h("div", { className: "badge-row" },
                  h("span", { className: "role-badge " + step.role }, h("span", { className: "ico" }), ROLE_LABEL[step.role]),
                  h("span", { className: "step-tag" }, sec.n + " · " + sec.name),
                )),
              h("div", { className: "card-body" },
                h("div", { className: "card-main" },
                  h("h2", { className: "step-title" }, step.title),
                  h("p", Object.assign({ className: "step-lede" }, html(step.lede))),
                  renderInteraction(),
                  (step.callouts || []).map((c, i) =>
                    h(window.SPCallout, { key: i, kind: c.kind, label: c.label, text: c.text })),
                ),
                h("div", { className: "media-wrap" },
                  h("div", { className: "media" },
                    h("img", { src: IMG + step.image, alt: step.title, draggable: false }),
                    h("span", { className: "cap" }, step.caption)),
                  h("div", { className: "media-note" }, "Reference still from the SP draping video."),
                ),
              ),
              h("div", { className: "card-foot" },
                h("button", { className: "btn", onClick: goBack, disabled: idx === 0 }, "← Back"),
                !canAdvance && isMine(step)
                  ? h("span", { className: "hint" }, h("span", { className: "dotpulse" }),
                      step.interaction.type === "checklist" ? "Confirm each item to continue"
                      : step.interaction.type === "ring" ? "Seat all four tabs to continue"
                      : step.interaction.type === "drives" ? "Seat all four drives to continue"
                      : step.interaction.type === "hold" ? "Press and hold on the touchpad" : "")
                  : null,
                h("div", { className: "spacer" }),
                !isMine(step)
                  ? h("button", { className: "btn primary", onClick: partnerContinue }, "Continue →")
                  : h("button", { className: "btn primary", onClick: goNext, disabled: !canAdvance },
                      idx === STEPS.length - 1 ? "Finish ✓" : "Next →"),
              ),
            ),

            // right side
            h("div", { className: "side" },
              h(window.SPTouchpad, { done, currentAction, drivesSeated, onComplete: onHoldComplete }),
              h(SideInfo, { step }),
            ),
          ),
    ), renderTweaks());
  }

  window.SPApp = App;
})();
