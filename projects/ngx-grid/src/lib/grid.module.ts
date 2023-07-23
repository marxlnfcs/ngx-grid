import {ModuleWithProviders, NgModule, Type} from "@angular/core";
import {CommonModule} from "@angular/common";
import {NgxGridOptions} from "./interfaces/grid.interface";
import {GRID_OPTIONS} from "./grid.constants";
import {NgxGridComponent} from "./components/grid/grid.component";
import {NgxGridColumnDirective, NgxGridGroupDirective} from "./components/grid/grid.directive";
import {NgxGridScreenSizeDirective} from "./directives/screen-size.directive";
import {NgxGridClassDirective} from "./directives/class.directive";
import {NgxGridStyleDirective} from "./directives/style.directive";
import {NgxGridCenteredComponent} from "./components/grid-centered/grid-centered.component";
import {NgxGridService} from "./services/grid.service";

const declarations: Type<any>[] = [
  NgxGridComponent,
  NgxGridColumnDirective,
  NgxGridGroupDirective,
  NgxGridCenteredComponent,

  NgxGridScreenSizeDirective,
  NgxGridClassDirective,
  NgxGridStyleDirective,
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
