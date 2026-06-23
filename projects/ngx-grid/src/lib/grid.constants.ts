import {IGridOptions} from "./grid.interface";
import {InjectionToken, Type} from "@angular/core";
import {Grid} from "./components/grid/grid.component";
import {GridColumn} from "./components/grid/columns/column";
import {GridGroup} from "./components/grid/columns/group";
import {GridCentered} from "./components/grid-centered/grid-centered.component";
import {GridScreenSize} from "./directives/screen-size.directive";
import {GridClass} from "./directives/class/base.directive";
import {GridClassMin} from "./directives/class/min.directive";
import {GridClassMax} from "./directives/class/max.directive";
import {GridStyle} from "./directives/style/base.directive";
import {GridStyleMin} from "./directives/style/min.directive";
import {GridStyleMax} from "./directives/style/max.directive";

export const GRID_OPTIONS_DEFAULTS: IGridOptions = {
  strategy: 'screen',
  baseBreakpoint: 'xs',
  baseSize: 12,
  gap: '1rem',
  autoRows: 'min-content',
  breakpoints: {
    xs: 0,
    sm: 481,
    md: 769,
    lg: 1025,
    xl: 1201,
    '2xl': 1400,
    '3xl': 1600,
    '4xl': 1800,
    mobile: 0,
    tablet: 769,
    desktop: 1400,
  },
}

export const GRID_OPTIONS = new InjectionToken<Partial<IGridOptions>>('ngx-grid-options');

export const GridImports: Type<any>[] = [
  Grid,
  GridColumn,
  GridGroup,
  GridCentered,

  GridScreenSize,
  GridClass,
  GridClassMin,
  GridClassMax,
  GridStyle,
  GridStyleMin,
  GridStyleMax,
];
