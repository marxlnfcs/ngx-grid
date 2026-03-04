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
import {NgxGridClass, NgxGridStyle} from "../../interfaces/grid.interface";
import {BehaviorSubject, debounceTime, Subject, takeUntil} from "rxjs";
import {NgxGridService} from "../../services/grid.service";
import {buildStyleBreakpoint} from "./_helpers";

@Directive({
  selector: '[min.xs.style], [min.sm.style], [min.md.style], [min.lg.style], [min.xl.style], [min.2xl.style], [min.3xl.style], [min.4xl.style], [min.mobile.style], [min.tablet.style], [min.desktop.style]',
})
export class NgxGridMinStyleDirective implements AfterViewInit, OnChanges, OnDestroy {
  @Input('min.xs.style') _xsStyle?: string|NgxGridStyle|string[]|null;
  @Input('min.sm.style') _smStyle?: string|NgxGridStyle|string[]|null;
  @Input('min.md.style') _mdStyle?: string|NgxGridStyle|string[]|null;
  @Input('min.lg.style') _lgStyle?: string|NgxGridStyle|string[]|null;
  @Input('min.xl.style') _xlStyle?: string|NgxGridStyle|string[]|null;
  @Input('min.2xl.style') _2xlStyle?: string|NgxGridStyle|string[]|null;
  @Input('min.3xl.style') _3xlStyle?: string|NgxGridStyle|string[]|null;
  @Input('min.4xl.style') _4xlStyle?: string|NgxGridStyle|string[]|null;
  @Input('min.mobile.style') _mobileClass?: string|NgxGridClass|string[]|null;
  @Input('min.tablet.style') _tabletClass?: string|NgxGridClass|string[]|null;
  @Input('min.desktop.style') _desktopClass?: string|NgxGridClass|string[]|null;

  changes$: BehaviorSubject<void> = new BehaviorSubject<any>(null);
  destroy$: Subject<void> = new Subject<void>();

  styles: { [breakpoint: string]: NgxGridStyle } = {};

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
    buildStyleBreakpoint(this, 'min', 'xs', this._xsStyle);
    buildStyleBreakpoint(this, 'min', 'sm', this._smStyle);
    buildStyleBreakpoint(this, 'min', 'md', this._mdStyle);
    buildStyleBreakpoint(this, 'min', 'lg', this._lgStyle);
    buildStyleBreakpoint(this, 'min', 'xl', this._xlStyle);
    buildStyleBreakpoint(this, 'min', '2xl', this._2xlStyle);
    buildStyleBreakpoint(this, 'min', '3xl', this._3xlStyle);
    buildStyleBreakpoint(this, 'min', '4xl', this._4xlStyle);
    buildStyleBreakpoint(this, 'min', 'mobile', this._mobileClass);
    buildStyleBreakpoint(this, 'min', 'tablet', this._tabletClass);
    buildStyleBreakpoint(this, 'min', 'desktop', this._desktopClass);
    this.changeDetectorRef.markForCheck();
  }

  ngOnChanges() {
    this.changes$.next();
  }

  ngOnDestroy() {
    this.changes$.complete();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
