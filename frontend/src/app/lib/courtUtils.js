//These sides are where the server serves from
function getAD_DEUCE(score) {
    if (score % 2 == 0) {
        return "D";
    } else {
        return "A";
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
        wide: {
            "Net error": {x: 370, y: 440},
            "Deep error": {x: 370, y: 195},
            "Wide error": {x: 420, y: 280},
            "Wide and net error": {x: 420, y: 155},
        },
        body: {
            "Net error": {x: 290, y: 440},
            "Deep error": {x: 290, y: 195},
            "Wide error": {x: 390, y: 280},
            "Wide and net error": {x: 390, y: 155},
        },
        T: {
            "Net error": {x: 220, y: 440},
            "Deep error": {x: 220, y: 195},
            "Wide error": {x: 150, y: 280},
            "Wide and net error": {x: 150, y: 155},
        },
    },
    A: {
        wide: {
            "Net error": {x: 60, y: 450},
            "Deep error": {x: 60, y: 195},
            "Wide error": {x: 20, y: 280},
            "Wide and net error": {x: 20, y: 155},
        },
        body: {
            "Net error": {x: 160, y: 450},
            "Deep error": {x: 160, y: 195},
            "Wide error": {x: 60, y: 280},
            "Wide and net error": {x: 60, y: 155},
        },
        T: {
            "Net error": {x: 220, y: 450},
            "Deep error": {x: 220, y: 195},
            "Wide error": {x: 290, y: 280},
            "Wide and net error": {x: 290, y: 155},
        },
    }
}

const Colors = {
    grass: {
        Ace: "#2296e6",
        in_play: "#ffffff",
        Unreturnable: "#2296e6",
    },

    hard: {
        Ace: "#FFD700",
        Unreturnable: "#2296e6",
        in_play: "green",
    },

    clay: {
        Ace: "blue",
        Unreturnable: "blue",
        in_play: "green",
    }

}

const jitter = (range) => (Math.random() - 0.5) * range;

export function getServeCoordinates(first_direction, first_outcome, second_direction,
                                    second_outcome, had_fault, score, surface) {
    const side = getAD_DEUCE(score);
    const shots = [];

    surface = surface?.toLowerCase();

    let firstLoc;
    const error = Serve_Errors[side]?.[first_direction]?.[first_outcome];
    if (error) {
        firstLoc = error;
    } else {
        firstLoc = SERVE_ZONES[side]?.[first_direction];
    }

    if (firstLoc && first_outcome !== "Shank") {
        const isError = error || had_fault;
        const color = isError ? "red" : (Colors[surface]?.[first_outcome] ||  "black");
        shots.push({x: firstLoc.x + jitter(20), y: firstLoc.y + jitter(20), color: color});
    }

    if (had_fault && second_direction) {
        let secondLoc;
        const secondError = Serve_Errors[side]?.[second_direction]?.[second_outcome];

        if (secondError) {
            secondLoc = secondError;
        } else {
            secondLoc = SERVE_ZONES[side]?.[second_direction];
        }

        if (secondLoc && second_outcome !== "Shank") {
            const color = secondError ? "red" : (Colors[surface]?.[second_outcome] || "black");
            shots.push({x: secondLoc.x + jitter(20), y: secondLoc.y + jitter(20), color: color})
        }
    }

    return shots;
}


