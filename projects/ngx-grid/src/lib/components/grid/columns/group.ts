import {
  Directive,
  inject,
  input,
  InputSignal,
  InputSignalWithTransform,
  OnChanges,
  OnDestroy,
  OnInit
} from "@angular/core";
import {GridColumnBase} from "./base";
import {GridRef} from "../../../services/grid-ref.service";
import {IGridAutoRows, IGridGapSize, IGridOptions, IGridStrategy} from "../../../grid.interface";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {debounceTime} from "rxjs";

@Directive({
  selector: 'ngx-grid-group',
  standalone: true,
  providers: [GridRef],
  host: {
    '[class.ngx-grid-group]': 'true',
  },
})
export class GridGroup extends GridColumnBase implements OnInit, OnChanges, OnDestroy {
  type: 'group' = 'group';

  readonly ownGridRef = inject(GridRef, {
    self: true
  });

  strategy: InputSignal<IGridStrategy|undefined> = input<IGridStrategy>();
  gap: InputSignal<IGridGapSize|undefined> = input<IGridGapSize>();
  columnGap: InputSignal<IGridGapSize|undefined> = input<IGridGapSize>();
  rowGap: InputSignal<IGridGapSize|undefined> = input<IGridGapSize>();
  rows: InputSignal<string[]|undefined> = input<string[]>();
  autoRows: InputSignal<IGridAutoRows|undefined> = input<IGridAutoRows>();

  options: InputSignalWithTransform<Partial<IGridOptions>|undefined, IGridOptions> = input<Partial<IGridOptions>|undefined, IGridOptions>(undefined, {
    transform: (partial) => this.gridService.buildOptions(this.parentGridRef.options(), partial, {
      strategy: this.strategy(),
      gap: this.gap(),
      columnGap: this.columnGap(),
      rowGap: this.rowGap(),
      autoRows: this.autoRows(),
    })
  });

  constructor(){ super();
    this.ownGridRef.changes.pipe(takeUntilDestroyed(), debounceTime(0)).subscribe({ next: () => this.parentGridRef.emitChange() });
  }

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
