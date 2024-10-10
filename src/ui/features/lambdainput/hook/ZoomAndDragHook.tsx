import React, {useState} from "react";


export function useZoomAndDragHook() {
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [dragging, setDragging] = useState(false);
    const [startDragPos, setStartDragPos] = useState({ x: 0, y: 0 });
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });

    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        const newScale = scale + e.deltaY * -0.01; // zoom in/out based on scroll
        setScale(Math.min(Math.max(0.4, newScale), 5)); // limit zoom between 0.5x and 3x
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        setDragging(true);
        setStartDragPos({ x: e.clientX, y: e.clientY });
        setStartPos({ x: position.x, y: position.y });
    };

    const handleMouseUp = () => {
        setDragging(false);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (dragging) {
            const dx = e.clientX - startDragPos.x;
            const dy = e.clientY - startDragPos.y;
            setPosition({
                x: startPos.x + dx,
                y: startPos.y + dy
            });
        }
    };



    return {scale, position, dragging, handleWheel, handleMouseDown, handleMouseUp, handleMouseMove};


}