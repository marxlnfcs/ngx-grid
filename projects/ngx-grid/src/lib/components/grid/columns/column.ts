import {Directive, OnChanges, OnDestroy, OnInit} from "@angular/core";
import {GridColumnBase} from "./base";

@Directive({
  selector: 'ngx-grid-column',
  standalone: true,
  host: {
    '[class.ngx-grid-column]': 'true',
  }
})
export class GridColumn extends GridColumnBase implements OnInit, OnChanges, OnDestroy {
  type: 'column' = 'column';

  /** Register column */
  ngOnInit() {
    this.parentGridRef.registerColumn(this);
  }

  /** Emit changes if any input changes */
  ngOnChanges() {
    this.parentGridRef.emitChange();
  }

  /** Unregister column */
  ngOnDestroy() {
    this.parentGridRef.unregisterColumn(this);
  }
}
