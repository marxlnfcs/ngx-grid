import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  Optional,
  QueryList,
  SimpleChanges
} from "@angular/core";
import {NgxGridBreakpointName, NgxGridColumnSizeEven, NgxGridOptions} from "../../interfaces/grid.interface";
import {GRID_OPTIONS, GRID_OPTIONS_DEFAULTS} from "../../grid.constants";
import {NgxGridRef} from "../../services/grid-ref.service";
import {NgxGridItem, NgxGridItemType} from "./grid.directive"
import {Subscription} from "rxjs";
import {DomSanitizer, SafeStyle} from "@angular/platform-browser";

@Component({
  selector: 'ngx-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NgxGridRef],
})
export class NgxGridComponent implements AfterContentInit, OnChanges, OnDestroy {
  @ContentChildren(NgxGridItem) private itemsRef!: QueryList<NgxGridItemType>;

  @Input() gap?: string|number|false|null;
  @Input() columnGap?: string|number|false|null;
  @Input() rowGap?: string|number|false|null;
  @Input() rows?: string[];
  @Input() baseBreakpoint?: NgxGridBreakpointName|null;
  @Input() baseSize?: NgxGridColumnSizeEven|null;
  @Input() autoRows?: boolean|null;

  gridSubs: Subscription[] = [];

  constructor(
    @Optional() @Inject(GRID_OPTIONS) private gridOptions: NgxGridOptions,
    private changeDetectorRef: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private gridRef: NgxGridRef,
  ){
    this.gridRef.setOptions(this.options);
  }

  ngAfterContentInit(){
    this.gridSubs.push(this.itemsRef.changes.subscribe(() => this.gridRef.emitChange()));
    this.gridSubs.push(this.gridRef.getChanges().subscribe(() => this.build()));
    this.gridRef.emitChange();
    this.changeDetectorRef.markForCheck();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.gridRef.setOptions(this.options);
    this.gridRef.emitChange();
  }

  ngOnDestroy() {
    this.gridRef.ngOnDestroy();
    this.gridSubs.map(s => s.unsubscribe());
    this.gridSubs = [];
  }

  private build(){
    this.gridRef.createColumns(null, this.itemsRef.map(d => d)).map(column => {
      column.item.apply(column.ngClass, column.ngStyle, column.ngxStyleVariables);
    });
    this.changeDetectorRef.markForCheck();
  }

  get options(): NgxGridOptions {
    return {
      baseBreakpoint: this.baseBreakpoint ?? this.gridOptions?.baseBreakpoint ?? GRID_OPTIONS_DEFAULTS.baseBreakpoint,
      baseSize: this.baseSize ?? this.gridOptions?.baseSize ?? GRID_OPTIONS_DEFAULTS.baseSize,
      gap: this.gap ?? this.gridOptions?.gap ?? GRID_OPTIONS_DEFAULTS.gap,
      columnGap: this.columnGap ?? this.gridOptions?.columnGap ?? this.gap ?? this.gridOptions?.gap ?? GRID_OPTIONS_DEFAULTS.gap,
      rowGap: this.rowGap ?? this.gridOptions?.rowGap ?? this.gap ?? this.gridOptions?.gap ?? GRID_OPTIONS_DEFAULTS.gap,
      autoRows: this.autoRows ?? this.gridOptions?.autoRows ?? GRID_OPTIONS_DEFAULTS.autoRows,
    }
  }

  get styles(): SafeStyle {
    const styles: any = {
      'grid-template-rows': this.rows ? this.rows.join(' ') : null,
      '--ngx-grid-column-gap': this.options.columnGap,
      '--ngx-grid-row-gap': this.options.rowGap,
      '--ngx-grid-base-size': this.options.baseSize,
    };
    return this.sanitizer.bypassSecurityTrustStyle(
      Object.entries(styles)
        .filter(([key, value]) => !!value)
        .map(([key, value]) => `${key}: ${value}`)
        .join(';')
    );
  }
}
