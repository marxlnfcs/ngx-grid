import {IGridBreakpointSize, IGridGapSize} from "../grid.interface";

/** @internal */
export function sizeToPixel(size?: IGridBreakpointSize|IGridGapSize): number {
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
export function cssSize(size: string|number|null){
  return typeof size === 'string' ? size : `${size || 0}px`;
}

/** @internal */
export function deepMergeDefined<T>(target: T, ...sources: Partial<T|null|undefined>[]): T {
  const result = { ...target } as any;
  for(let source of sources.filter(Boolean)){
    for(const key in source){
      const value = source[key];
      if(value === undefined){
        continue;
      }
      if(value && typeof value === 'object' && !Array.isArray(value) && typeof result[key] === 'object') {
        result[key] = deepMergeDefined(result[key], value);
        continue;
      }
      result[key] = value;
    }
  }
  return result;
}
