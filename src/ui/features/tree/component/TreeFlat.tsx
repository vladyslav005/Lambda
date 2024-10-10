import React, { useState } from 'react';

export function TreeFlat() {
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [dragging, setDragging] = useState(false);
    const [startDragPos, setStartDragPos] = useState({ x: 0, y: 0 });
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });

    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        const newScale = scale + e.deltaY * -0.01; // zoom in/out based on scroll
        setScale(Math.min(Math.max(0.5, newScale), 3)); // limit zoom between 0.5x and 3x
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

    return (
        <div
            className="tree-flat-container ui-block"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            style={{
                flexGrow : 3,
                overflow: 'hidden',
                position: 'relative',
                background: '#f0f0f0',
                cursor: dragging ? 'grabbing' : 'grab'
            }}
        >
            <div
                className="tree-flat bg-white"
                style={{
                    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                    transformOrigin: '0 0',
                    transition: dragging ? 'none' : 'transform 0.1s ease',
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'white',
                }}
            >
                TREE CONTENT
            </div>
        </div>
    );
}
