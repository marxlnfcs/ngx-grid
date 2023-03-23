import {NgxGridOptions} from "./interfaces/grid.interface";
import {InjectionToken} from "@angular/core";

export const GRID_OPTIONS_DEFAULTS: NgxGridOptions = {
  baseBreakpoint: 'xs',
  baseSize: 12,
  gap: '1rem',
  autoRows: true
}

export const GRID_OPTIONS = new InjectionToken<Partial<NgxGridOptions>>('ngx-grid-options');
