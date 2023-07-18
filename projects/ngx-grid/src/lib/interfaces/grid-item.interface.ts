import {NgxGridColumnSize, NgxGridStrategy} from "./grid.interface";

export interface INgxGridItem {
  type: 'column'|'group';

  _size?: NgxGridColumnSize|null;
  _offset?: NgxGridColumnSize|null;
  _order?: number|null;

  _xs?: NgxGridColumnSize|null;
  _xsOffset?: NgxGridColumnSize|null;
  _xsOrder?: number|null;

  _sm?: NgxGridColumnSize|null;
  _smOffset?: NgxGridColumnSize|null;
  _smOrder?: number|null;

  _md?: NgxGridColumnSize|null;
  _mdOffset?: NgxGridColumnSize|null;
  _mdOrder?: number|null;

  _lg?: NgxGridColumnSize|null;
  _lgOffset?: NgxGridColumnSize|null;
  _lgOrder?: number|null;

  _xl?: NgxGridColumnSize|null;
  _xlOffset?: NgxGridColumnSize|null;
  _xlOrder?: number|null;

  _2xl?: NgxGridColumnSize|null;
  _2xlOffset?: NgxGridColumnSize|null;
  _2xlOrder?: number|null;

  _3xl?: NgxGridColumnSize|null;
  _3xlOffset?: NgxGridColumnSize|null;
  _3xlOrder?: number|null;

  _4xl?: NgxGridColumnSize|null;
  _4xlOffset?: NgxGridColumnSize|null;
  _4xlOrder?: number|null;

  apply(ngClass: { [klass: string]: any; }, ngStyle: { [klass: string]: any; }, ngxStyleVariables: { [variable: string]: string|number|boolean|null|undefined; }): void;
}

export interface INgxGridGroup extends INgxGridItem {
  readonly type: 'group';

  strategy?: NgxGridStrategy|null;
  gap?: string|number|false|null;
  columnGap?: string|number|false|null;
  rowGap?: string|number|false|null;
  rows?: string[]|null;
  autoRows?: boolean|null;
}

export interface INgxGridColumn extends INgxGridItem {
  readonly type: 'column';
}
