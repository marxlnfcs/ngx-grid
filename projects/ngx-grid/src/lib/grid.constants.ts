import {NgxGridOptions} from "./interfaces/grid.interface";
import {InjectionToken} from "@angular/core";

export const GRID_OPTIONS_DEFAULTS: NgxGridOptions = {
  strategy: 'screen',
  baseBreakpoint: 'xs',
  baseSize: 12,
  gap: '1rem',
  autoRows: 'min-content',
  breakpoints: {
    xs: 0,
    sm: 481,
    md: 769,
    lg: 1025,
    xl: 1201,
    '2xl': 1400,
    '3xl': 1600,
    '4xl': 1800,
    mobile: 0,
    tablet: 769,
    desktop: 1400,
  },
}

export const GRID_OPTIONS = new InjectionToken<Partial<NgxGridOptions>>('ngx-grid-options');
