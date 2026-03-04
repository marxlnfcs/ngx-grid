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
  selector: '[xs.style], [sm.style], [md.style], [lg.style], [xl.style], [2xl.style], [3xl.style], [4xl.style], [mobile.style], [tablet.style], [desktop.style]',
})
export class NgxGridStyleDirective implements AfterViewInit, OnChanges, OnDestroy {
  @Input('xs.style') _xsStyle?: string|NgxGridStyle|string[]|null;
  @Input('sm.style') _smStyle?: string|NgxGridStyle|string[]|null;
  @Input('md.style') _mdStyle?: string|NgxGridStyle|string[]|null;
  @Input('lg.style') _lgStyle?: string|NgxGridStyle|string[]|null;
  @Input('xl.style') _xlStyle?: string|NgxGridStyle|string[]|null;
  @Input('2xl.style') _2xlStyle?: string|NgxGridStyle|string[]|null;
  @Input('3xl.style') _3xlStyle?: string|NgxGridStyle|string[]|null;
  @Input('4xl.style') _4xlStyle?: string|NgxGridStyle|string[]|null;
  @Input('mobile.style') _mobileClass?: string|NgxGridClass|string[]|null;
  @Input('tablet.style') _tabletClass?: string|NgxGridClass|string[]|null;
  @Input('desktop.style') _desktopClass?: string|NgxGridClass|string[]|null;

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
