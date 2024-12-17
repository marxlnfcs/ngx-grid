import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges, OnDestroy,
  Renderer2,
  RendererStyleFlags2
} from '@angular/core';
import {
  NgxGridAutoRows,
  NgxGridBreakpointName,
  NgxGridColumnSizeEven,
  NgxGridOptions
} from "../../interfaces/grid.interface";
import {NgxGridService} from "../../services/grid.service";
import {BehaviorSubject, debounceTime, Subject, takeUntil} from "rxjs";
import {NgxGridColumn} from "../../interfaces/grid-item.interface";
import {NgxGridRef} from "../../services/grid-ref.service";

@Component({
  selector: 'ngx-grid-centered',
  templateUrl: './grid-centered.component.html',
  styleUrls: ['./grid-centered.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
  providers: [NgxGridRef],
  host: {
    '[class.nginx-grid-centered]': 'true',
    '[class.ngx-grid-built]': 'built$',
  },
})
export class NgxGridCenteredComponent implements AfterContentInit, OnChanges, OnDestroy {
  changes$: BehaviorSubject<void> = new BehaviorSubject<any>(null);
  destroy$: Subject<void> = new Subject<void>();
  built$: boolean = false;

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

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private changeDetectorRef: ChangeDetectorRef,
    private renderer2: Renderer2,
    private gridService: NgxGridService,
    private gridRef: NgxGridRef,
  ){}

  ngAfterContentInit(){
    this.applyOptions();
    this.changes$.pipe(takeUntil(this.destroy$), debounceTime(0)).subscribe(() => this.build());
    this.gridService.onWindowResize().pipe(takeUntil(this.destroy$)).subscribe(() => this.changes$.next());
  }

  ngOnChanges(){
    this.changes$.next();
  }

  ngOnDestroy(){
    this.changes$.complete();
    this.destroy$.next();
    this.destroy$.complete();
    this.gridRef.ngOnDestroy();
  }

  private build(){
    const column = this.createColumn();
    const baseSize = this.gridRef.getGlobalOptions().baseSize as number;
    const breakpointSize = this.gridRef.getNearestBreakpoint(column)?.size || null;
    if(breakpointSize && breakpointSize < baseSize){
      const size = (((baseSize - breakpointSize) / baseSize) * 100) / 2;
      this.renderer2.setStyle(this.elementRef.nativeElement, 'padding-left', `${size}%`, RendererStyleFlags2.Important);
      this.renderer2.setStyle(this.elementRef.nativeElement, 'padding-right', `${size}%`, RendererStyleFlags2.Important);
    }else{
      this.renderer2.setStyle(this.elementRef.nativeElement, 'padding-left', '0', RendererStyleFlags2.Important);
      this.renderer2.setStyle(this.elementRef.nativeElement, 'padding-right', '0', RendererStyleFlags2.Important);
    }
    this.built$ = true;
    this.changeDetectorRef.markForCheck();
  }

  private createColumn(): NgxGridColumn {
    return {
      type: 'column',
      elementRef: null as any, // will not be used. That's why we can force it to be null
      _size: this.size,
      _xs: this.size_xs,
      _sm: this.size_sm,
      _md: this.size_md,
      _lg: this.size_lg,
      _xl: this.size_xl,
      _2xl: this.size_2xl,
      _3xl: this.size_3xl,
      _4xl: this.size_4xl,
      _mobile: this.size_mobile,
      _tablet: this.size_tablet,
      _desktop: this.size_desktop,
    }
  }

  private applyOptions() {
    this.gridRef.setGlobalOptions({
      ...(this.options || {}),
      baseBreakpoint: this.baseBreakpoint as any ?? this.options?.baseBreakpoint,
      baseSize: this.baseSize as any ?? this.options?.baseSize,
      autoRows: this.autoRows as any ?? this.options?.autoRows,
    });
  }

}
