import {ChangeDetectorRef, Injectable, OnDestroy, Renderer2} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";
import {
  NgxGridBreakpoint,
  NgxGridBreakpointName,
  NgxGridColumnSize,
  NgxGridGaps, NgxGridGapSize,
  NgxGridOptions,
  NgxGridStyle
} from "../interfaces/grid.interface";
import {NgxGridComponent} from "../components/grid/grid.component";
import {NgxGridGroup, NgxGridItem} from "../interfaces/grid-item.interface";
import {isNil, sizeToPixel} from "../utils/common.utils";
import {NgxGridService} from "./grid.service";

@Injectable()
export class NgxGridRef implements OnDestroy {
  private _changes$: BehaviorSubject<void> = new BehaviorSubject<any>(null);
  private _options?: Partial<NgxGridOptions>;

  constructor(
    private renderer2: Renderer2,
    private changeDetectorRef: ChangeDetectorRef,
    private gridService: NgxGridService,
  ){}

  /**
   * # # # # # # # # # # # # # # # # # #
   * Options
   * # # # # # # # # # # # # # # # # # #
   */
  setGlobalOptions(options: Partial<NgxGridOptions>|null) {
    this._options = options as any;
  }

  getGlobalOptions(): NgxGridOptions {
    return this.gridService.getOptions(this._options);
  }

  /**
   * # # # # # # # # # # # # # # # # # #
   * Builder
   * # # # # # # # # # # # # # # # # # #
   */
  createComponent(component: NgxGridComponent): void  {
      this.createColumns(null, [component], true);
  }

  createColumns(group: NgxGridGroup|null, items: NgxGridItem[], root: boolean): GridItem[] {
    const columns: GridItem[] = [];
    this.sortItems(items, group).map((i, index) => {
      if(i.breakpoint){

        // get item
        const { item, breakpoint } = i;

        // create children
        if(item.type === 'group'){
          this.createColumns(item, item.items, false);
        }

        // create position
        const position = this.createPositionStyles(breakpoint, columns);

        // create column
        const column: GridItem = {
          index: index,
          type: item.type,
          item: item,
          styles: this.createBaseStyles(root, item, position, group, breakpoint?.name),
          position: position,
        };

        // apply styles
        Object.entries(column.styles).map(([key, value]) => {
          if(value !== null && value !== undefined){
            if(key.startsWith('--')){
              item.elementRef.nativeElement.style.setProperty(key, value);
            }else{
              this.renderer2.setStyle(item.elementRef.nativeElement, key, value)
            }
          }else{
            if(key.startsWith('--')){
              item.elementRef.nativeElement.style.removeProperty(key);
            }else{
              this.renderer2.removeStyle(item.elementRef.nativeElement, key);
            }
          }
        });

        // add column to array
        columns.push(column);

      }
    });
    return columns;
  }

  private createBaseStyles(root: boolean, item: NgxGridItem, position: GridItemPosition, group?: NgxGridGroup|null, breakpoint?: NgxGridBreakpointName|null): NgxGridStyle {

    // create empty style object
    const styles: NgxGridStyle = {};

    // add base style for group
    if(item.type === 'group'){
      styles['display'] = 'grid';
      styles['align-items'] = 'start';
      styles['width'] = '100%';
      //styles['height'] = '100%';
      //styles['max-height'] = '100%';
      styles['grid-template-columns'] = `repeat(${this.getGlobalOptions().baseSize}, 1fr)`;
      styles['grid-template-rows'] = item?.type === 'group' ? item?.rows?.join(' ') : null;
    }

    // set options for group
    if(item.type === 'group'){
      styles['container-type'] = this.getGlobalOptions().strategy === 'container' ? 'inline-size' : null;
      styles['grid-auto-rows'] = item?.autoRows ?? group?.autoRows ?? this.getGlobalOptions().autoRows ? 'min-content' : null;
    }

    // set gaps for group
    if(item.type === 'group'){
      const gaps = this.createGaps(root, item, breakpoint);

      styles['column-gap'] = root ? `var(--grid-column-gap, ${this.getGlobalOptions()?.columnGap ?? this.getGlobalOptions()?.gap})` : 'var(--grid-column-gap)';
      styles['row-gap'] = root ? `var(--grid-row-gap, ${this.getGlobalOptions()?.rowGap ?? this.getGlobalOptions()?.gap})` : 'var(--grid-row-gap)';

      if(gaps.columnGap) styles['--grid-column-gap'] = (gaps.columnGap ? gaps.columnGap : (gaps.columnGap as any) === false ? '0px' : null) as any;
      if(gaps.rowGap) styles['--grid-row-gap'] = (gaps.rowGap ? gaps.rowGap : (gaps.rowGap as any) === false ? '0px' : null) as any;
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
    return styles;

  }

  private createPositionStyles(breakpoint: NgxGridBreakpoint, columns: GridItem[]): GridItemPosition {
    const previousColumn = columns.length ? columns[columns.length - 1] : null;
    return this.createPosition(
      breakpoint.size || this.getGlobalOptions().baseSize,
      breakpoint.offset || 0,
      breakpoint.order || 999,
      previousColumn?.position
    );
  }

  private createPosition(size: NgxGridColumnSize, offset: NgxGridColumnSize|number, order: number, previousPosition?: GridItemPosition|null): GridItemPosition {

    // create previous position
    const prevPosition: Omit<GridItemPosition, 'columnStart'> = {
      rowStart: previousPosition?.rowStart || 1,
      rowEnd: previousPosition?.rowEnd || 1,
      columnEnd: (previousPosition?.columnEnd || 1) + offset,
      order: previousPosition?.order || 999,
    };

    // get positions of previous item
    const position: GridItemPosition = {
      rowStart: 0, rowEnd: 0, columnStart: 0, columnEnd: 0, order: order,
    };

    // calculate position
    if((prevPosition.columnEnd + size) <= (this.getGlobalOptions().baseSize + 1)){
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

  private createGaps(root: boolean, group: NgxGridGroup, breakpoint?: NgxGridBreakpointName|null): NgxGridGaps {
    const gaps = this.createBreakpointGaps(root, group);
    const currentGap = gaps.find(g => g.name === breakpoint);
    return {
      gap: currentGap?.gap,
      columnGap: currentGap?.columnGap ?? currentGap?.gap,
      rowGap: currentGap?.rowGap ?? currentGap?.gap,
    }
  }

  /**
   * # # # # # # # # # # # # # # # # # #
   * Helpers
   * # # # # # # # # # # # # # # # # # #
   */
  private sortItems(items: NgxGridItem[], group?: NgxGridGroup|null): { item: NgxGridItem, breakpoint: NgxGridBreakpoint|null }[] {
     return items
       .map(item => ({ item, breakpoint: this.getNearestBreakpoint(item, group) }))
       .filter(i => !!i.breakpoint)
       .sort((a, b) => {
         const aOrder = a.breakpoint?.order as number;
         const bOrder = b.breakpoint?.order as number;
         if(aOrder < bOrder) return -1;
         if(aOrder > bOrder) return 1;
         return 0;
       });
  }

  private getNearestBreakpoint(item: NgxGridItem, group?: NgxGridGroup|null): NgxGridBreakpoint|null {
    const containerWidth = this.getContainerWidth(group);
    const breakpoints = this.createBreakpoints(item);
    let nearestBreakpoint: NgxGridBreakpoint|null = null;
    for(let breakpoint of breakpoints.values()){
      const thisWidth = sizeToPixel(breakpoint.width);
      if(breakpoint.size && thisWidth <= containerWidth){
        nearestBreakpoint = breakpoint;
      }
    }
    return nearestBreakpoint;
  }

  private createBreakpoints(item: NgxGridItem): NgxGridBreakpoint[] {
    return [
      this.createBreakpoint(item, 'xs', item._xs, item._xsOffset, item._xsOrder),
      this.createBreakpoint(item, 'sm', item._sm, item._smOffset, item._smOrder),
      this.createBreakpoint(item, 'md', item._md, item._mdOffset, item._mdOrder),
      this.createBreakpoint(item, 'lg', item._lg, item._lgOffset, item._lgOrder),
      this.createBreakpoint(item, 'xl', item._xl, item._xlOffset, item._xlOrder),
      this.createBreakpoint(item, '2xl', item._2xl, item._2xlOffset, item._2xlOrder),
      this.createBreakpoint(item, '3xl', item._3xl, item._3xlOffset, item._3xlOrder),
      this.createBreakpoint(item, '4xl', item._4xl, item._4xlOffset, item._4xlOrder),
      this.createBreakpoint(item, 'mobile', item._mobile, item._mobileOffset, item._mobileOrder),
      this.createBreakpoint(item, 'tablet', item._tablet, item._tabletOffset, item._tabletOrder),
      this.createBreakpoint(item, 'desktop', item._desktop, item._desktopOffset, item._desktopOrder),
    ];
  }

  private createBreakpoint(item: NgxGridItem, name: NgxGridBreakpointName, size?: NgxGridColumnSize|null, offset?: NgxGridColumnSize|null, order?: number|null): NgxGridBreakpoint {
    const breakpoint: NgxGridBreakpoint = { name, size, offset, order };
    if(name === this.getGlobalOptions().baseBreakpoint){
      breakpoint.size = breakpoint.size ?? item._size ?? this.getGlobalOptions().baseSize;
      breakpoint.order = breakpoint.order ?? item._order;
      breakpoint.offset = breakpoint.offset ?? item._offset;
    }
    switch(name){
      case 'xs': breakpoint.size = breakpoint.size || this.getGlobalOptions().baseSize; break;
    }
    breakpoint.width = this.getGlobalOptions().breakpoints[name];
    breakpoint.order = breakpoint.order ?? 999;
    return breakpoint;
  }

  private createBreakpointGaps(root: boolean, item: NgxGridGroup): (NgxGridGaps & { name: NgxGridBreakpointName })[] {
    return [
      this.createBreakpointGap(root, item, 'xs', item._xsGap, item._xsColumnGap, item._xsRowGap),
      this.createBreakpointGap(root, item, 'sm', item._smGap, item._smColumnGap, item._smRowGap),
      this.createBreakpointGap(root, item, 'md', item._mdGap, item._mdColumnGap, item._mdRowGap),
      this.createBreakpointGap(root, item, 'lg', item._lgGap, item._lgColumnGap, item._lgRowGap),
      this.createBreakpointGap(root, item, 'xl', item._xlGap, item._xlColumnGap, item._xlRowGap),
      this.createBreakpointGap(root, item, '2xl', item._2xlGap, item._2xlColumnGap, item._2xlRowGap),
      this.createBreakpointGap(root, item, '3xl', item._3xlGap, item._3xlColumnGap, item._3xlRowGap),
      this.createBreakpointGap(root, item, '4xl', item._4xlGap, item._4xlColumnGap, item._4xlRowGap),
      this.createBreakpointGap(root, item, 'mobile', item._mobileGap, item._mobileColumnGap, item._mobileRowGap),
      this.createBreakpointGap(root, item, 'tablet', item._tabletGap, item._tabletColumnGap, item._tabletRowGap),
      this.createBreakpointGap(root, item, 'desktop', item._desktopGap, item._desktopColumnGap, item._desktopRowGap),
    ];
  }

  private createBreakpointGap(root: boolean, item: NgxGridGroup, name: NgxGridBreakpointName, gap?: NgxGridGapSize|null, columnGap?: NgxGridGapSize|null, rowGap?: NgxGridGapSize|null): NgxGridGaps & { name: NgxGridBreakpointName } {
    const breakpoint: NgxGridGaps = { gap: gap, columnGap: columnGap, rowGap: rowGap };
    if(root && name === this.getGlobalOptions().baseBreakpoint){
      breakpoint.gap = breakpoint.gap ?? item._gap ?? this.getGlobalOptions()?.breakpointGaps[name]?.gap ?? this.getGlobalOptions().gap;
      breakpoint.columnGap = breakpoint.columnGap ?? item._columnGap ?? this.getGlobalOptions()?.breakpointGaps[name]?.columnGap ?? this.getGlobalOptions().columnGap;
      breakpoint.rowGap = breakpoint.rowGap ?? item._rowGap ?? this.getGlobalOptions()?.breakpointGaps[name]?.rowGap ?? this.getGlobalOptions().rowGap;
    }
    return { ...breakpoint, name };
  }

  private getContainerWidth(group?: NgxGridGroup|null): number {
    return this.getGlobalOptions().strategy === 'container' ? group?.elementRef.nativeElement.offsetWidth || window.innerWidth : window.innerWidth;
  }

  /**
   * # # # # # # # # # # # # # # # # # #
   * Changes
   * # # # # # # # # # # # # # # # # # #
   */
  get changes(): Observable<void> {
    return this._changes$ as Observable<void>;
  }
  emitChange(): void {
    this._changes$.next();
  }

  /**
   * # # # # # # # # # # # # # # # # # #
   * Others
   * # # # # # # # # # # # # # # # # # #
   */
  markForCheck(): void {
    this.changeDetectorRef.markForCheck();
  }

  ngOnDestroy(): void{
    this._changes$.complete();
  }
}

interface GridItem {
  index: number;
  item: NgxGridItem;
  type: 'group'|'column';
  styles: NgxGridStyle;
  position: GridItemPosition;
}

interface GridItemPosition {
  rowStart: number;
  rowEnd: number;
  columnStart: number;
  columnEnd: number;
  order: number;
}
