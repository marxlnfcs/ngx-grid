import {ApplicationConfig} from '@angular/core';
import {provideGrid} from "../../../ngx-grid/src/lib/grid.provider";

export const appConfig: ApplicationConfig = {
  providers: [
    provideGrid({
      baseBreakpoint: '3xl',
    }),
  ]
};
