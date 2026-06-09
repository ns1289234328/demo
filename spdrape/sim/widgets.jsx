/* ============================================================
   Interactive widgets: Checklist, RingSnap, DriveDock, Callout
   ============================================================ */
(function () {
  const { useState, useEffect, useRef } = React;
  const h = React.createElement;

  const CheckIco = () => h("svg", { viewBox: "0 0 24 24", fill: "none" },
    h("path", { d: "M5 13l4 4L19 7", stroke: "#fff", strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round" }));

  /* ---- HTML helper ---- */
  const html = (s) => ({ dangerouslySetInnerHTML: { __html: s } });

  /* ---------------- Checklist ---------------- */
  function Checklist({ items, value, onChange }) {
    const toggle = (i) => {
      const next = value.slice();
      next[i] = !next[i];
      onChange(next);
    };
    return h("div", { className: "checklist" },
      items.map((t, i) =>
        h("button", { key: i, className: "check" + (value[i] ? " on" : ""), onClick: () => toggle(i) },
          h("span", { className: "box" }, h(CheckIco)),
          h("span", Object.assign({ className: "txt" }, html(t))),
        )));
  }

  /* ---------------- Ring snap ---------------- */
  function RingSnap({ value, onChange }) {
    // four connector positions around the ring (% of stage)
    const pos = [
      { x: 50, y: 7, label: "12" },
      { x: 93, y: 50, label: "3" },
      { x: 50, y: 93, label: "6" },
      { x: 7, y: 50, label: "9" },
    ];
    const seated = value.filter(Boolean).length;
    const tap = (i) => {
      if (value[i]) return;
      const next = value.slice(); next[i] = true; onChange(next);
    };
    return h("div", { className: "ring-wrap" },
      h("div", { className: "ring-stage" },
        h("svg", { viewBox: "0 0 100 100" },
          h("circle", { cx: 50, cy: 50, r: 40, fill: "none", stroke: "#cfd8d3", strokeWidth: 7 }),
          h("circle", { cx: 50, cy: 50, r: 40, fill: "none", stroke: "#14935a", strokeWidth: 7,
            strokeDasharray: 251.3, strokeDashoffset: 251.3 * (1 - seated / 4),
            transform: "rotate(-90 50 50)", style: { transition: "stroke-dashoffset .35s" } }),
          h("circle", { cx: 50, cy: 50, r: 27, fill: "none", stroke: "#e4e9e6", strokeWidth: 2 }),
          h("text", { x: 50, y: 47, textAnchor: "middle", fontSize: 11, fontWeight: 800, fill: "#14201d", fontFamily: "var(--mono)" }, seated + "/4"),
          h("text", { x: 50, y: 60, textAnchor: "middle", fontSize: 6.5, fill: "#7d8a85", fontFamily: "var(--mono)" }, "TABS SEATED"),
        ),
        pos.map((p, i) =>
          h("button", { key: i, className: "tab-btn" + (value[i] ? " on" : ""),
            style: { left: p.x + "%", top: p.y + "%" }, onClick: () => tap(i),
            title: p.label + " o'clock connector" },
            value[i] ? h(CheckIco) : "+")),
      ),
      h("div", { className: "ring-side" },
        h("div", { className: "rs-count" }, "Connectors locked: ", h("b", null, seated + " / 4")),
        h("p", null, seated < 4
          ? "Tap each dark-gray connector to seat its tab. Feel for an audible + tactile click as you press."
          : "All four tabs seated. The ring is captured — “Deploy — Step 2” is now available on the touchpad."),
      ),
    );
  }

  /* ---------------- Drive dock ---------------- */
  // phases per drive: 'ready' -> 'extending' -> 'extended' -> 'seated'
  function DriveDock({ initialDone, onProgress }) {
    const [phases, setPhases] = useState(() =>
      initialDone ? ["seated", "seated", "seated", "seated"] : ["ready", "ready", "ready", "ready"]);
    const timers = useRef({});
    useEffect(() => () => Object.values(timers.current).forEach(clearTimeout), []);
    useEffect(() => { onProgress(phases.filter((p) => p === "seated").length); }, [phases]);

    const clutch = (i) => {
      setPhases((prev) => {
        if (prev[i] !== "ready") return prev;
        const next = prev.slice(); next[i] = "extending"; return next;
      });
      timers.current[i] = setTimeout(() => {
        setPhases((prev) => {
          if (prev[i] !== "extending") return prev;
          const next = prev.slice(); next[i] = "extended"; return next;
        });
      }, 850);
    };
    const seat = (i) => {
      setPhases((prev) => {
        if (prev[i] !== "extended") return prev;
        const next = prev.slice(); next[i] = "seated"; return next;
      });
    };

    const stateAttr = (p) => p === "ready" ? "ready" : p === "seated" ? "seated" : "extend";

    return h("div", { className: "drives" },
      [0, 1, 2, 3].map((i) => {
        const p = phases[i];
        return h("div", { key: i, className: "drive", "data-state": stateAttr(p) },
          h("div", { className: "pod" }, h("span", { className: "ball" })),
          h("div", { className: "dl" }, "DRIVE " + (i + 1)),
          p === "seated"
            ? h("span", { className: "seated-tag" }, "● SOLID BLUE")
            : p === "ready"
              ? h("button", { className: "act", onClick: () => clutch(i) }, "Press clutch")
              : h("button", { className: "act", disabled: p === "extending", onClick: () => seat(i) },
                  p === "extending" ? "Extending…" : "Seat adapter"),
        );
      }));
  }

  /* ---------------- Callout ---------------- */
  const ICONS = {
    note: h("path", { d: "M12 8.5v5M12 16.2v.2", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" }),
    caution: h("path", { d: "M12 8v5M12 16.2v.2", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" }),
    warning: h("path", { d: "M12 8v5M12 16.2v.2", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" }),
  };
  const LBL = { note: "Note", caution: "Caution", warning: "Warning" };
  function Callout({ kind, label, text }) {
    const ring = kind === "note"
      ? h("circle", { cx: 12, cy: 12, r: 9, fill: "none", stroke: "currentColor", strokeWidth: 2 })
      : h("path", { d: "M12 3l9.5 16.5h-19z", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinejoin: "round" });
    return h("div", { className: "callout " + kind },
      h("svg", { className: "c-ico", viewBox: "0 0 24 24" }, ring, ICONS[kind]),
      h("div", null,
        h("span", { className: "lbl" }, (label || LBL[kind]) + " · "),
        h("span", Object.assign({}, html(text))),
      ),
    );
  }

  Object.assign(window, { SPChecklist: Checklist, SPRingSnap: RingSnap, SPDriveDock: DriveDock, SPCallout: Callout });
})();
