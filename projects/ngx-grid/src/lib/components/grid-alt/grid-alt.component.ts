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
import {
  NgxGridBreakpointName,
  NgxGridColumnSizeEven,
  NgxGridOptions,
  NgxGridStrategy
} from "../../interfaces/grid.interface";
import {GRID_OPTIONS, GRID_OPTIONS_DEFAULTS} from "../../grid.constants";
import {NgxGridAltRef} from "../../services/grid-alt-ref.service";
import {NgxGridAltItemDirective, NgxGridAltItemType} from "./grid-alt.directive"
import {Subscription} from "rxjs";
import {DomSanitizer, SafeStyle} from "@angular/platform-browser";

@Component({
  selector: 'ngx-grid-alt',
  templateUrl: './grid-alt.component.html',
  styleUrls: ['./grid-alt.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NgxGridAltRef],
  host: {
    '[class.ngx-grid-alt-strategy-container]': 'options.strategy === "container"'
  }
})
export class NgxGridAltComponent implements AfterContentInit, OnChanges, OnDestroy {
  @ContentChildren(NgxGridAltItemDirective) private itemsRef!: QueryList<NgxGridAltItemType>;

  @Input() gap?: string|number|false|null;
  @Input() columnGap?: string|number|false|null;
  @Input() rowGap?: string|number|false|null;
  @Input() rows?: string[];
  @Input() baseBreakpoint?: NgxGridBreakpointName|null;
  @Input() baseSize?: NgxGridColumnSizeEven|null;
  @Input() strategy?: NgxGridStrategy|null;
  @Input() autoRows?: boolean|null;

  gridSubs: Subscription[] = [];

  constructor(
    @Optional() @Inject(GRID_OPTIONS) private gridOptions: NgxGridOptions,
    private changeDetectorRef: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private gridRef: NgxGridAltRef,
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
      strategy: this.strategy ?? this.gridOptions?.strategy,
      baseBreakpoint: this.baseBreakpoint ?? this.gridOptions?.baseBreakpoint,
      baseSize: this.baseSize ?? this.gridOptions?.baseSize,
      gap: this.gap ?? this.gridOptions?.gap ?? GRID_OPTIONS_DEFAULTS.gap,
      columnGap: this.columnGap ?? this.gridOptions?.columnGap ?? this.gap ?? this.gridOptions?.gap,
      rowGap: this.rowGap ?? this.gridOptions?.rowGap ?? this.gap ?? this.gridOptions?.gap,
      autoRows: this.autoRows ?? this.gridOptions?.autoRows,
      breakpoints: this.gridOptions?.breakpoints
    }
  }

  get styles(): SafeStyle {
    const styles: any = {
      'grid-template-rows': this.rows ? this.rows.join(' ') : null,
      '--ngx-grid-alt-column-gap': this.gridRef.getOptions().columnGap,
      '--ngx-grid-alt-row-gap': this.gridRef.getOptions().rowGap,
      '--ngx-grid-alt-base-size': this.gridRef.getOptions().baseSize,
    };
    return this.sanitizer.bypassSecurityTrustStyle(
      Object.entries(styles)
        .filter(([key, value]) => !!value)
        .map(([key, value]) => `${key}: ${value}`)
        .join(';')
    );
  }
}
