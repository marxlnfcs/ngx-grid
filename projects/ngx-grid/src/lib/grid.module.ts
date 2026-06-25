import {ModuleWithProviders, NgModule, Type} from "@angular/core";
import {IGridOptions} from "./grid.interface";
import {provideGrid} from "./grid.provider";
import {Grid} from "./components/grid/grid.component";
import {GridColumn} from "./components/grid/columns/column";
import {GridGroup} from "./components/grid/columns/group";
import {GridTemplateOutlet} from "./components/grid/grid.directive";
import {GridCentered} from "./components/grid-centered/grid-centered.component";
import {GridScreenSize} from "./directives/screen-size.directive";
import {GridClass} from "./directives/class/base.directive";
import {GridClassMin} from "./directives/class/min.directive";
import {GridClassMax} from "./directives/class/max.directive";
import {GridStyle} from "./directives/style/base.directive";
import {GridStyleMin} from "./directives/style/min.directive";
import {GridStyleMax} from "./directives/style/max.directive";

const GridImports: Type<any>[] = [
  Grid,
  GridColumn,
  GridGroup,
  GridTemplateOutlet,

  GridCentered,

  GridScreenSize,
  GridClass,
  GridClassMin,
  GridClassMax,
  GridStyle,
  GridStyleMin,
  GridStyleMax,
];

@NgModule({
  imports: GridImports,
  exports: GridImports,
})
export class GridModule {
  static forRoot(options?: Partial<IGridOptions>): ModuleWithProviders<GridModule> {
    return {
      ngModule: GridModule,
      providers: provideGrid(options),
    }
  }
}
