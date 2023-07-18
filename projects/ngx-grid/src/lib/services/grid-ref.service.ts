import {Injectable, OnDestroy} from "@angular/core";
import {Observable, Subject} from "rxjs";
import {NgxGridBreakpoint, NgxGridColumnSize, NgxGridOptions} from "../interfaces/grid.interface";
import {GRID_OPTIONS_DEFAULTS} from "../grid.constants";
import {INgxGridColumn, INgxGridGroup, INgxGridItem} from "../interfaces/grid-item.interface";

@Injectable()
export class NgxGridRef implements OnDestroy {
  private changes$ = new Subject<void>();
  private options?: NgxGridOptions;

  /**
   * # # # # # # # # # # # # # # # # # #
   * Options
   * # # # # # # # # # # # # # # # # # #
   */
  setOptions(options: NgxGridOptions){
    this.options = options;
  }
  getOptions(): NgxGridOptions {
    return {
      strategy: this.options?.strategy ?? GRID_OPTIONS_DEFAULTS.strategy,
      baseBreakpoint: this.options?.baseBreakpoint ?? GRID_OPTIONS_DEFAULTS.baseBreakpoint,
      baseSize: this.options?.baseSize ?? GRID_OPTIONS_DEFAULTS.baseSize,
      gap: this.options?.gap ?? GRID_OPTIONS_DEFAULTS.gap,
      columnGap: this.options?.columnGap ?? this.options?.gap ?? GRID_OPTIONS_DEFAULTS.columnGap ?? GRID_OPTIONS_DEFAULTS.gap,
      rowGap: this.options?.rowGap ?? this.options?.gap ?? GRID_OPTIONS_DEFAULTS.rowGap ?? GRID_OPTIONS_DEFAULTS.gap,
      autoRows: this.options?.autoRows ?? GRID_OPTIONS_DEFAULTS.autoRows,
    }
  }

  /**
   * # # # # # # # # # # # # # # # # # #
   * Helpers
   * # # # # # # # # # # # # # # # # # #
   */
  private createColumnClasses(item: INgxGridColumn|INgxGridGroup, group?: INgxGridGroup|null): { [klass: string]: any } {
    return item.type === 'group'
      ? {
        'ngx-grid-strategy-container': (item.strategy ?? group?.strategy ?? this.getOptions().strategy) === 'container',
        'ngx-grid-column-gap': (item.columnGap ?? item.gap ?? group?.columnGap ?? group?.gap ?? this.getOptions().columnGap) !== false,
        'ngx-grid-row-gap': (item.rowGap ?? item.gap ?? group?.rowGap ?? group?.gap ?? this.getOptions().rowGap) !== false,
        'ngx-grid-auto-rows': group?.autoRows ?? this.getOptions().autoRows ?? true,
      }
      : {
        'ngx-grid-column-gap': (group?.columnGap ?? group?.gap ?? this.getOptions().columnGap) !== false,
        'ngx-grid-row-gap': (group?.rowGap ?? group?.gap ?? this.getOptions().rowGap) !== false,
        'ngx-grid-auto-rows': group?.autoRows ?? this.getOptions().autoRows ?? true,
      }
  }

  private createColumnVariables(item: INgxGridColumn|INgxGridGroup, group?: INgxGridGroup|null): { [variable: string]: string|number|boolean|null|undefined; } {
    const columnGap = (item.type === 'group' ? item.columnGap ?? item.gap ?? null : null) ?? group?.columnGap ?? group?.gap ?? this.getOptions().columnGap;
    const rowGap = (item.type === 'group' ? item.rowGap ?? item.gap ?? null : null) ?? group?.columnGap ?? group?.gap ?? this.getOptions().rowGap;
    return {
      '--ngx-grid-column-gap': typeof columnGap === 'number' ? `${columnGap}px` : columnGap || '0px',
      '--ngx-grid-row-gap': typeof rowGap === 'number' ? `${rowGap}px` : rowGap || '0px',
    }
  }

  private createColumnStyles(rows?: string[]|null): { [style: string]: any } {
    return {
      'grid-template-rows': rows ? rows.join(" ") : null,
    }
  }

  createColumns(group: INgxGridGroup|null, items: INgxGridItem[]): GridItem[] {
    let index = -1;
    const columns: GridItem[] = [];
    items.map(item => {

      // create base object for item
      const column: GridItem = {
        index: ++index,
        type: item.type,
        item: item,
        ngClass: this.createColumnClasses(item as any, group),
        ngStyle: this.createColumnStyles(item?.type === 'group' ? (item as any)?.rows : null),
        ngxStyleVariables: this.createColumnVariables(item as any, group),
        positions: {}
      }

      // apply positions
      this.applyPositions(item, column, columns);

      // add to columns
      columns.push(column);

    });
    return columns;
  }

  applyPositions(item: INgxGridItem, column: GridItem, columns: GridItem[]): void {

    // get the previous column as reference
    const previousColumn = columns.length ? columns[columns.length - 1] : null;

    // build breakpoints
    const breakpoints = this.createBreakpoints(item);

    // reset classList and styleList
    column.positions = {};

    // add size
    breakpoints.filter(b => b.size).map(b => {
      column.positions[b.name] = this.createPosition(b.size || this.getOptions().baseSize, b.offset || 0, previousColumn?.positions?.[b.name]);

      column.ngClass[`ngx-grid-size-${b.name}-${b.size}`] = true;
      column.ngxStyleVariables[`--ngx-grid-row-start-${b.name}`] = column.positions[b.name].rowStart.toString() || '0';
      column.ngxStyleVariables[`--ngx-grid-row-end-${b.name}`] = column.positions[b.name].rowEnd.toString() || '0';
      column.ngxStyleVariables[`--ngx-grid-column-start-${b.name}`] = column.positions[b.name].columnStart.toString() || '0';
      column.ngxStyleVariables[`--ngx-grid-column-end-${b.name}`] = column.positions[b.name].columnEnd.toString() || '0';
    });

    // add order
    breakpoints.filter(b => b.order).map(b => {
      column.ngClass[`ngx-grid-order-${b.name}`] = true;
      column.ngxStyleVariables[`--ngx-grid-order-${b.name}`] = b.order?.toString() || '0';
    });

  }

  createPosition(size: NgxGridColumnSize, offset: NgxGridColumnSize|number, previousPosition?: GridItemPosition|null): GridItemPosition {

    // create previous position
    const prevPosition: Omit<GridItemPosition, 'columnStart'> = {
      rowStart: previousPosition?.rowStart || 1,
      rowEnd: previousPosition?.rowEnd || 1,
      columnEnd: (previousPosition?.columnEnd || 1) + offset,
    };

    // get positions of previous item
    const position: GridItemPosition = {
      rowStart: 0, rowEnd: 0, columnStart: 0, columnEnd: 0
    };

    // calculate position
    if((prevPosition.columnEnd + size) <= (this.getOptions().baseSize + 1)){
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

  createBreakpoints(item: INgxGridItem): NgxGridBreakpoint[] {
    return [
      this.createBreakpoint(item, 'xs', item._xs, item._xsOffset, item._xsOrder),
      this.createBreakpoint(item, 'sm', item._sm, item._smOffset, item._smOrder),
      this.createBreakpoint(item, 'md', item._md, item._mdOffset, item._mdOrder),
      this.createBreakpoint(item, 'lg', item._lg, item._lgOffset, item._lgOrder),
      this.createBreakpoint(item, 'xl', item._xl, item._xlOffset, item._xlOrder),
      this.createBreakpoint(item, '2xl', item._2xl, item._2xlOffset, item._2xlOrder),
      this.createBreakpoint(item, '3xl', item._3xl, item._3xlOffset, item._3xlOrder),
      this.createBreakpoint(item, '4xl', item._4xl, item._4xlOffset, item._4xlOrder),
    ];
  }

  createBreakpoint(item: INgxGridItem, name: string, size?: NgxGridColumnSize|null, offset?: NgxGridColumnSize|null, order?: number|null): NgxGridBreakpoint {
    const breakpoint: NgxGridBreakpoint = { name, size, offset, order };
    if(name == this.getOptions().baseBreakpoint){
      breakpoint.size = breakpoint.size ?? item._size ?? this.getOptions().baseSize;
      breakpoint.order = breakpoint.order ?? item._order;
      breakpoint.offset = breakpoint.offset ?? item._offset;
    }
    switch(name){
      case 'xs': breakpoint.size = breakpoint.size || this.getOptions().baseSize; break;
    }
    breakpoint.order = breakpoint.order ?? 0;
    return breakpoint;
  }

  /**
   * # # # # # # # # # # # # # # # # # #
   * Changes
   * # # # # # # # # # # # # # # # # # #
   */
  getChanges(): Observable<void> {
    return this.changes$ as Observable<void>;
  }
  emitChange(): void {
    this.changes$.next();
  }

  /**
   * # # # # # # # # # # # # # # # # # #
   * Others
   * # # # # # # # # # # # # # # # # # #
   */
  ngOnDestroy(){
    this.changes$.complete();
  }

}

interface GridItem {
  index: number;
  item: INgxGridItem;
  type: 'group'|'column';
  ngClass: { [klass: string]: any };
  ngStyle: { [klass: string]: any };
  ngxStyleVariables: { [variable: string]: string|number|boolean|null|undefined; };
  positions: GridItemPositions;
}

type GridItemPositions = { [size: string]: GridItemPosition };

interface GridItemPosition {
  rowStart: number;
  rowEnd: number;
  columnStart: number;
  columnEnd: number;
}
