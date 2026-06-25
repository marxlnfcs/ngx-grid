import {ChangeDetectionStrategy, Component, ElementRef, inject, input, InputSignal, OnChanges} from "@angular/core";
import {
  IGridAutoRows,
  IGridBreakpointName,
  IGridColumnSizeEven,
  IGridGapSize,
  IGridOptions,
  IGridStrategy
} from "../../grid.interface";
import {debounceTime} from "rxjs";
import {GridRef} from "../../services/grid-ref.service";
import {GridService} from "../../services/grid.service";
import {CommonModule} from "@angular/common";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'ngx-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  providers: [GridRef],
  host: {
    '[class.ngx-grid]': 'true',
  }
})
export class Grid implements OnChanges {
  type: 'root' = 'root';

  readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);
  readonly gridService: GridService = inject(GridService);
  readonly ownGridRef: GridRef = inject(GridRef, {
    self: true,
  });

  baseBreakpoint: InputSignal<IGridBreakpointName|undefined> = input<IGridBreakpointName>();
  baseSize: InputSignal<IGridColumnSizeEven|undefined> = input<IGridColumnSizeEven>();

  strategy: InputSignal<IGridStrategy|undefined> = input<IGridStrategy>();
  gap: InputSignal<IGridGapSize|undefined> = input<IGridGapSize>();
  columnGap: InputSignal<IGridGapSize|undefined> = input<IGridGapSize>();
  rowGap: InputSignal<IGridGapSize|undefined> = input<IGridGapSize>();
  rows: InputSignal<string[]|undefined> = input<string[]>();
  autoRows: InputSignal<IGridAutoRows|undefined> = input<IGridAutoRows>();

  options: InputSignal<Partial<IGridOptions>|undefined> = input<Partial<IGridOptions>|undefined>();

  constructor(){
    this.ownGridRef.changes.pipe(takeUntilDestroyed(), debounceTime(0)).subscribe({ next: () => this.build() });
    this.gridService.onWindowResize().pipe(takeUntilDestroyed()).subscribe({ next: () => this.ownGridRef.emitChange() });
  }

  ngOnChanges() {
    this.ownGridRef.updateOptions(this.gridService.buildOptions(this.options(), {
      strategy: this.strategy(),
      baseBreakpoint: this.baseBreakpoint(),
      baseSize: this.baseSize(),
      gap: this.gap(),
      columnGap: this.columnGap(),
      rowGap: this.rowGap(),
      autoRows: this.autoRows(),
    }));
    this.ownGridRef.emitChange();
  }

  private build(){
    this.ownGridRef.buildComponent(this);
    this.elementRef.nativeElement.classList.add('ngx-grid-built');
  }
}
