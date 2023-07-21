import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Optional,
  SimpleChanges
} from '@angular/core';
import {NgxGridBreakpointName, NgxGridColumnSizeEven, NgxGridOptions} from "../../interfaces/grid.interface";
import {GRID_OPTIONS, GRID_OPTIONS_DEFAULTS} from "../../grid.constants";

@Component({
  selector: 'ngx-grid-centered',
  templateUrl: './grid-centered.component.html',
  styleUrls: ['./grid-centered.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxGridCenteredComponent implements OnInit, OnChanges {
  @Input() baseBreakpoint?: NgxGridBreakpointName|null;
  @Input() baseSize?: NgxGridColumnSizeEven|null;
  @Input() autoRows?: boolean|null;

  @Input('size') size?: NgxGridColumnSizeEven|null = 12;
  @Input('xs:size') size_xs?: NgxGridColumnSizeEven|null;
  @Input('sm:size') size_sm?: NgxGridColumnSizeEven|null;
  @Input('md:size') size_md?: NgxGridColumnSizeEven|null;
  @Input('lg:size') size_lg?: NgxGridColumnSizeEven|null;
  @Input('xl:size') size_xl?: NgxGridColumnSizeEven|null;
  @Input('2xl:size') size_2xl?: NgxGridColumnSizeEven|null;
  @Input('3xl:size') size_3xl?: NgxGridColumnSizeEven|null;
  @Input('4xl:size') size_4xl?: NgxGridColumnSizeEven|null;

  offset?: NgxGridColumnSizeEven|null;
  offset_xs?: NgxGridColumnSizeEven|null;
  offset_sm?: NgxGridColumnSizeEven|null;
  offset_md?: NgxGridColumnSizeEven|null;
  offset_lg?: NgxGridColumnSizeEven|null;
  offset_xl?: NgxGridColumnSizeEven|null;
  offset_2xl?: NgxGridColumnSizeEven|null;
  offset_3xl?: NgxGridColumnSizeEven|null;
  offset_4xl?: NgxGridColumnSizeEven|null;

  constructor(
    @Optional() @Inject(GRID_OPTIONS) private gridOptions: NgxGridOptions,
    private changeDetectorRef: ChangeDetectorRef
  ){}

  ngOnInit(){
    this.build();
  }

  ngOnChanges(changes: SimpleChanges){
    this.build();
    this.changeDetectorRef.markForCheck();
  }

  private build(){
    this.offset = this.buildOffset(this.size);
    this.offset_xs = this.buildOffset(this.size_xs);
    this.offset_sm = this.buildOffset(this.size_sm);
    this.offset_md = this.buildOffset(this.size_md);
    this.offset_lg = this.buildOffset(this.size_lg);
    this.offset_xl = this.buildOffset(this.size_xl);
    this.offset_2xl = this.buildOffset(this.size_2xl);
    this.offset_3xl = this.buildOffset(this.size_3xl);
    this.offset_4xl = this.buildOffset(this.size_4xl);
  }

  private buildOffset(size?: NgxGridColumnSizeEven|null): NgxGridColumnSizeEven|null {
    const baseSize = this.getOptions().baseSize as number;
    const selectedSize = size ? size >= baseSize ? baseSize : size : null;
    if(!selectedSize || selectedSize >= baseSize){
      return null;
    }
    return ((baseSize - selectedSize) / 2) as NgxGridColumnSizeEven;
  }

  private getOptions(): NgxGridOptions {
    return {
      strategy: this.gridOptions?.strategy ?? GRID_OPTIONS_DEFAULTS.strategy,
      baseBreakpoint: this.baseBreakpoint ?? this.gridOptions?.baseBreakpoint ?? GRID_OPTIONS_DEFAULTS.baseBreakpoint,
      baseSize: this.baseSize ?? this.gridOptions?.baseSize ?? GRID_OPTIONS_DEFAULTS.baseSize,
      gap: this.gridOptions?.gap ?? GRID_OPTIONS_DEFAULTS.gap,
      columnGap: this.gridOptions?.columnGap ?? this.gridOptions?.gap ?? GRID_OPTIONS_DEFAULTS.gap,
      rowGap: this.gridOptions?.rowGap ?? this.gridOptions?.gap ?? GRID_OPTIONS_DEFAULTS.gap,
      autoRows: this.autoRows ?? this.gridOptions?.autoRows ?? GRID_OPTIONS_DEFAULTS.autoRows,
      breakpoints: {}
    }
  }

}
