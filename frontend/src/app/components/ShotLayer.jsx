import {COURT_W, COURT_H, SIDE_PAD} from "../lib/courtConstants";
import {Layer, Circle} from "react-konva";
import {useState, useEffect} from "react";
import {getServeCoordinates} from "../lib/courtUtils";


export default function ShotLayer({s, matchId, playerName, surface}) {
    const [shots, setShots] = useState([]);

    useEffect(() => {
        if (!matchId) return;
        fetch(`http://localhost:8000/getPlayerServes/${matchId}/${playerName}`)
            .then((res) => res.json())
            .then((data) => {
                setShots(data['points'].flatMap(point => getServeCoordinates(point.first_serve_direction, point.first_serve_outcome, point.second_serve_direction,
                    point.second_serve_outcome, point.had_fault, point.point_number, surface))
                    .filter(shot => shot !== null)
                );
            })
    }, [matchId, playerName]);

    return (
        <Layer scaleX={s} scaleY={s}>
            {shots.map((shot, i) => (
                <Circle
                    key={i}
                    x={shot.x + SIDE_PAD}
                    y={shot.y}
                    radius={5}
                    fill={shot.color}
                />
            ))}
        </Layer>
    )
}