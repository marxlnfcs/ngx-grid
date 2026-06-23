import {Component} from '@angular/core';
import {GridImports} from "../../../ngx-grid/src/lib/grid.constants";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [GridImports],
})
export class AppComponent {}
