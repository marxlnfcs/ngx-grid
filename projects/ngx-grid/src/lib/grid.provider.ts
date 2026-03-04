import {Provider} from "@angular/core";
import {NgxGridOptions} from "./interfaces/grid.interface";
import {GRID_OPTIONS} from "./grid.constants";
import {NgxGridService} from "./services/grid.service";

export function provideGrid(options?: Partial<NgxGridOptions>): Provider[] {
  return [
    { provide: GRID_OPTIONS, useValue: options || {} },
    NgxGridService,
  ]
}
