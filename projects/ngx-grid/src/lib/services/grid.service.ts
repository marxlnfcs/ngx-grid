import {Inject, Injectable, Optional} from "@angular/core";
import {GRID_OPTIONS, GRID_OPTIONS_DEFAULTS} from "../grid.constants";
import {IGridBreakpointName, IGridOptions} from "../grid.interface";
import {Observable} from "rxjs";
import {createEvent} from "../utils/event.utils";
import {deepMergeDefined, sizeToPixel} from "../utils/common.utils";

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
   * Determines if the current container width is less than or equal to the specified breakpoint width.
   *
   * @param {IGridBreakpointName|null} [breakpoint] The breakpoint name to compare against, or null for no specific breakpoint.
   * @param {Window|HTMLElement|null} [container] The container element or window to check the width of. If null, defaults to the current window.
   * @return {boolean} True if the container width is less than or equal to the breakpoint width; otherwise, false.
   */
  isBreakpointMax(breakpoint?: IGridBreakpointName|null, container?: Window|HTMLElement|null): boolean {
    const containerWidth: number = this.getContainerWidth(container);
    const breakpointWidth: number = this.getBreakpointWidth(breakpoint);
    return containerWidth <= breakpointWidth;
  }
}
