import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  QueryList
} from "@angular/core";
import {
  NgxGridAutoRows,
  NgxGridBreakpointName,
  NgxGridColumnSizeEven,
  NgxGridGapSize,
  NgxGridOptions,
  NgxGridStrategy
} from "../../interfaces/grid.interface";
import {debounceTime, Subject, takeUntil} from "rxjs";
import {NgxGridRef} from "../../services/grid-ref.service";
import {NgxGridGroup} from "../../interfaces/grid-item.interface";
import {NgxGridItemDirective, NgxGridItemType} from "./grid.directive";
import {NgxGridService} from "../../services/grid.service";

@Component({
  selector: 'ngx-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  providers: [NgxGridRef],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.ngx-grid-built]': 'built$',
  }
})
export class NgxGridComponent implements NgxGridGroup, AfterContentInit, OnChanges, OnDestroy {
  readonly type = 'group';
  @ContentChildren(NgxGridItemDirective) private itemsRef!: QueryList<NgxGridItemType>;

  destroy$: Subject<void> = new Subject<void>();
  built$: boolean = true;

  @Input() baseBreakpoint?: NgxGridBreakpointName|null;
  @Input() baseSize?: NgxGridColumnSizeEven|null;
  @Input() strategy?: NgxGridStrategy|null;

  @Input() gap?: NgxGridGapSize;
  @Input() columnGap?: NgxGridGapSize;
  @Input() rowGap?: NgxGridGapSize;
  @Input() rows?: string[]|null;
  @Input() autoRows?: NgxGridAutoRows|null;

  @Input() options?: Partial<NgxGridOptions>|null;

  constructor(
    public readonly elementRef: ElementRef<HTMLElement>,
    private gridService: NgxGridService,
    private gridRef: NgxGridRef,
  ){}

  get items(): NgxGridItemType[] {
    return this.itemsRef.toArray()
  }

  ngAfterContentInit(){
    this.gridService.onWindowResize().pipe(takeUntil(this.destroy$)).subscribe(() => this.gridRef.emitChange());
    this.itemsRef.changes.pipe(takeUntil(this.destroy$)).subscribe(() => this.gridRef.emitChange());
    this.gridRef.changes.pipe(takeUntil(this.destroy$), debounceTime(0)).subscribe(() => this.build());
  }

  ngOnChanges() {
    this.gridRef.emitChange();
  }

  get _options(): NgxGridOptions {
    return this.gridService.getOptions({
      ...(this.options || {}),
      strategy: this.strategy as any ?? this.options?.strategy,
      baseBreakpoint: this.baseBreakpoint as any ?? this.options?.baseBreakpoint,
      baseSize: this.baseSize as any ?? this.options?.baseSize,
      gap: this.gap as any ?? this.options?.gap,
      columnGap: this.columnGap as any ?? this.options?.columnGap,
      rowGap: this.rowGap as any ?? this.options?.rowGap,
      autoRows: this.autoRows as any ?? this.options?.autoRows,
    });
  }

  ngOnDestroy() {
    this.gridRef.ngOnDestroy();
    this.destroy$.next();
    this.destroy$.complete();
  }

  build(){
    this.gridRef.setGlobalOptions(this._options);
    this.gridRef.createComponent(this);
    this.gridRef.markForCheck();
    this.built$ = true;
  }
}
