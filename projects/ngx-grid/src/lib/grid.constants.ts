import {IGridOptions} from "./grid.interface";
import {InjectionToken} from "@angular/core";
import {DeepPartial} from "./grid.type";

export const GRID_OPTIONS_DEFAULTS: IGridOptions = {
  strategy: 'screen',
  baseBreakpoint: 'xs',
  baseSize: 12,
  gap: '1rem',
  autoRows: 'min-content',
  breakpoints: {
    xs: 0,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
    '3xl': 1920,
    '4xl': 2560,
    mobile: 0,
    tablet: 768,
    desktop: 1024,
  },
}

export const GRID_OPTIONS = new InjectionToken<DeepPartial<IGridOptions>>('Options for the NGX-GRID');
