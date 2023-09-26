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
  NgxGridBreakpointName, NgxGridColumnSize,
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
  built$: boolean = false;

  @Input() baseBreakpoint?: NgxGridBreakpointName|null;
  @Input() baseSize?: NgxGridColumnSizeEven|null;
  @Input() strategy?: NgxGridStrategy|null;

  @Input() rows?: string[]|null;
  @Input() autoRows?: NgxGridAutoRows|null;
  @Input() options?: Partial<NgxGridOptions>|null;

  @Input('gap') _gap?: NgxGridGapSize|null;
  @Input('columnGap') _columnGap?: NgxGridGapSize|null;
  @Input('rowGap') _rowGap?: NgxGridGapSize|null;

  @Input('xs:gap') _xsGap?: NgxGridGapSize|null;
  @Input('xs:columnGap') _xsColumnGap?: NgxGridGapSize|null;
  @Input('xs:rowGap') _xsRowGap?: NgxGridGapSize|null;

  @Input('sm:gap') _smGap?: NgxGridGapSize|null;
  @Input('sm:columnGap') _smColumnGap?: NgxGridGapSize|null;
  @Input('sm:rowGap') _smRowGap?: NgxGridGapSize|null;

  @Input('md:gap') _mdGap?: NgxGridGapSize|null;
  @Input('md:columnGap') _mdColumnGap?: NgxGridGapSize|null;
  @Input('md:rowGap') _mdRowGap?: NgxGridGapSize|null;

  @Input('lg:gap') _lgGap?: NgxGridGapSize|null;
  @Input('lg:columnGap') _lgColumnGap?: NgxGridGapSize|null;
  @Input('lg:rowGap') _lgRowGap?: NgxGridGapSize|null;

  @Input('xl:gap') _xlGap?: NgxGridGapSize|null;
  @Input('xl:columnGap') _xlColumnGap?: NgxGridGapSize|null;
  @Input('xl:rowGap') _xlRowGap?: NgxGridGapSize|null;

  @Input('2xl:gap') _2xlGap?: NgxGridGapSize|null;
  @Input('2xl:columnGap') _2xlColumnGap?: NgxGridGapSize|null;
  @Input('2xl:rowGap') _2xlRowGap?: NgxGridGapSize|null;

  @Input('3xl:gap') _3xlGap?: NgxGridGapSize|null;
  @Input('3xl:columnGap') _3xlColumnGap?: NgxGridGapSize|null;
  @Input('3xl:rowGap') _3xlRowGap?: NgxGridGapSize|null;

  @Input('4xl:gap') _4xlGap?: NgxGridGapSize|null;
  @Input('4xl:columnGap') _4xlColumnGap?: NgxGridGapSize|null;
  @Input('4xl:rowGap') _4xlRowGap?: NgxGridGapSize|null;

  @Input('mobile:gap') _mobileGap?: NgxGridGapSize|null;
  @Input('mobile:columnGap') _mobileColumnGap?: NgxGridGapSize|null;
  @Input('mobile:rowGap') _mobileRowGap?: NgxGridGapSize|null;

  @Input('tablet:gap') _tabletGap?: NgxGridGapSize|null;
  @Input('tablet:columnGap') _tabletColumnGap?: NgxGridGapSize|null;
  @Input('tablet:rowGap') _tabletRowGap?: NgxGridGapSize|null;

  @Input('desktop:gap') _desktopGap?: NgxGridGapSize|null;
  @Input('desktop:columnGap') _desktopColumnGap?: NgxGridGapSize|null;
  @Input('desktop:rowGap') _desktopRowGap?: NgxGridGapSize|null;

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
      gap: this._gap as any ?? this.options?.gap,
      columnGap: this._columnGap as any ?? this.options?.columnGap,
      rowGap: this._rowGap as any ?? this.options?.rowGap,
      breakpointGaps: this.options?.breakpointGaps || {},
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
