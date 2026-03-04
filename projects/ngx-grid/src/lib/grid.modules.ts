import {Type} from "@angular/core";
import {NgxGridComponent} from "./components/grid/grid.component";
import {NgxGridColumnDirective, NgxGridGroupDirective} from "./components/grid/grid.directive";
import {NgxGridCenteredComponent} from "./components/grid-centered/grid-centered.component";
import {NgxGridScreenSizeDirective} from "./directives/screen-size.directive";
import {NgxGridClassDirective} from "./directives/class/base.directive";
import {NgxGridMinClassDirective} from "./directives/class/min.directive";
import {NgxGridMaxClassDirective} from "./directives/class/max.directive";
import {NgxGridStyleDirective} from "./directives/style/base.directive";
import {NgxGridMinStyleDirective} from "./directives/style/min.directive";
import {NgxGridMaxStyleDirective} from "./directives/style/max.directive";

export const GRID_MODULES: Type<any>[] = [
  NgxGridComponent,
  NgxGridColumnDirective,
  NgxGridGroupDirective,
  NgxGridCenteredComponent,

  NgxGridScreenSizeDirective,
  NgxGridClassDirective,
  NgxGridMinClassDirective,
  NgxGridMaxClassDirective,
  NgxGridStyleDirective,
  NgxGridMinStyleDirective,
  NgxGridMaxStyleDirective,
];
