import {ModuleWithProviders, NgModule, Type} from "@angular/core";
import {CommonModule} from "@angular/common";
import {NgxGridOptions} from "./interfaces/grid.interface";
import {GRID_OPTIONS} from "./grid.constants";
import {NgxGridComponent} from "./components/grid/grid.component";
import {NgxGridColumnDirective, NgxGridGroupDirective} from "./components/grid/grid.directive";
import {NgxGridScreenSizeDirective} from "./directives/screen-size.directive";
import {NgxGridClassDirective} from "./directives/class/base.directive";
import {NgxGridStyleDirective} from "./directives/style/base.directive";
import {NgxGridCenteredComponent} from "./components/grid-centered/grid-centered.component";
import {NgxGridService} from "./services/grid.service";
import {NgxGridMinClassDirective} from "./directives/class/min.directive";
import {NgxGridMaxClassDirective} from "./directives/class/max.directive";
import {NgxGridMinStyleDirective} from "./directives/style/min.directive";
import {NgxGridMaxStyleDirective} from "./directives/style/max.directive";

const declarations: Type<any>[] = [
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

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: declarations,
  exports: declarations,
})
export class NgxGridModule {
  static forRoot(options?: Partial<NgxGridOptions>): ModuleWithProviders<NgxGridModule> {
    return {
      ngModule: NgxGridModule,
      providers: [
        { provide: GRID_OPTIONS, useValue: options || {} },
        NgxGridService,
      ],
    }
  }
}
