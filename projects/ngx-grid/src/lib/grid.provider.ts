import {Provider} from "@angular/core";
import {IGridOptions} from "./grid.interface";
import {GRID_OPTIONS} from "./grid.constants";
import {GridService} from "./services/grid.service";
import {DeepPartial} from "./grid.type";

export function provideGrid(options?: DeepPartial<IGridOptions>): Provider[] {
  return [
    { provide: GRID_OPTIONS, useValue: options || {} },
    GridService,
  ]
}
