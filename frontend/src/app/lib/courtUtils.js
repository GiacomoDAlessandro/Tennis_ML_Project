
//These sides are where the server serves from
function getAD_DEUCE(score) {
    score = score.trimEnd()

    if (score === "AD-40" || score === "40-AD") {
        return "A";
    }
    const scoreArray = score.split('-').map(s => parseInt(s) || 0);
    let sum = scoreArray[0] + scoreArray[1];

    if (sum % 2 !== 0) {
        return "Ad";
    } else {
        return "Deuce";
    }
}

const SERVE_ZONES = {
    D: {
        wide: { x: 340, y: 330 },
        body: { x: 290, y: 330 },
        T:    { x: 240, y: 330 },
    },
    A: {
        wide: { x: 95,  y: 330 },
        body: { x: 160, y: 330 },
        T:    { x: 220, y: 330 },
    }
}

const jitter = (range) => (Math.random() - 0.5) * range;

export function getServeCoordinates(direction, side, outcome) {
    const base = SERVE_ZONES[side]?.[direction];
    if (!base) return null;
    return { x: base.x + jitter(20), y: base.y + jitter(20)}
}

