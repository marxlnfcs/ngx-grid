import {AfterViewInit, Directive, ElementRef, Input, OnDestroy, Renderer2, RendererStyleFlags2} from "@angular/core";
import {NgxGridBreakpointName, NgxGridClass, NgxGridStyle} from "../interfaces/grid.interface";
import {BehaviorSubject, debounceTime, Subject, takeUntil} from "rxjs";
import {NgxGridService} from "../services/grid.service";

@Directive({
  selector: '[xs.style], [sm.style], [md.style], [lg.style], [xl.style], [2xl.style], [3xl.style], [4xl.style], [mobile.style], [tablet.style], [desktop.style]',
})
export class NgxGridStyleDirective implements AfterViewInit, OnDestroy {
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
    private elementRef: ElementRef<HTMLElement>,
    private renderer2: Renderer2,
    private gridService: NgxGridService,
  ){}

  ngAfterViewInit(){
    this.gridService.onWindowResize().pipe(takeUntil(this.destroy$)).subscribe(() => this.changes$.next());
    this.changes$.pipe(takeUntil(this.destroy$), debounceTime(0)).subscribe(() => this.build());
  }

  private build(){
    this.buildBreakpoint('xs', this._xsStyle);
    this.buildBreakpoint('sm', this._smStyle);
    this.buildBreakpoint('md', this._mdStyle);
    this.buildBreakpoint('lg', this._lgStyle);
    this.buildBreakpoint('xl', this._xlStyle);
    this.buildBreakpoint('2xl', this._2xlStyle);
    this.buildBreakpoint('3xl', this._3xlStyle);
    this.buildBreakpoint('4xl', this._4xlStyle);
    this.buildBreakpoint('mobile', this._mobileClass);
    this.buildBreakpoint('tablet', this._tabletClass);
    this.buildBreakpoint('desktop', this._desktopClass);
  }

  private buildBreakpoint(breakpoint: NgxGridBreakpointName, klass: any): void {

    // remove current classes
    Object.keys(this.styles[breakpoint] || {}).map(key => {
      this.renderer2.removeStyle(this.elementRef.nativeElement, key);
    });

    // set new classes
    this.styles[breakpoint] = this.parseStyles(klass);

    // apply classes
    Object.keys(this.styles[breakpoint]).map(key => {
      if(this.styles[breakpoint][key] && this.gridService.isBreakpointMax(breakpoint)){
        const value = this.styles[breakpoint][key]?.replace('!important', '');
        this.renderer2.setStyle(this.elementRef.nativeElement, key, value, this.styles[breakpoint][key]?.indexOf('!important') !== -1 ? RendererStyleFlags2.Important : undefined);
      }
    })

  }

  private parseStyles(style: any): NgxGridStyle {
    const styles: NgxGridStyle = {};
    if(style){
      switch(true){
        case typeof style === 'string': {
          style.split(';').map((s: string) => {
            const [ key, value ] = s.split(':');
            if(key && value){
              styles[key.trim()] = value.trim();
            }
          });
          break;
        }
        case Array.isArray(style): {
          style.map((s: string) => {
            s.split(';').map((s: string) => Object.assign(styles, this.parseStyles(s)));
          });
          break;
        }
        case typeof style === 'object': {
          Object.entries(style).map(([key, value]) => style[key.trim()] = value);
          break;
        }
      }
    }
    return styles;
  }

  ngOnDestroy() {
    this.changes$.complete();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
