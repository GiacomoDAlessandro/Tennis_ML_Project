import {COURT_W, COURT_H, SIDE_PAD} from "../lib/courtConstants";
import {Layer, Circle} from "react-konva";

export default function ShotLayer({s}) {
    const testShots = [
        {x: 340, y: 260},
        {x: 290, y: 260},
        {x: 240, y: 260},
        {x: 105, y: 260},
        {x: 160, y: 260},
        {x: 210, y: 260},
    ]


    return (
        <Layer scaleX={s} scaleY={s}>
            {testShots.map((shot, i) => (
                <Circle
                    key={i}
                    x={shot.x + SIDE_PAD}
                    y={shot.y}
                    radius={5}
                    fill={"red"}
                />
            ))}
        </Layer>
    )
}