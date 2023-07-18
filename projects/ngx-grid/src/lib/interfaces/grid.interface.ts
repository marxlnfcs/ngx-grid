export type NgxGridStrategy = 'screen'|'container';
export type NgxGridColumnSize = 1|2|3|4|5|6|7|8|9|10|11|12;
export type NgxGridColumnSizeEven = 2|4|6|8|10|12;
export type NgxGridBreakpointName = 'xs'|'sm'|'md'|'lg'|'xl'|'2xl'|'3xl'|'4xl';

export interface NgxGridBreakpoint {
  name: string;
  size?: NgxGridColumnSize|null;
  offset?: NgxGridColumnSize|null;
  order?: number|null;
}

export interface NgxGridOptions {

  /**
   * Defines which strategy the css style should use
   * > screen - Uses the @media query to evaluate the size of the columns based on the viewpoint
   * > container - Uses the @container query to evaluate the size of the column based on the parent container
   * @example container
   * @default screen
   */
  strategy: NgxGridStrategy;

  /**
   * Defines the base breakpoint
   * @example xs
   * @default 3xl
   */
  baseBreakpoint: NgxGridBreakpointName;

  /**
   * Defines the base size
   * @example 10
   * @default 12
   */
  baseSize: NgxGridColumnSizeEven;

  /**
   * Gap between cells and rows
   * @example 2.5rem
   * @default 1rem
   */
  gap: string|number|false;

  /**
   * Gap between columns
   * @example 2.5rem
   * @default 1rem
   */
  columnGap?: string|number|false;

  /**
   * Gap between columns
   * @example 2.5rem
   * @default 1rem
   */
  rowGap?: string|number|false;

  /**
   * Enables the grid-auto-rows feature
   * @example false
   * @default true
   */
  autoRows: boolean;

}
