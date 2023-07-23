import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component, ContentChildren,
  ElementRef,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  Optional, QueryList,
  SimpleChanges
} from "@angular/core";
import {GRID_OPTIONS, GRID_OPTIONS_DEFAULTS} from "../../grid.constants";
import {
  NgxGridBreakpointName,
  NgxGridColumnSizeEven, NgxGridGapSize,
  NgxGridOptions,
  NgxGridStrategy,
  NgxGridStyle
} from "../../interfaces/grid.interface";
import {debounceTime, Subscription} from "rxjs";
import {createEvent} from "../../utils/event.utils";
import {NgxGridRef} from "../../services/grid-ref.service";
import {NgxGridGroup} from "../../interfaces/grid-item.interface";
import {NgxGridItemDirective, NgxGridItemType} from "./grid.directive";

@Component({
  selector: 'ngx-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  providers: [NgxGridRef],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxGridComponent implements NgxGridGroup, AfterContentInit, OnChanges, OnDestroy {
  readonly type = 'group';
  @ContentChildren(NgxGridItemDirective) private itemsRef!: QueryList<NgxGridItemType>;

  subscriptions: Subscription[] = [];

  @Input() baseBreakpoint?: NgxGridBreakpointName|null;
  @Input() baseSize?: NgxGridColumnSizeEven|null;
  @Input() strategy?: NgxGridStrategy|null;

  @Input() gap?: NgxGridGapSize;
  @Input() columnGap?: NgxGridGapSize;
  @Input() rowGap?: NgxGridGapSize;
  @Input() rows?: string[]|null;
  @Input() autoRows?: boolean|null;

  constructor(
    @Optional() @Inject(GRID_OPTIONS) private gridOptions: NgxGridOptions,
    public readonly elementRef: ElementRef<HTMLElement>,
    private gridRef: NgxGridRef,
  ){}

  get items(): NgxGridItemType[] {
    return this.itemsRef.toArray()
  }

  ngAfterContentInit(){
    this.subscriptions.push(createEvent(window, 'resize', this.constructor.name).subscribe(() => this.gridRef.emitChange()));
    this.subscriptions.push(this.itemsRef.changes.subscribe(() => this.gridRef.emitChange()));
    this.subscriptions.push(this.gridRef.getChanges().subscribe(() => this.build()));
    this.gridRef.emitChange();
    this.gridRef.markForCheck();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.gridRef.emitChange();
  }

  get options(): NgxGridOptions {
    return {
      strategy: this.strategy ?? this.gridOptions?.strategy,
      baseBreakpoint: this.baseBreakpoint ?? this.gridOptions?.baseBreakpoint,
      baseSize: this.baseSize ?? this.gridOptions?.baseSize,
      gap: this.gap ?? this.gridOptions?.gap ?? GRID_OPTIONS_DEFAULTS.gap,
      columnGap: this.columnGap ?? this.gridOptions?.columnGap ?? this.gap ?? this.gridOptions?.gap,
      rowGap: this.rowGap ?? this.gridOptions?.rowGap ?? this.gap ?? this.gridOptions?.gap,
      autoRows: this.autoRows ?? this.gridOptions?.autoRows,
      breakpoints: this.gridOptions?.breakpoints
    };
  }

  ngOnDestroy() {
    this.gridRef.ngOnDestroy();
    this.subscriptions.map(s => s.unsubscribe());
    this.subscriptions = [];
  }

  build(){
    this.gridRef.setGlobalOptions(this.options);
    this.gridRef.createComponent(this);
  }
}
