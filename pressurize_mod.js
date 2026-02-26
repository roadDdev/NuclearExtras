// ============================================================
//  SANDBOXELS MOD — Pressurize Tool  (v2 - fixed API)
//  How to install:
//    1. Go to neal.fun/sandboxels
//    2. Click "Mods" in the toolbar
//    3. Paste this file's URL OR load it locally
//    4. Refresh the page
//  Find the "Pressurize" tool in the Special category tab.
// ============================================================

// ── 1. PRESSURIZED WATER ────────────────────────────────────
elements.pressurized_water = {
    name: "Pressurized Water",
    desc: "Water kept under extreme pressure. Stays liquid all the way up to 800°C!",
    color: "#1a6fff",
    category: "liquids",
    state: "liquid",
    behavior: behaviors.LIQUID,
    density: 1.2,
    temp: 20,
    tempHigh: 800,
    stateHigh: "pressurized_steam",
    tempLow: -10,
    stateLow: "ice",
};

// ── 2. PRESSURIZED STEAM ────────────────────────────────────
elements.pressurized_steam = {
    name: "Pressurized Steam",
    desc: "Superheated steam under pressure. The hotter it is, the faster it shoots upward.",
    color: "#aaddff",
    category: "gases",
    state: "gas",
    behavior: behaviors.GAS,
    density: -3,
    temp: 800,
    tempLow: 99,
    stateLow: "water",
    conduct: 0.3,

    tick: function(pixel, x, y) {
        var t = pixel.temp || 800;

        // Color shifts: pale blue (cool) → bright white (very hot)
        var ratio = Math.min(1, Math.max(0, (t - 100) / 900));
        var r = Math.round(170 + 85 * ratio);
        var g = Math.round(221 + 34 * ratio);
        pixel.color = "rgb(" + r + "," + g + ",255)";

        // Extra upward steps based on temperature:
        //   ~800°C  → 0 extra (base GAS handles normal rise)
        //   ~1100°C → 1 extra step
        //   ~1700°C → 3 extra steps
        //   ~2300°C → 5 extra steps (max)
        var extraSteps = Math.min(5, Math.floor((t - 800) / 300));
        for (var i = 0; i < extraSteps; i++) {
            var ny = y - 1;
            if (ny < 0) break;
            if (!grid[x][ny]) {
                grid[x][ny] = grid[x][y];
                grid[x][y] = null;
                y = ny;
            } else if (
                grid[x][ny].state === "liquid" ||
                grid[x][ny].state === "powder"
            ) {
                var tmp = grid[x][ny];
                grid[x][ny] = grid[x][y];
                grid[x][y] = tmp;
                y = ny;
            } else {
                break;
            }
        }
    },
};

// ── 3. PRESSURIZE TOOL ──────────────────────────────────────
elements.pressurize = {
    name: "Pressurize",
    desc: "Click on Water to pressurize it — raises its boiling point to 800°C!",
    color: "#0033cc",
    category: "special",

    // "tool" property is the correct way to define a tool in Sandboxels
    tool: function(pixel) {
        if (pixel.element === "water") {
            pixel.element = "pressurized_water";
            pixel.color = elements.pressurized_water.color;
        }
    },
};

console.log(
    "%c[Pressurize Mod] ✅ Loaded! Find 'Pressurize' in the Special tab.",
    "color:#1a6fff; font-weight:bold; font-size:13px;"
);
