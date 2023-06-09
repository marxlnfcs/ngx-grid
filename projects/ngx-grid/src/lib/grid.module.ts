import {ModuleWithProviders, NgModule, Type} from "@angular/core";
import {CommonModule} from "@angular/common";
import {NgxGridCenteredComponent} from "./components/grid-centered/grid-centered.component";
import {NgxGridColumnDirective, NgxGridGroupDirective} from "./components/grid/grid.directive";
import {NgxGridComponent} from "./components/grid/grid.component";
import {NgxGridOptions} from "./interfaces/grid.interface";
import {GRID_OPTIONS} from "./grid.constants";

const declarations: Type<any>[] = [
  NgxGridComponent,
  NgxGridColumnDirective,
  NgxGridGroupDirective,
  NgxGridCenteredComponent,
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
