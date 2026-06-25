import {Component} from '@angular/core';
import {GridModule} from "../../../ngx-grid/src/lib/grid.module";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [GridModule],
})
export class AppComponent {}
