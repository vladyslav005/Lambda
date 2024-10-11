import React, { useRef, useState } from "react";

export function useZoomAndDragHook() {
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [dragging, setDragging] = useState(false);
    const [startDragPos, setStartDragPos] = useState({ x: 0, y: 0 });
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });

    const elementRef = useRef<HTMLDivElement>(null);

    const handleWheel = (e: React.WheelEvent) => {

        if (elementRef.current) {
            e.preventDefault();

            const rect = elementRef.current?.getBoundingClientRect();
            if (!rect) return;

            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            const zoomSpeed = 0.001;
            const newScale = Math.max(0.1, scale - e.deltaY * zoomSpeed);

            const scaleChange = newScale / scale;

            const newPositionX = position.x - mouseX * (scaleChange - 1);
            const newPositionY = position.y - mouseY * (scaleChange - 1);

            console.log(scaleChange - 1)
            setScale(newScale);
            setPosition({ x: newPositionX, y: newPositionY });
        }
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
                y: startPos.y + dy,
            });
        }
    };

    return {
        elementRef,
        scale,
        position,
        dragging,
        handleWheel,
        handleMouseDown,
        handleMouseUp,
        handleMouseMove,
    };
}
