declare module 'react-map-interaction' {
  import { Component, ReactNode } from 'react';

  interface MapInteractionProps {
    value?: { scale: number; translation: { x: number; y: number } };
    onChange?: (value: { scale: number; translation: { x: number; y: number } }) => void;
    showControls?: boolean;
    minScale?: number;
    maxScale?: number;
    translationBounds?: { xMin: number; xMax: number; yMin: number; yMax: number };
    scaleBounds?: { minScale: number; maxScale: number };
    children?: ReactNode;  // <-- Add this line to allow children prop
  }

  export class MapInteractionCSS extends Component<MapInteractionProps, any> {}
}
