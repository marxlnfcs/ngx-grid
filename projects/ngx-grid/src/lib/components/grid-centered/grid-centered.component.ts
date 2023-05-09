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
import {
  NgxGridBreakpoint,
  NgxGridBreakpointName,
  NgxGridColumnSize,
  NgxGridColumnSizeEven,
  NgxGridOptions
} from "../../interfaces/grid.interface";
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

  componentClasses: { [key: string]: boolean } = {};

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

  private getOptions(): NgxGridOptions {
    return {
      baseBreakpoint: this.baseBreakpoint ?? this.gridOptions?.baseBreakpoint ?? GRID_OPTIONS_DEFAULTS.baseBreakpoint,
      baseSize: this.baseSize ?? this.gridOptions?.baseSize ?? GRID_OPTIONS_DEFAULTS.baseSize,
      gap: this.gridOptions?.gap ?? GRID_OPTIONS_DEFAULTS.gap,
      columnGap: this.gridOptions?.columnGap ?? this.gridOptions?.gap ?? GRID_OPTIONS_DEFAULTS.gap,
      rowGap: this.gridOptions?.rowGap ?? this.gridOptions?.gap ?? GRID_OPTIONS_DEFAULTS.gap,
      autoRows: this.autoRows ?? this.gridOptions?.autoRows ?? GRID_OPTIONS_DEFAULTS.autoRows,
    }
  }

  private build(){
    const breakpoints = this.createBreakpoints();
    breakpoints.filter(b => b.size).map(b => {
      this.componentClasses[`ngx-grid-size-${b.name}-${b.size}`] = true;
    });
  }

  private createBreakpoints(): NgxGridBreakpoint[] {
    return [
      this.createBreakpoint( 'xs', this.size_xs),
      this.createBreakpoint( 'sm', this.size_sm),
      this.createBreakpoint( 'md', this.size_md),
      this.createBreakpoint( 'lg', this.size_lg),
      this.createBreakpoint( 'xl', this.size_xl),
      this.createBreakpoint( '2xl', this.size_2xl),
      this.createBreakpoint( '3xl', this.size_3xl),
      this.createBreakpoint( '4xl', this.size_4xl),
    ];
  }

  createBreakpoint(name: string, size?: NgxGridColumnSize|null): NgxGridBreakpoint {
    const breakpoint: NgxGridBreakpoint = { name, size };
    if(name == this.getOptions().baseBreakpoint){
      breakpoint.size = breakpoint.size ?? this.size ?? this.getOptions().baseSize;
    }
    switch(name){
      case 'xs': breakpoint.size = breakpoint.size || this.getOptions().baseSize; break;
    }
    return breakpoint;
  }
}
