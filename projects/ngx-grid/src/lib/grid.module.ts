import {ModuleWithProviders, NgModule, Type} from "@angular/core";
import {CommonModule} from "@angular/common";
import {NgxGridAltCenteredComponent} from "./components/grid-alt-centered/grid-alt-centered.component";
import {NgxGridAltColumnDirective, NgxGridAltGroupDirective} from "./components/grid-alt/grid-alt.directive";
import {NgxGridAltComponent} from "./components/grid-alt/grid-alt.component";
import {NgxGridOptions} from "./interfaces/grid.interface";
import {GRID_OPTIONS} from "./grid.constants";
import {NgxGridComponent} from "./components/grid/grid.component";
import {NgxGridColumnDirective, NgxGridGroupDirective} from "./components/grid/grid.directive";
import {NgxGridScreenSizeDirective} from "./directives/screen-size.directive";
import {NgxGridClassDirective} from "./directives/class.directive";
import {NgxGridStyleDirective} from "./directives/style.directive";
import {NgxGridCenteredComponent} from "./components/grid-centered/grid-centered.component";

const declarations: Type<any>[] = [
  NgxGridAltComponent,
  NgxGridAltColumnDirective,
  NgxGridAltGroupDirective,
  NgxGridAltCenteredComponent,

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
        { provide: GRID_OPTIONS, useValue: options || {} }
      ],
    }
  }
}
