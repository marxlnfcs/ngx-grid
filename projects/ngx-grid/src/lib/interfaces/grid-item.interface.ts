import {NgxGridAutoRows, NgxGridColumnSize, NgxGridGapSize} from "./grid.interface";
import {ElementRef} from "@angular/core";
import {NgxGridItemType} from "../components/grid/grid.directive";

export interface NgxGridItemTemplate {
  elementRef: ElementRef<HTMLElement>;

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

  _mobile?: NgxGridColumnSize|null;
  _mobileOffset?: NgxGridColumnSize|null;
  _mobileOrder?: number|null;

  _tablet?: NgxGridColumnSize|null;
  _tabletOffset?: NgxGridColumnSize|null;
  _tabletOrder?: number|null;

  _desktop?: NgxGridColumnSize|null;
  _desktopOffset?: NgxGridColumnSize|null;
  _desktopOrder?: number|null;
}

export interface NgxGridGroup extends NgxGridItemTemplate {
  readonly type: 'group';

  rows?: string[]|null;
  autoRows?: NgxGridAutoRows|null;
  items: NgxGridItemType[];

  _gap?: NgxGridGapSize|null;
  _columnGap?: NgxGridGapSize|null;
  _rowGap?: NgxGridGapSize|null;

  _xsGap?: NgxGridGapSize|null;
  _xsColumnGap?: NgxGridGapSize|null;
  _xsRowGap?: NgxGridGapSize|null;

  _smGap?: NgxGridGapSize|null;
  _smColumnGap?: NgxGridGapSize|null;
  _smRowGap?: NgxGridGapSize|null;

  _mdGap?: NgxGridGapSize|null;
  _mdColumnGap?: NgxGridGapSize|null;
  _mdRowGap?: NgxGridGapSize|null;

  _lgGap?: NgxGridGapSize|null;
  _lgColumnGap?: NgxGridGapSize|null;
  _lgRowGap?: NgxGridGapSize|null;

  _xlGap?: NgxGridGapSize|null;
  _xlColumnGap?: NgxGridGapSize|null;
  _xlRowGap?: NgxGridGapSize|null;

  _2xlGap?: NgxGridGapSize|null;
  _2xlColumnGap?: NgxGridGapSize|null;
  _2xlRowGap?: NgxGridGapSize|null;

  _3xlGap?: NgxGridGapSize|null;
  _3xlColumnGap?: NgxGridGapSize|null;
  _3xlRowGap?: NgxGridGapSize|null;

  _4xlGap?: NgxGridGapSize|null;
  _4xlColumnGap?: NgxGridGapSize|null;
  _4xlRowGap?: NgxGridGapSize|null;

  _mobileGap?: NgxGridGapSize|null;
  _mobileColumnGap?: NgxGridGapSize|null;
  _mobileRowGap?: NgxGridGapSize|null;

  _tabletGap?: NgxGridGapSize|null;
  _tabletColumnGap?: NgxGridGapSize|null;
  _tabletRowGap?: NgxGridGapSize|null;

  _desktopGap?: NgxGridGapSize|null;
  _desktopColumnGap?: NgxGridGapSize|null;
  _desktopRowGap?: NgxGridGapSize|null;
}

export interface NgxGridColumn extends NgxGridItemTemplate {
  readonly type: 'column';
}

export type NgxGridItem = NgxGridGroup|NgxGridColumn;
