export type IGridStrategy = 'screen'|'container';
export type IGridColumnSize = 1|2|3|4|5|6|7|8|9|10|11|12;
export type IGridColumnSizeEven = 2|4|6|8|10|12;
export type IGridBreakpointName = keyof IGridBreakpoints;
export type IGridAutoRows = 'min-content'|'max-content'|'auto'|string|number;
export type IGridBreakpointSize = number|`${number}px`|`${number}rem`|`${number}em`;
export type IGridGapSize = IGridBreakpointSize|false|null;
export type IGridClass = Record<string, boolean|null|undefined>;
export type IGridStyle = Record<string, string|null|undefined>;

export interface IGridBreakpoint {
  name: string;
  width?: IGridBreakpointSize|null;
  size?: IGridColumnSize|null;
  offset?: IGridColumnSize|null;
  order?: number|null;
}

export interface IGridBreakpoints {
  /** Breakpoints */
  xs: IGridBreakpointSize;
  sm: IGridBreakpointSize;
  md: IGridBreakpointSize;
  lg: IGridBreakpointSize;
  xl: IGridBreakpointSize;
  '2xl': IGridBreakpointSize;
  '3xl': IGridBreakpointSize;
  '4xl': IGridBreakpointSize;

  /** Simple breakpoints */
  mobile: IGridBreakpointSize;
  tablet: IGridBreakpointSize;
  desktop: IGridBreakpointSize;
}

export interface IGridOptions {

  /**
   * Defines which strategy the css style should use
   * > screen - Uses the @media query to evaluate the size of the columns based on the viewpoint
   * > container - Uses the @container query to evaluate the size of the column based on the parent container
   * @example container
   * @default screen
   */
  strategy: IGridStrategy;

  /**
   * Defines the base breakpoint
   * @example xs
   * @default 3xl
   */
  baseBreakpoint: IGridBreakpointName;

  /**
   * Defines the base size
   * @example 10
   * @default 12
   */
  baseSize: IGridColumnSizeEven;

  /**
   * Gap between cells and rows
   * @example 2.5rem
   * @default 1rem
   */
  gap: IGridGapSize;

  /**
   * Gap between columns
   * @example 2.5rem
   * @default 1rem
   */
  columnGap?: IGridGapSize;

  /**
   * Gap between columns
   * @example 2.5rem
   * @default 1rem
   */
  rowGap?: IGridGapSize;

  /**
   * Sets the autoRows of the component
   * @example 50px
   * @default min-content
   */
  autoRows: IGridAutoRows;

  /**
   * Breakpoints
   * Only available for the ngx-grid component
   */
  breakpoints: IGridBreakpoints;

}
