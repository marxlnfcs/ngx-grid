import {NgxGridBreakpointSize, NgxGridGapSize} from "../interfaces/grid.interface";

/** @internal */
export function sizeToPixel(size?: NgxGridBreakpointSize|NgxGridGapSize): number {
  if(size){
    switch (true) {
      case typeof size === 'number': return size as number;
      case typeof size === 'string' && size.trim().endsWith('px'): {
        const s = (size as string).trim().replace(/px/g, '');
        return !isNaN(parseInt(s)) ? parseInt(s) : 0;
      }
      case typeof size === 'string' && size.trim().endsWith('rem'): {
        const s = (size as string).trim().replace(/rem/g, '');
        return !isNaN(parseInt(s)) ? parseInt(s) : 0;
      }
      case typeof size === 'string' && size.trim().endsWith('em'): {
        const s = (size as string).trim().replace(/em/g, '');
        return !isNaN(parseInt(s)) ? parseInt(s) : 0;
      }
    }
  }
  return 0;
}

/** @internal */
export function isNil<T>(data: T): boolean {
  return data === undefined || data === null;
}
