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
  selector: '[max.xs.class], [max.sm.class], [max.md.class], [max.lg.class], [max.xl.class], [max.2xl.class], [max.3xl.class], [max.4xl.class], [max.mobile.class], [max.tablet.class], [max.desktop.class]',
})
export class NgxGridMaxClassDirective implements AfterViewInit, OnChanges, OnDestroy {
  @Input('max.xs.class') _xsClass?: string|NgxGridClass|string[]|null;
  @Input('max.sm.class') _smClass?: string|NgxGridClass|string[]|null;
  @Input('max.md.class') _mdClass?: string|NgxGridClass|string[]|null;
  @Input('max.lg.class') _lgClass?: string|NgxGridClass|string[]|null;
  @Input('max.xl.class') _xlClass?: string|NgxGridClass|string[]|null;
  @Input('max.2xl.class') _2xlClass?: string|NgxGridClass|string[]|null;
  @Input('max.3xl.class') _3xlClass?: string|NgxGridClass|string[]|null;
  @Input('max.4xl.class') _4xlClass?: string|NgxGridClass|string[]|null;
  @Input('max.mobile.class') _mobileClass?: string|NgxGridClass|string[]|null;
  @Input('max.tablet.class') _tabletClass?: string|NgxGridClass|string[]|null;
  @Input('max.desktop.class') _desktopClass?: string|NgxGridClass|string[]|null;

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
    buildClassBreakpoint(this, 'max', 'xs', this._xsClass);
    buildClassBreakpoint(this, 'max', 'sm', this._smClass);
    buildClassBreakpoint(this, 'max', 'md', this._mdClass);
    buildClassBreakpoint(this, 'max', 'lg', this._lgClass);
    buildClassBreakpoint(this, 'max', 'xl', this._xlClass);
    buildClassBreakpoint(this, 'max', '2xl', this._2xlClass);
    buildClassBreakpoint(this, 'max', '3xl', this._3xlClass);
    buildClassBreakpoint(this, 'max', '4xl', this._4xlClass);
    buildClassBreakpoint(this, 'max', 'mobile', this._mobileClass);
    buildClassBreakpoint(this, 'max', 'tablet', this._tabletClass);
    buildClassBreakpoint(this, 'max', 'desktop', this._desktopClass);
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
