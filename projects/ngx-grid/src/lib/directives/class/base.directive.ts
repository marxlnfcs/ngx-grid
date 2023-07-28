import {
  AfterViewInit,
  ChangeDetectorRef,
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  Renderer2
} from "@angular/core";
import {NgxGridClass} from "../../interfaces/grid.interface";
import {BehaviorSubject, debounceTime, Subject, takeUntil} from "rxjs";
import {NgxGridService} from "../../services/grid.service";
import {buildClassBreakpoint} from "./_helpers";

@Directive({
  selector: '[xs.class], [sm.class], [md.class], [lg.class], [xl.class], [2xl.class], [3xl.class], [4xl.class], [mobile.class], [tablet.class], [desktop.class]',
})
export class NgxGridClassDirective implements AfterViewInit, OnChanges, OnDestroy {
  @Input('xs.class') _xsClass?: string|NgxGridClass|string[]|null;
  @Input('sm.class') _smClass?: string|NgxGridClass|string[]|null;
  @Input('md.class') _mdClass?: string|NgxGridClass|string[]|null;
  @Input('lg.class') _lgClass?: string|NgxGridClass|string[]|null;
  @Input('xl.class') _xlClass?: string|NgxGridClass|string[]|null;
  @Input('2xl.class') _2xlClass?: string|NgxGridClass|string[]|null;
  @Input('3xl.class') _3xlClass?: string|NgxGridClass|string[]|null;
  @Input('4xl.class') _4xlClass?: string|NgxGridClass|string[]|null;
  @Input('mobile.class') _mobileClass?: string|NgxGridClass|string[]|null;
  @Input('tablet.class') _tabletClass?: string|NgxGridClass|string[]|null;
  @Input('desktop.class') _desktopClass?: string|NgxGridClass|string[]|null;

  changes$: BehaviorSubject<void> = new BehaviorSubject<any>(null);
  destroy$: Subject<void> = new Subject<void>();

  classes: { [breakpoint: string]: NgxGridClass } = {};

  constructor(
    public elementRef: ElementRef<HTMLElement>,
    public changeDetectorRef: ChangeDetectorRef,
    public renderer2: Renderer2,
    public gridService: NgxGridService,
  ){}

  ngAfterViewInit(){
    this.gridService.onWindowResize().pipe(takeUntil(this.destroy$)).subscribe(() => this.changes$.next());
    this.changes$.pipe(takeUntil(this.destroy$), debounceTime(0)).subscribe(() => this.build());
  }

  private build(){
    buildClassBreakpoint(this, 'min', 'xs', this._xsClass);
    buildClassBreakpoint(this, 'min', 'sm', this._smClass);
    buildClassBreakpoint(this, 'min', 'md', this._mdClass);
    buildClassBreakpoint(this, 'min', 'lg', this._lgClass);
    buildClassBreakpoint(this, 'min', 'xl', this._xlClass);
    buildClassBreakpoint(this, 'min', '2xl', this._2xlClass);
    buildClassBreakpoint(this, 'min', '3xl', this._3xlClass);
    buildClassBreakpoint(this, 'min', '4xl', this._4xlClass);
    buildClassBreakpoint(this, 'min', 'mobile', this._mobileClass);
    buildClassBreakpoint(this, 'min', 'tablet', this._tabletClass);
    buildClassBreakpoint(this, 'min', 'desktop', this._desktopClass);
    this.changeDetectorRef.markForCheck();
  }

  ngOnChanges(){
    this.changes$.next();
  }

  ngOnDestroy() {
    this.changes$.complete();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
