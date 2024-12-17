import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {NgxGridModule} from "../../../ngx-grid/src/lib/grid.module";

@NgModule({
  imports: [
    BrowserModule,
    NgxGridModule.forRoot({
      baseBreakpoint: '3xl',
    }),
  ],
  declarations: [
    AppComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
