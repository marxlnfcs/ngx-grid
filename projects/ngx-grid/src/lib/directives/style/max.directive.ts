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
  selector: '[max.xs.style], [max.sm.style], [max.md.style], [max.lg.style], [max.xl.style], [max.2xl.style], [max.3xl.style], [max.4xl.style], [max.mobile.style], [max.tablet.style], [max.desktop.style]',
})
export class NgxGridMaxStyleDirective implements AfterViewInit, OnChanges, OnDestroy {
  @Input('max.xs.style') _xsStyle?: string|NgxGridStyle|string[]|null;
  @Input('max.sm.style') _smStyle?: string|NgxGridStyle|string[]|null;
  @Input('max.md.style') _mdStyle?: string|NgxGridStyle|string[]|null;
  @Input('max.lg.style') _lgStyle?: string|NgxGridStyle|string[]|null;
  @Input('max.xl.style') _xlStyle?: string|NgxGridStyle|string[]|null;
  @Input('max.2xl.style') _2xlStyle?: string|NgxGridStyle|string[]|null;
  @Input('max.3xl.style') _3xlStyle?: string|NgxGridStyle|string[]|null;
  @Input('max.4xl.style') _4xlStyle?: string|NgxGridStyle|string[]|null;
  @Input('max.mobile.style') _mobileClass?: string|NgxGridClass|string[]|null;
  @Input('max.tablet.style') _tabletClass?: string|NgxGridClass|string[]|null;
  @Input('max.desktop.style') _desktopClass?: string|NgxGridClass|string[]|null;

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
    buildStyleBreakpoint(this, 'max', 'xs', this._xsStyle);
    buildStyleBreakpoint(this, 'max', 'sm', this._smStyle);
    buildStyleBreakpoint(this, 'max', 'md', this._mdStyle);
    buildStyleBreakpoint(this, 'max', 'lg', this._lgStyle);
    buildStyleBreakpoint(this, 'max', 'xl', this._xlStyle);
    buildStyleBreakpoint(this, 'max', '2xl', this._2xlStyle);
    buildStyleBreakpoint(this, 'max', '3xl', this._3xlStyle);
    buildStyleBreakpoint(this, 'max', '4xl', this._4xlStyle);
    buildStyleBreakpoint(this, 'max', 'mobile', this._mobileClass);
    buildStyleBreakpoint(this, 'max', 'tablet', this._tabletClass);
    buildStyleBreakpoint(this, 'max', 'desktop', this._desktopClass);
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
