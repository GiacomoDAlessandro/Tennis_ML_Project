import {SIDE_PAD} from "../lib/courtConstants";
import {Layer, Circle, Label, Tag, Text} from "react-konva";
import {useState, useEffect} from "react";
import {getServeCoordinates} from "../lib/courtUtils";


export default function ShotLayer({s, matchId, playerName, surface, onStatsChange}) {
    const [shots, setShots] = useState([]);
    const [hoveredShot, setHoveredShot] = useState(null);

    useEffect(() => {
        if (!matchId) return;
        fetch(`http://localhost:8000/getPlayerServes/${matchId}/${playerName}`)
            .then((res) => res.json())
            .then((data) => {
                const nextShots = data["points"].flatMap((point) =>
                    getServeCoordinates(
                        point.score,
                        point.first_serve_direction,
                        point.first_serve_outcome,
                        point.second_serve_direction,
                        point.second_serve_outcome,
                        point.had_fault,
                        surface
                    ).map((shot) => ({
                        ...shot,
                        gameScore: `${point.game1 ?? "?"}-${point.game2 ?? "?"}`,
                        setScore: `${point.set1 ?? "?"}-${point.set2 ?? "?"}`,
                    }))
                ).filter((shot) => shot !== null);
                setShots(nextShots);
            })
    }, [matchId, playerName, surface]);

    const counts = shots.reduce((acc, shot) => {
        const outcome = shot.outcome;
        if (outcome === "Ace") acc.aces += 1;
        else if (outcome === "Unreturnable") acc.unreturnables += 1;
        else if (outcome === "in_play") acc.inPlay += 1;
        else if (shot.color === "red") acc.faults += 1;
        return acc;
    }, {aces: 0, unreturnables: 0, inPlay: 0, faults: 0});

    const formatOutcome = (outcome) => {
        if (!outcome) return "N/A";
        if (outcome === "in_play") return "In play";
        return outcome;
    };

    const formatServeDirection = (direction) => {
        if (!direction) return "N/A";
        if (direction === "T") return "T";
        return direction.charAt(0).toUpperCase() + direction.slice(1);
    };

    useEffect(() => {
        onStatsChange?.(counts);
    }, [counts, onStatsChange]);

    return (
        <Layer scaleX={s} scaleY={s}>
            {shots.map((shot, i) => (
                <Circle
                    key={i}
                    x={shot.x + SIDE_PAD}
                    y={shot.y}
                    radius={5}
                    fill={shot.color}
                    onMouseEnter={(e) => {
                        const stagePos = e.target.getStage()?.getPointerPosition();
                        setHoveredShot({
                            shot,
                            x: stagePos?.x ?? 0,
                            y: stagePos?.y ?? 0,
                        });
                    }}
                    onMouseMove={(e) => {
                        const stagePos = e.target.getStage()?.getPointerPosition();
                        setHoveredShot((prev) => prev ? ({
                            ...prev,
                            x: stagePos?.x ?? prev.x,
                            y: stagePos?.y ?? prev.y,
                        }) : prev);
                    }}
                    onMouseLeave={() => setHoveredShot(null)}
                />
            ))}
            {hoveredShot && (
                <Label x={(hoveredShot.x / s) + 8} y={(hoveredShot.y / s) - 10}>
                    <Tag
                        fill="#0f172a"
                        opacity={0.94}
                        cornerRadius={8}
                        pointerDirection="left"
                        pointerWidth={7}
                        pointerHeight={7}
                        lineJoin="round"
                        shadowColor="#020617"
                        shadowBlur={10}
                        shadowOpacity={0.35}
                        shadowOffsetY={2}
                    />
                    <Text
                        text={`Set ${hoveredShot.shot.setScore ?? "N/A"}\nGames ${hoveredShot.shot.gameScore ?? "N/A"}\nPoint ${hoveredShot.shot.score ?? "N/A"}\nServe ${hoveredShot.shot.serveNumber ?? "?"} (${formatServeDirection(hoveredShot.shot.serveDirection)})\n${formatOutcome(hoveredShot.shot.outcome)}`}
                        fontSize={12}
                        fontStyle="500"
                        padding={8}
                        lineHeight={1.25}
                        fill="#f8fafc"
                    />
                </Label>
            )}
        </Layer>
    )
}