import {ModuleWithProviders, NgModule} from "@angular/core";
import {GridImports} from "./grid.constants";
import {IGridOptions} from "./grid.interface";
import {provideGrid} from "./grid.provider";

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
