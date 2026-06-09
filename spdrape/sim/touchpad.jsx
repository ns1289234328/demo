/* ============================================================
   Patient Cart touchpad — original device-style control panel.
   Reflects draping state; hosts the press-and-hold deploy controls.
   ============================================================ */
(function () {
  const { useState, useRef, useEffect, useCallback } = React;

  function deriveView(done) {
    if (!done.deploy1)
      return { mode: "home", status: "Ready", buttons: [{ action: "deploy1", n: "STEP 1", label: "Deploy for Draping" }] };
    if (!done.ring)
      return { mode: "waiting", status: "In progress", wt: "Waiting on Sterile Tasks", ws: "Install the drape ring to continue" };
    if (!done.deploy2)
      return { mode: "home", status: "Ready", buttons: [{ action: "deploy2", n: "STEP 2", label: "Deploy for Draping" }] };
    if (!done.drives)
      return { mode: "waiting", status: "In progress", wt: "Waiting on Sterile Tasks", ws: "Drape the arm and seat the four drives", drives: true };
    if (!done.stow)
      return { mode: "home", status: "Ready", buttons: [
        { action: "stow", label: "Sterile Stow" },
        { action: null, label: "Deploy for Docking", idle: true },
      ] };
    return { mode: "home", status: "Complete", buttons: [{ action: null, label: "Deploy for Docking", highlight: true }] };
  }

  function HoldButton({ btn, pressable, onComplete }) {
    const [holding, setHolding] = useState(false);
    const fillRef = useRef(null);
    const raf = useRef(0);
    const startT = useRef(0);
    const DUR = 1300;

    const stop = useCallback(() => {
      cancelAnimationFrame(raf.current);
      setHolding(false);
      if (fillRef.current) fillRef.current.style.width = "0%";
    }, []);

    const tick = useCallback(() => {
      const p = Math.min(1, (performance.now() - startT.current) / DUR);
      if (fillRef.current) fillRef.current.style.width = (p * 100) + "%";
      if (p >= 1) { setHolding(false); onComplete && onComplete(); return; }
      raf.current = requestAnimationFrame(tick);
    }, [onComplete]);

    const begin = useCallback((e) => {
      if (!pressable) return;
      e.preventDefault();
      setHolding(true);
      startT.current = performance.now();
      raf.current = requestAnimationFrame(tick);
    }, [pressable, tick]);

    useEffect(() => () => cancelAnimationFrame(raf.current), []);

    const cls = ["dvbtn"];
    if (btn.idle) cls.push("idle");
    else if (pressable) cls.push("live");
    if (holding) cls.push("holding");
    if (btn.highlight) cls.push("live");

    return (
      React.createElement("button", {
        className: cls.join(" "),
        disabled: !pressable && !btn.highlight,
        onPointerDown: begin,
        onPointerUp: stop,
        onPointerLeave: stop,
        onPointerCancel: stop,
        style: (!pressable && !btn.highlight) ? { cursor: "default" } : null,
      },
        React.createElement("span", { className: "holdfill", ref: fillRef }),
        btn.n ? React.createElement("span", { className: "n" }, btn.n) : null,
        React.createElement("span", null, btn.label),
        pressable ? React.createElement("span", { className: "hold-hint" }, holding ? "HOLD…" : "PRESS + HOLD") : null,
      )
    );
  }

  function Touchpad({ done, currentAction, drivesSeated, onComplete }) {
    const v = deriveView(done);
    return (
      React.createElement("div", { className: "device" },
        React.createElement("div", { className: "device-top" },
          React.createElement("div", { className: "name" }, React.createElement("b", null, "PATIENT CART"), " · TOUCHPAD"),
          React.createElement("div", { className: "batt" },
            "AC",
            React.createElement("span", { className: "cell" }, React.createElement("i", null)),
          ),
        ),
        React.createElement("div", { className: "screen" },
          React.createElement("div", { className: "scr-status" },
            React.createElement("span", { className: "live" }),
            v.status,
          ),

          v.mode === "waiting"
            ? React.createElement("div", { className: "waiting" },
                React.createElement("div", { className: "spin" }),
                React.createElement("div", { className: "wt" }, v.wt),
                React.createElement("div", { className: "ws" }, v.ws),
                v.drives ? React.createElement("div", { className: "dev-drives" },
                  [0, 1, 2, 3].map((i) =>
                    React.createElement("span", { key: i, className: "d" + (i < drivesSeated ? " on" : "") })),
                ) : null,
              )
            : React.createElement(React.Fragment, null,
                React.createElement("div", { className: "scr-msg" },
                  done.stow ? "Draping complete" : "Select the highlighted action"),
                React.createElement("div", { className: "scr-sub" },
                  done.stow ? "Ready to drive and dock." : "Press and hold the green button until the motion completes."),
                React.createElement("div", { className: "scr-btns" },
                  v.buttons.map((b, i) =>
                    React.createElement(HoldButton, {
                      key: i, btn: b,
                      pressable: !!b.action && currentAction === b.action && !done[b.action],
                      onComplete: () => onComplete(b.action),
                    })),
                ),
              ),
        ),
      )
    );
  }

  window.SPTouchpad = Touchpad;
})();
