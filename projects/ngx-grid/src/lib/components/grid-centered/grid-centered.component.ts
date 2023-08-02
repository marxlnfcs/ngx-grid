import {AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges} from '@angular/core';
import {
  NgxGridAutoRows,
  NgxGridBreakpointName,
  NgxGridColumnSizeEven,
  NgxGridOptions
} from "../../interfaces/grid.interface";
import {NgxGridService} from "../../services/grid.service";
import {BehaviorSubject, debounceTime, Subject, takeUntil} from "rxjs";

@Component({
  selector: 'ngx-grid-centered',
  templateUrl: './grid-centered.component.html',
  styleUrls: ['./grid-centered.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxGridCenteredComponent implements AfterContentInit, OnChanges {
  changes$: BehaviorSubject<void> = new BehaviorSubject<any>(null);
  destroy$: Subject<void> = new Subject<void>();

  @Input() baseBreakpoint?: NgxGridBreakpointName|null;
  @Input() baseSize?: NgxGridColumnSizeEven|null;
  @Input() autoRows?: NgxGridAutoRows|null;

  @Input() options?: Partial<NgxGridOptions>|null;

  @Input('size') size?: NgxGridColumnSizeEven|null = 12;
  @Input('xs:size') size_xs?: NgxGridColumnSizeEven|null;
  @Input('sm:size') size_sm?: NgxGridColumnSizeEven|null;
  @Input('md:size') size_md?: NgxGridColumnSizeEven|null;
  @Input('lg:size') size_lg?: NgxGridColumnSizeEven|null;
  @Input('xl:size') size_xl?: NgxGridColumnSizeEven|null;
  @Input('2xl:size') size_2xl?: NgxGridColumnSizeEven|null;
  @Input('3xl:size') size_3xl?: NgxGridColumnSizeEven|null;
  @Input('4xl:size') size_4xl?: NgxGridColumnSizeEven|null;
  @Input('mobile:size') size_mobile?: NgxGridColumnSizeEven|null;
  @Input('tablet:size') size_tablet?: NgxGridColumnSizeEven|null;
  @Input('desktop:size') size_desktop?: NgxGridColumnSizeEven|null;

  offset?: NgxGridColumnSizeEven|null;
  offset_xs?: NgxGridColumnSizeEven|null;
  offset_sm?: NgxGridColumnSizeEven|null;
  offset_md?: NgxGridColumnSizeEven|null;
  offset_lg?: NgxGridColumnSizeEven|null;
  offset_xl?: NgxGridColumnSizeEven|null;
  offset_2xl?: NgxGridColumnSizeEven|null;
  offset_3xl?: NgxGridColumnSizeEven|null;
  offset_4xl?: NgxGridColumnSizeEven|null;
  offset_mobile?: NgxGridColumnSizeEven|null;
  offset_tablet?: NgxGridColumnSizeEven|null;
  offset_desktop?: NgxGridColumnSizeEven|null;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private gridService: NgxGridService,
  ){}

  ngAfterContentInit(){
    this.changes$.pipe(takeUntil(this.destroy$), debounceTime(0)).subscribe(() => this.build());
  }

  ngOnChanges(){
    this.changes$.next();
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
    this.offset_mobile = this.buildOffset(this.size_mobile);
    this.offset_tablet = this.buildOffset(this.size_tablet);
    this.offset_desktop = this.buildOffset(this.size_desktop);
    this.changeDetectorRef.markForCheck();
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
    return this.gridService.getOptions({
      ...(this.options || {}),
      baseBreakpoint: this.baseBreakpoint as any ?? this.options?.baseBreakpoint,
      baseSize: this.baseSize as any ?? this.options?.baseSize,
      autoRows: this.autoRows as any ?? this.options?.autoRows,
    });
  }

}
