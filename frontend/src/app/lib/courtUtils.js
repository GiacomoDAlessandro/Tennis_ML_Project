
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
        wide: { x: 340, y: 280 },
        body: { x: 290, y: 280 },
        T:    { x: 240, y: 280 },
    },
    A: {
        wide: { x: 95,  y: 280 },
        body: { x: 160, y: 280 },
        T:    { x: 220, y: 280 },
    }
}

const jitter = (range) => (Math.random() - 0.5) * range;

export function getServeCoordinates(direction, score) {
    const side = getAD_DEUCE(score);
    const base = SERVE_ZONES[side]?.[direction];
    if (!base) return null;
    return { x: base.x + jitter(20), y: base.y + jitter(20)}
}

