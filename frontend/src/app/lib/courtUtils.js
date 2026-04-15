//These sides are where the server serves from
function getAD_DEUCE(score) {
    if (score % 2 !== 0) {
        return "A";
    } else {
        return "D";
    }
}

const SERVE_ZONES = {
    D: {
        wide: {x: 340, y: 280},
        body: {x: 290, y: 280},
        T: {x: 240, y: 280},
    },
    A: {
        wide: {x: 95, y: 280},
        body: {x: 160, y: 280},
        T: {x: 220, y: 280},
    }
}

const Serve_Errors = {
    D: {
        "Net error": {x: 290, y: 0},
        "Deep error": {x: 0, y: 0},
        "Wide error": {x: 0, y: 0},
        "Wide and net error": {x: 0, y: 0},
    },
    A: {
        "Net error": {x: 0, y: 0},
        "Deep error": {x: 0, y: 0},
        "Wide error": {x: 0, y: 0},
    }
}

const Colors = {
    grass: {
        Ace: "#2296e6",
        in_play: "#ffffff",
    },

    hard: {
        Ace: "#FFD700",
        in_play: "green",
    },

    clay: {
        Ace: "blue",
        in_play: "green",
    }

}

const jitter = (range) => (Math.random() - 0.5) * range;

export function getServeCoordinates(direction, score, outcome, surface) {
    if (serve_outcome in Serve_Errors[direction]) {

    }
    const side = getAD_DEUCE(score);
    const base = SERVE_ZONES[side]?.[direction];
    const newColor = Colors[surface]?.[outcome];
    if (!base) return null;
    return {x: base.x + jitter(20), y: base.y + jitter(20), color: newColor || "red"}
}

