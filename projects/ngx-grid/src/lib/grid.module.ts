import {ModuleWithProviders, NgModule} from "@angular/core";
import {NgxGridOptions} from "./interfaces/grid.interface";
import {GRID_OPTIONS} from "./grid.constants";
import {NgxGridService} from "./services/grid.service";
import {GRID_MODULES} from "./grid.modules";

@NgModule({
  imports: GRID_MODULES,
  exports: GRID_MODULES,
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
