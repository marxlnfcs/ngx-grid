import {Inject, Injectable, Optional} from "@angular/core";
import {GRID_OPTIONS, GRID_OPTIONS_DEFAULTS} from "../grid.constants";
import {NgxGridBreakpointName, NgxGridOptions} from "../interfaces/grid.interface";
import {Observable} from "rxjs";
import {createEvent} from "../utils/event.utils";
import {sizeToPixel} from "../utils/common.utils";

@Injectable({ providedIn: 'root' })
export class NgxGridService {
  constructor(
    @Optional() @Inject(GRID_OPTIONS) private gridOptions: NgxGridOptions,
  ){}

  getOptions(options?: Partial<NgxGridOptions>|null): NgxGridOptions {
    return {
      strategy: options?.strategy ?? this.gridOptions?.strategy ?? GRID_OPTIONS_DEFAULTS.strategy,
      baseBreakpoint: options?.baseBreakpoint ?? this.gridOptions?.baseBreakpoint ?? GRID_OPTIONS_DEFAULTS.baseBreakpoint,
      baseSize: options?.baseSize ?? this.gridOptions?.baseSize ?? GRID_OPTIONS_DEFAULTS.baseSize,
      gap: options?.gap ?? this.gridOptions?.gap ?? GRID_OPTIONS_DEFAULTS.gap,
      columnGap: options?.columnGap ?? this.gridOptions?.columnGap ?? this.gridOptions?.gap ?? GRID_OPTIONS_DEFAULTS.columnGap ?? GRID_OPTIONS_DEFAULTS.gap,
      rowGap: options?.rowGap ?? this.gridOptions?.rowGap ?? this.gridOptions?.gap ?? GRID_OPTIONS_DEFAULTS.rowGap ?? GRID_OPTIONS_DEFAULTS.gap,
      breakpointGaps: options?.breakpointGaps || this.gridOptions?.breakpointGaps || GRID_OPTIONS_DEFAULTS.breakpointGaps,
      autoRows: options?.autoRows ?? this.gridOptions?.autoRows ?? GRID_OPTIONS_DEFAULTS.autoRows,
      breakpoints: {
        xs: options?.breakpoints?.xs ?? this.gridOptions?.breakpoints?.xs ?? GRID_OPTIONS_DEFAULTS.breakpoints.xs,
        sm: options?.breakpoints?.sm ?? this.gridOptions?.breakpoints?.sm ?? GRID_OPTIONS_DEFAULTS.breakpoints.sm,
        md: options?.breakpoints?.md ?? this.gridOptions?.breakpoints?.md ?? GRID_OPTIONS_DEFAULTS.breakpoints.md,
        lg: options?.breakpoints?.lg ?? this.gridOptions?.breakpoints?.lg ?? GRID_OPTIONS_DEFAULTS.breakpoints.lg,
        xl: options?.breakpoints?.xl ?? this.gridOptions?.breakpoints?.xl ?? GRID_OPTIONS_DEFAULTS.breakpoints.xl,
        '2xl': options?.breakpoints?.['2xl'] ?? this.gridOptions?.breakpoints?.['2xl'] ?? GRID_OPTIONS_DEFAULTS.breakpoints['2xl'],
        '3xl': options?.breakpoints?.['3xl'] ?? this.gridOptions?.breakpoints?.['3xl'] ?? GRID_OPTIONS_DEFAULTS.breakpoints['3xl'],
        '4xl': options?.breakpoints?.['4xl'] ?? this.gridOptions?.breakpoints?.['4xl'] ?? GRID_OPTIONS_DEFAULTS.breakpoints['4xl'],
        'mobile': options?.breakpoints?.['mobile'] ?? this.gridOptions?.breakpoints?.['mobile'] ?? GRID_OPTIONS_DEFAULTS.breakpoints['mobile'],
        'tablet': options?.breakpoints?.['tablet'] ?? this.gridOptions?.breakpoints?.['tablet'] ?? GRID_OPTIONS_DEFAULTS.breakpoints['tablet'],
        'desktop': options?.breakpoints?.['desktop'] ?? this.gridOptions?.breakpoints?.['desktop'] ?? GRID_OPTIONS_DEFAULTS.breakpoints['desktop'],
      },
    }
  }

  onWindowResize(): Observable<void> {
    return createEvent(window, 'resize');
  }

  onContainerResize(container: HTMLElement): Observable<void> {
    return createEvent(container, 'resize');
  }

  getContainerWidth(container?: Window|HTMLElement|null): number {
    return (container as any)?.['innerWidth'] ?? (container as any)?.['offsetWidth'] ?? window.innerWidth;
  }

  getBreakpointWidth(breakpoint: NgxGridBreakpointName): number {
    return sizeToPixel(this.getOptions().breakpoints[breakpoint]);
  }

  isBreakpointMin(breakpoint: NgxGridBreakpointName, container?: Window|HTMLElement|null): boolean {
    const containerWidth: number = this.getContainerWidth(container);
    const breakpointWidth: number = this.getBreakpointWidth(breakpoint);
    return containerWidth >= breakpointWidth;
  }

  isBreakpointMax(breakpoint: NgxGridBreakpointName, container?: Window|HTMLElement|null): boolean {
    const containerWidth: number = this.getContainerWidth(container);
    const breakpointWidth: number = this.getBreakpointWidth(breakpoint);
    return containerWidth <= breakpointWidth;
  }
}
