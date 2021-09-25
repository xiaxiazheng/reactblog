import React, { useState } from "react";

const MouseTracker: React.FC = () => {
    return (
        <div>
            <h1>移动鼠标</h1>
            <Mouse render={(mouse: any) => <Cat mouse={mouse} />} />
            <Mouse render={(mouse: any) => <Dog mouse={mouse} />} />
        </div>
    );
};

const Mouse: any = (props: any) => {
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);

    const handleMove = (e: any) => {
        setX(e.clientX);
        setY(e.clientY);
    };

    return (
        <div
            onMouseMove={handleMove}
            className="Mouse"
            style={{
                width: "500px",
                height: "300px",
                border: "1px solid #ccc",
            }}
        >
            {props.render({ x, y })}
        </div>
    );
};

const Cat: React.FC<{ mouse: any }> = ({ mouse }) => {
    return (
        <div className="cat">
            cat:({mouse.x}, {mouse.y})
        </div>
    );
};

const Dog: React.FC<{ mouse: any }> = ({ mouse }) => {
    return (
        <div className="dog">
            dog:({mouse.x}, {mouse.y})
        </div>
    );
};

export default MouseTracker;
