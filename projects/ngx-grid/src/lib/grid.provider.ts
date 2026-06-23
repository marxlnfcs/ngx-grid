import {Provider} from "@angular/core";
import {IGridOptions} from "./grid.interface";
import {GRID_OPTIONS} from "./grid.constants";
import {GridService} from "./services/grid.service";

export function provideGrid(options?: Partial<IGridOptions>): Provider[] {
  return [
    { provide: GRID_OPTIONS, useValue: options || {} },
    GridService,
  ]
}
