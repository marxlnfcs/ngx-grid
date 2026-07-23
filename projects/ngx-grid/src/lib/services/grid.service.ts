import {Inject, Injectable, Optional, Signal} from "@angular/core";
import {GRID_OPTIONS, GRID_OPTIONS_DEFAULTS} from "../grid.constants";
import {IGridBreakpointName, IGridOptions} from "../grid.interface";
import {Observable} from "rxjs";
import {createEvent} from "../utils/event.utils";
import {deepMergeDefined, sizeToPixel} from "../utils/common.utils";
import {toSignal} from "@angular/core/rxjs-interop";

@Injectable()
export class GridService {
  constructor(
    @Optional() @Inject(GRID_OPTIONS) private gridOptions: IGridOptions,
  ){}

  /**
   * Retrieves the grid options for the IGrid configuration, merging user-defined settings
   * with default values where necessary. The configuration includes layout strategy, base
   * breakpoint, base size, gap sizes, auto row behavior, and responsive breakpoints.
   *
   * @return {IGridOptions} The resolved grid options object, containing properties such as
   * strategy, baseBreakpoint, baseSize, gap, columnGap, rowGap, autoRows, and breakpoints.
   */
  get options(): IGridOptions {
    return {
      strategy: this.gridOptions?.strategy ?? GRID_OPTIONS_DEFAULTS.strategy,
      baseBreakpoint: this.gridOptions?.baseBreakpoint ?? GRID_OPTIONS_DEFAULTS.baseBreakpoint,
      baseSize: this.gridOptions?.baseSize ?? GRID_OPTIONS_DEFAULTS.baseSize,
      gap: this.gridOptions?.gap ?? GRID_OPTIONS_DEFAULTS.gap,
      columnGap: this.gridOptions?.columnGap ?? this.gridOptions?.gap ?? GRID_OPTIONS_DEFAULTS.columnGap ?? GRID_OPTIONS_DEFAULTS.gap,
      rowGap: this.gridOptions?.rowGap ?? this.gridOptions?.gap ?? GRID_OPTIONS_DEFAULTS.rowGap ?? GRID_OPTIONS_DEFAULTS.gap,
      autoRows: this.gridOptions?.autoRows ?? GRID_OPTIONS_DEFAULTS.autoRows,
      breakpoints: {
        'xs': this.gridOptions?.breakpoints?.['xs'] ?? GRID_OPTIONS_DEFAULTS.breakpoints['xs'],
        'sm': this.gridOptions?.breakpoints?.['sm'] ?? GRID_OPTIONS_DEFAULTS.breakpoints['sm'],
        'md': this.gridOptions?.breakpoints?.['md'] ?? GRID_OPTIONS_DEFAULTS.breakpoints['md'],
        'lg': this.gridOptions?.breakpoints?.['lg'] ?? GRID_OPTIONS_DEFAULTS.breakpoints['lg'],
        'xl': this.gridOptions?.breakpoints?.['xl'] ?? GRID_OPTIONS_DEFAULTS.breakpoints['xl'],
        '2xl': this.gridOptions?.breakpoints?.['2xl'] ?? GRID_OPTIONS_DEFAULTS.breakpoints['2xl'],
        '3xl': this.gridOptions?.breakpoints?.['3xl'] ?? GRID_OPTIONS_DEFAULTS.breakpoints['3xl'],
        '4xl': this.gridOptions?.breakpoints?.['4xl'] ?? GRID_OPTIONS_DEFAULTS.breakpoints['4xl'],
        'mobile': this.gridOptions?.breakpoints?.['mobile'] ?? GRID_OPTIONS_DEFAULTS.breakpoints['mobile'],
        'tablet': this.gridOptions?.breakpoints?.['tablet'] ?? GRID_OPTIONS_DEFAULTS.breakpoints['tablet'],
        'desktop': this.gridOptions?.breakpoints?.['desktop'] ?? GRID_OPTIONS_DEFAULTS.breakpoints['desktop'],
      },
    }
  }

  /**
   * Builds and returns a complete IGridOptions object by merging the provided partial options
   * with the existing configuration.
   *
   * @param {Partial<IGridOptions>|null|undefined} options - A partial options object to customize the grid configuration.
   * @return {IGridOptions} The fully constructed IGridOptions object with merged properties.
   */
  buildOptions(...options: Partial<IGridOptions|null|undefined>[]): IGridOptions {
    return deepMergeDefined(this.options, ...options);
  }

  /**
   * Provides a signal that will be triggered when the window is resized.
   *
   * @return {Signal<void>} A signal object that emits when the window resize event occurs.
   */
  readonly windowResized: Signal<void> = toSignal(this.onWindowResize());

  /**
   * Returns an observable that emits when the window is resized.
   */
  onWindowResize(): Observable<void> {
    return createEvent(window, 'resize');
  }

  /**
   * Returns an observable that emits when the specified container is resized.
   * @param container - The container element to observe for resize events.
   */
  onContainerResize(container: HTMLElement): Observable<void> {
    return createEvent(container, 'resize');
  }

  /**
   * Returns the width of the specified container element.
   * @param container - The container element to get the width for. Defaults to the window.
   */
  getContainerWidth(container?: Window|HTMLElement|null): number {
    return (container as any)?.['innerWidth'] ?? (container as any)?.['offsetWidth'] ?? window.innerWidth;
  }

  /**
   * Returns the width of the specified breakpoint.
   * @param breakpoint - The breakpoint to get the width for. Defaults to the base breakpoint.
   */
  getBreakpointWidth(breakpoint?: IGridBreakpointName|null): number {
    return sizeToPixel(this.options.breakpoints[breakpoint || this.options.baseBreakpoint]);
  }

  /**
   * Determines the next breakpoint that has a greater width than the given breakpoint.
   * If no breakpoint is provided, the base breakpoint is used as the reference point.
   *
   * @param {IGridBreakpointName|null} [breakpoint] - The name of the breakpoint to start from. If null or undefined, the base breakpoint is used.
   * @return {IGridBreakpointName|null} - The name of the next breakpoint with a greater width, or null if no such breakpoint exists.
   */
  getNextBreakpoint(breakpoint?: IGridBreakpointName|null): IGridBreakpointName|null {
    const currentBreakpoint = breakpoint ?? this.options.baseBreakpoint;
    const currentWidth = this.getBreakpointWidth(currentBreakpoint);
    let nextBreakpoint: IGridBreakpointName | null = null;
    let nextBreakpointWidth = Number.POSITIVE_INFINITY;
    for (const name of Object.keys(this.options.breakpoints) as IGridBreakpointName[]) {
      const width = this.getBreakpointWidth(name);
      if (width > currentWidth && width < nextBreakpointWidth) {
        nextBreakpoint = name;
        nextBreakpointWidth = width;
      }
    }
    return nextBreakpoint;
  }

  /**
   * Determines if the current container width is greater than or equal to the specified breakpoint width.
   *
   * @param {IGridBreakpointName|null} [breakpoint] - The name of the breakpoint to check against. Can be null.
   * @param {Window|HTMLElement|null} [container] - The container whose width is being compared. Can be a Window, HTMLElement, or null.
   * @return {boolean} Returns true if the container width is greater than or equal to the breakpoint width, false otherwise.
   */
  isBreakpointMin(breakpoint?: IGridBreakpointName|null, container?: Window|HTMLElement|null): boolean {
    const containerWidth: number = this.getContainerWidth(container);
    const breakpointWidth: number = this.getBreakpointWidth(breakpoint);
    return containerWidth >= breakpointWidth;
  }

  /**
   * Determines if the given breakpoint is the maximum applicable breakpoint for the current container width.
   *
   * @param {IGridBreakpointName|null} [breakpoint] - The breakpoint to check. Defaults to the base breakpoint if not provided.
   * @param {Window|HTMLElement|null} [container] - The container whose width is considered. Defaults to the default container if not specified.
   * @return {boolean} Returns true if the current container width is less than the width of the next breakpoint, or if there is no next breakpoint.
   */
  isBreakpointMax(breakpoint?: IGridBreakpointName|null, container?: Window|HTMLElement|null): boolean {
    const currentBreakpoint = breakpoint ?? this.options.baseBreakpoint;
    const containerWidth = this.getContainerWidth(container);
    const nextBreakpoint = this.getNextBreakpoint(currentBreakpoint);
    if (!nextBreakpoint) {
      return true;
    }
    const nextBreakpointWidth = this.getBreakpointWidth(nextBreakpoint);
    return containerWidth < nextBreakpointWidth;
  }
}
