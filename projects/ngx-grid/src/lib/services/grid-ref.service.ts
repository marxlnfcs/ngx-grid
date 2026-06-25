import {ElementRef, inject, Injectable, OnDestroy, Renderer2, Signal, signal, WritableSignal} from "@angular/core";
import {Observable, ReplaySubject} from "rxjs";
import {cssSize, sizeToPixel} from "../utils/common.utils";
import {GridService} from "./grid.service";
import {IGridBreakpoint, IGridBreakpointName, IGridColumnSize, IGridOptions} from "../grid.interface";
import {
  IGridColumn,
  IGridGroup,
  IGridItem,
  IGridItemReference,
  IGridItemReferencePosition
} from "../components/grid/grid.interface";
import {Grid} from "../components/grid/grid.component";


@Injectable()
export class GridRef implements OnDestroy {
  readonly renderer: Renderer2 = inject(Renderer2);
  readonly gridService: GridService = inject(GridService);

  private changes$: ReplaySubject<void> = new ReplaySubject<any>(1);
  private options$: WritableSignal<IGridOptions> = signal(this.gridService.options);
  private columns$: WritableSignal<IGridColumn[]> = signal([]);

  /**
   * Retrieves the current configuration options for the grid.
   *
   * @return {Signal<IGridOptions>} A signal containing the grid options.
   */
  get options(): Signal<IGridOptions> {
    return this.options$;
  }

  /**
   * Updates the grid options with the provided partial options.
   *
   * @param {Partial<IGridOptions>} options - A partial object containing the options to update the grid configuration.
   *                                           Only the properties provided in this object will be updated.
   * @return {void} This method does not return a value.
   */
  updateOptions(options: Partial<IGridOptions>): void {
    this.options$.set(this.gridService.buildOptions(options));
  }

  /**
   * Returns the list of grid columns as a signal.
   *
   * @return {Signal<IGridColumn[]>} A signal containing an array of grid column definitions.
   */
  get columns(): Signal<IGridColumn[]> {
    return this.columns$;
  }

  /**
   * Registers a new column to the grid if it is not already registered.
   *
   * @param {IGridColumn} column - The column object to be added to the grid.
   * @return {void} This method does not return a value.
   */
  registerColumn(column: IGridColumn): void {
    const currentColumns = this.columns$();
    if(!currentColumns.includes(column)) {
      this.columns$.set([...currentColumns, column]);
      this.emitChange();
    }
  }

  /**
   * Unregisters a column from the grid. If the specified column exists in the current list of columns,
   * it removes the column and emits a change event.
   *
   * @param {IGridColumn} column - The column to be unregistered from the grid.
   * @return {void}
   */
  unregisterColumn(column: IGridColumn): void {
    const currentColumns = this.columns$();
    if(currentColumns.includes(column)) {
      this.columns$.set(currentColumns.filter(c => c !== column));
      this.emitChange();
    }
  }

  /**
   * Builds the specified grid component by initializing its columns.
   *
   * @param {Grid} component - The grid component to be built.
   * @return {void} Does not return a value.
   */
  buildComponent(component: Grid): void  {
    this.buildColumns([component]);
  }

  /**
   * Builds an array of grid item references for the columns by processing the given items and optional group.
   *
   * @param {IGridItem[]} items - An array of grid items to process and structure into columns.
   * @param {IGridGroup|null} [group] - An optional grid group related to the items. Can be null.
   * @return {IGridItemReference[]} - An array of structured grid item references representing columns.
   */
  private buildColumns(items: IGridItem[], group?: IGridGroup|null): IGridItemReference[] {
    const columns: IGridItemReference[] = [];
    this.sortItems(items, group).map((i, index) => {
      if(i.breakpoint){

        // get item
        const { item, breakpoint } = i;

        // create children
        if(item.type === 'root' || item.type === 'group'){
          this.buildColumns(item.ownGridRef.columns(), item);
        }

        // create column
        const column: IGridItemReference = {
          index: index,
          instance: item,
          position: this.createPosition(breakpoint, columns),
          styles: {},
        };

        // create styles
        column.styles = this.createBaseStyles(item, column.position, group);

        // apply styles
        Object.entries(column.styles).map(([key, value]) => {
          if(value !== null && value !== undefined){
            this.renderer.setStyle(item.elementRef.nativeElement, key, value);
          }else{
            this.renderer.removeStyle(item.elementRef.nativeElement, key);
          }
        });

        // add column to array
        columns.push(column);

      }
    });
    return columns;
  }

  /**
   * Creates a base set of CSS styles for a grid item, based on its type and position within a grid.
   *
   * @param {IGridItem} item - The grid item to generate styles for. This can be a grid, grid group, or grid column.
   * @param {IGridItemReferencePosition} position - The position of the grid item in the grid layout, specified by start and end positions for rows and columns.
   * @param {IGridGroup|null} [group] - An optional grid group container that provides default styling properties if applicable.
   * @return {Record<string, string>} The computed set of base styles as key-value pairs for use in a grid layout.
   */
  private createBaseStyles(item: IGridItem, position: IGridItemReferencePosition, group?: IGridGroup|null): Record<string, string> {

    // create empty style object
    const styles: Record<string, string|null> = {};

    // add base style for group
    if(item.type === 'root' || item.type === 'group'){
      styles['display'] = 'grid';
      styles['align-items'] = 'start';
      styles['width'] = '100%';
      //styles['height'] = '100%';
      //styles['max-height'] = '100%';
      styles['grid-template-columns'] = `repeat(${this.options().baseSize}, 1fr)`;
      styles['grid-template-rows'] = item.rows()?.join(' ') || null;
    }

    // set options for group
    if(item.type === 'root' || item.type === 'group'){
      styles['container-type'] = this.options().strategy === 'container' ? 'inline-size' : null;
      styles['grid-auto-rows'] = cssSize(item?.autoRows() ?? group?.autoRows() ?? this.options().autoRows);
    }

    // set gaps for group
    if(item.type === 'root' || item.type === 'group'){
      const columnGap = item.columnGap() ?? item.gap() ?? this.options().columnGap;
      const rowGap = item.rowGap() ?? item.gap() ?? this.options().rowGap;

      styles['column-gap'] = typeof columnGap === 'number' ? `${columnGap}px` : columnGap || '0px';
      styles['column-gap'] = typeof columnGap === 'number' ? `${columnGap}px` : columnGap || '0px';
      styles['row-gap'] = typeof rowGap === 'number' ? `${rowGap}px` : rowGap || '0px';
    }

    // set base style for column
    if(item.type === 'column'){
      styles['display'] = 'block';
      styles['width'] = '100%';
      styles['max-width'] = '100%';
      styles['height'] = '100%';
    }

    // apply position
    styles['grid-row-start'] = position.rowStart.toString() || '';
    styles['grid-row-end'] = position.rowEnd.toString() || '';
    styles['grid-column-start'] = position.columnStart.toString() || '';
    styles['grid-column-end'] = position.columnEnd.toString() || '';

    // return styles
    return Object.fromEntries(Object.entries(styles).filter(([key, value]) => value !== null)) as Record<string, string>;

  }

  /**
   * Creates the position of a grid item based on the given breakpoint and existing columns.
   *
   * @param {IGridBreakpoint} breakpoint - The breakpoint configuration for the grid item, including size, offset, and order properties.
   * @param {IGridItemReference[]} columns - An array of existing grid item references, used to calculate the new item's position.
   * @return {IGridItemReferencePosition} The calculated position for the grid item, including row, column, and order attributes.
   */
  private createPosition(breakpoint: IGridBreakpoint, columns: IGridItemReference[]): IGridItemReferencePosition {

    // get previous column and position
    const prevColumn = columns.length ? columns[columns.length - 1] : null;
    const prevPosition: Omit<IGridItemReferencePosition, 'columnStart'> = {
      rowStart: prevColumn?.position?.rowStart || 1,
      rowEnd: prevColumn?.position?.rowEnd || 1,
      columnEnd: (prevColumn?.position?.columnEnd || 1) + (breakpoint.offset || 0),
      order: prevColumn?.position?.order || 999,
    };

    // get positions of previous item
    const position: IGridItemReferencePosition = {
      rowStart: 0, rowEnd: 0, columnStart: 0, columnEnd: 0, order: breakpoint.order || 999,
    };

    // calculate position
    const size = (breakpoint.size || this.options().baseSize);
    if((prevPosition.columnEnd + size) <= (this.options().baseSize + 1)){
      position.rowStart = prevPosition.rowStart;
      position.rowEnd = prevPosition.rowEnd;
      position.columnStart = prevPosition.columnEnd;
      position.columnEnd = position.columnStart + size;
    }else{
      position.rowStart = prevPosition.rowStart + 1;
      position.rowEnd = position.rowStart;
      position.columnStart = 1;
      position.columnEnd = position.columnStart + size;
    }

    // return position
    return position;

  }

  /**
   * # # # # # # # # # # # # # # # # # #
   * Helpers
   * # # # # # # # # # # # # # # # # # #
   */
  getNearestBreakpoint(item: IGridItem, group?: IGridGroup|null, breakpoints?: IGridBreakpoint[]): IGridBreakpoint|null {
    const containerWidth = this.getContainerWidth(group?.elementRef);
    breakpoints = breakpoints || this.createBreakpoints(item);
    let nearestBreakpoint: IGridBreakpoint|null = null;
    for(let breakpoint of breakpoints.values()){
      const thisWidth = sizeToPixel(breakpoint.width);
      if(breakpoint.size && thisWidth <= containerWidth){
        nearestBreakpoint = breakpoint;
      }
    }
    return nearestBreakpoint;
  }

  /**
   * Sorts the given list of grid items based on their nearest breakpoint order.
   *
   * @param {IGridItem[]} items - The array of grid items to be sorted.
   * @param {IGridGroup|null} [group] - An optional grid group to calculate the nearest breakpoint for each item.
   * @return {{ item: IGridItem, breakpoint: IGridBreakpoint|null }[]} An array of objects containing each grid item and its associated nearest breakpoint, sorted by breakpoint order.
   */
  private sortItems(items: IGridItem[], group?: IGridGroup|null): { item: IGridItem, breakpoint: IGridBreakpoint|null }[] {
     return items
       .map(item => ({ item, breakpoint: this.getNearestBreakpoint(item, group) }))
       .filter(i => !!i.breakpoint)
       .sort((a, b) => {
         const position = a.item.elementRef.nativeElement.compareDocumentPosition(b.item.elementRef.nativeElement);
         return position & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : position & Node.DOCUMENT_POSITION_PRECEDING ? 1 : 0;
       })
       .sort((a, b) => {
         const aOrder = a.breakpoint?.order as number;
         const bOrder = b.breakpoint?.order as number;
         if(aOrder < bOrder) return -1;
         if(aOrder > bOrder) return 1;
         return 0;
       });
  }

  /**
   * Generates a list of breakpoints for a given grid item.
   *
   * @param {IGridItem} item - The grid item for which to create breakpoints. Can be an instance of GridGroup, GridColumn, or any other IGridItem.
   * @return {IGridBreakpoint[]} A list of breakpoints with size, offset, and order values for the specified grid item.
   */
  private createBreakpoints(item: IGridItem): IGridBreakpoint[] {
    const breakpoints: IGridBreakpointName[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', 'mobile', 'tablet', 'desktop'];
    return breakpoints.map(breakpoint => {
      if(item.type === 'group' || item.type === 'column'){
        const breakpointConfig = item.breakpoints();
        return this.createBreakpoint(
          breakpoint as IGridBreakpointName,
          breakpointConfig[breakpoint].size ?? (breakpoint === this.options().baseBreakpoint ? breakpointConfig['default'].size : null),
          breakpointConfig[breakpoint].offset ?? (breakpoint === this.options().baseBreakpoint ? breakpointConfig['default'].offset : null),
          breakpointConfig[breakpoint].order ?? (breakpoint === this.options().baseBreakpoint ? breakpointConfig['default'].order : null),
        );
      }
      return this.createBreakpoint(breakpoint, null, null, null);
    });
  }

  /**
   * Creates a breakpoint configuration for a grid system.
   *
   * @param {IGridBreakpointName} name - The name of the grid breakpoint (e.g., 'xs', 'sm', 'md', 'lg').
   * @param {IGridColumnSize|null} [size] - The size of the grid column for the breakpoint. Defaults to the base size if not provided.
   * @param {IGridColumnSize|null} [offset] - The offset value for the breakpoint, or null if none is provided.
   * @param {number|null} [order] - The order of the grid column for the breakpoint. Defaults to 999 if not provided.
   * @return {IGridBreakpoint} The constructed grid breakpoint configuration object.
   */
  createBreakpoint(name: IGridBreakpointName, size?: IGridColumnSize|null, offset?: IGridColumnSize|null, order?: number|null): IGridBreakpoint {
    const breakpoint: IGridBreakpoint = { name, size, offset, order };
    switch(name){
      case 'xs': breakpoint.size = breakpoint.size || this.options().baseSize; break;
    }
    breakpoint.width = this.options().breakpoints[name];
    breakpoint.order = breakpoint.order ?? 999;
    return breakpoint;
  }

  /**
   * Calculates and returns the width of a container based on the provided element reference or the window width.
   *
   * @param {ElementRef<HTMLElement>|null} [elementRef] Optional reference to an HTML element. If the strategy is 'container', the width of this element will be returned. If not provided or invalid, the window width will be used.
   * @return {number} The width of the container or the window, depending on the strategy and availability of the element reference.
   */
  getContainerWidth(elementRef?: ElementRef<HTMLElement>|null): number {
    return this.options().strategy === 'container' ? elementRef?.nativeElement?.offsetWidth || window.innerWidth : window.innerWidth;
  }

  /**
   * Returns an observable that emits whenever changes occur.
   *
   * @return {Observable<void>} An observable stream that emits a void value on changes.
   */
  get changes(): Observable<void> {
    return this.changes$.asObservable();
  }

  /**
   * Triggers an emission of the current change notification to all subscribers.
   *
   * @return {void} This method does not return a value.
   */
  emitChange(): void {
    this.changes$.next();
  }

  /**
   * Destroys all subscriptions and completes the observable stream.
   */
  ngOnDestroy(): void {
    if(!this.changes$.closed){
      this.changes$.complete();
    }
  }
}
