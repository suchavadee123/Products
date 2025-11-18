declare module 'bwip-js' {
  export interface ToCanvasOptions {
    bcid: string;
    text: string;
    scale?: number;
    height?: number;
    includetext?: boolean;
  }

  export function toCanvas(canvas: HTMLCanvasElement | string, options: ToCanvasOptions): void;
  
  const bwip: {
    toCanvas: (canvas: HTMLCanvasElement | string, options: ToCanvasOptions) => void;
  };
  
  export default bwip;
}

