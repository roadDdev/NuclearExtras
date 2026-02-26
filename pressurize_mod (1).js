// ============================================================
//  SANDBOXELS MOD — Pressurize Tool  (v3 - correct API)
//  How to install:
//    1. Go to neal.fun/sandboxels
//    2. Click "Mods" in the toolbar
//    3. Paste the raw GitHub URL of this file
//  The "Pressurize" tool will appear in the TOOLBAR (top bar).
// ============================================================

// ── 1. PRESSURIZED WATER ────────────────────────────────────
elements.pressurized_water = {
    name: "Pressurized Water",
    desc: "Water under extreme pressure. Stays liquid all the way up to 800°C!",
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
    desc: "Superheated steam. The hotter it is, the faster it rockets upward.",
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

        // Color: pale blue (cool) → bright white (very hot)
        var ratio = Math.min(1, Math.max(0, (t - 100) / 900));
        var r = Math.round(170 + 85 * ratio);
        var g = Math.round(221 + 34 * ratio);
        pixel.color = "rgb(" + r + "," + g + ",255)";

        // Extra upward movement based on temperature
        // 800°C = 0 extra | 1100°C = 1 extra | 2000°C = 4 extra (max 5)
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
// category: "tools" = appears in the TOP TOOLBAR (like Heat, Cool, Shock)
elements.pressurize = {
    name: "Pressurize",
    desc: "Click on Water to pressurize it — raises its boiling point to 800°C!",
    color: "#0033cc",
    category: "tools",

    // changePixel() is the correct Sandboxels function to convert a pixel
    tool: function(pixel) {
        if (pixel.element === "water") {
            changePixel(pixel, "pressurized_water");
        }
    },
};

console.log(
    "%c[Pressurize Mod] ✅ Loaded! Find 'Pressurize' in the top toolbar.",
    "color:#1a6fff; font-weight:bold; font-size:13px;"
);
