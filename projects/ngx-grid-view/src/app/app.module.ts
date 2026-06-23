import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {GridModule} from "../../../ngx-grid/src/lib/grid.module";

@NgModule({
  imports: [
    BrowserModule,
    GridModule.forRoot({
      baseBreakpoint: '3xl',
    }),
  ],
  declarations: [],
  providers: [],
})
export class AppModule { }
