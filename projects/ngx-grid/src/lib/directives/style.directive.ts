import {
  AfterViewInit,
  Directive,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
  Optional,
  Renderer2,
  RendererStyleFlags2
} from "@angular/core";
import {NgxGridBreakpointName, NgxGridBreakpoints, NgxGridOptions, NgxGridStyle} from "../interfaces/grid.interface";
import {BehaviorSubject, debounceTime, Subscription} from "rxjs";
import {GRID_OPTIONS, GRID_OPTIONS_DEFAULTS} from "../grid.constants";
import {createEvent} from "../utils/event.utils";
import {sizeToPixel} from "../utils/common.utils";

@Directive({
  selector: '[xs.style], [sm.style], [md.style], [lg.style], [xl.style], [2xl.style], [3xl.style], [4xl.style]',
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

  changes$: BehaviorSubject<null> = new BehaviorSubject<null>(null);
  subscriptions: Subscription[] = [];
  styles: { [breakpoint: string]: NgxGridStyle } = {};

  constructor(
    @Optional() @Inject(GRID_OPTIONS) private gridOptions: NgxGridOptions,
    private elementRef: ElementRef<HTMLElement>,
    private renderer2: Renderer2,
  ){}

  ngAfterViewInit(){
    this.subscriptions.push(createEvent(window, 'resize', this.constructor.name).subscribe(() => this.changes$.next(null)));
    this.subscriptions.push(this.changes$.pipe(debounceTime(0)).subscribe(() => this.build()));
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
  }

  private buildBreakpoint(breakpoint: NgxGridBreakpointName, klass: any): void {

    // get sizes
    const [ containerWidth, breakpointWidth ] = [ window.innerWidth, sizeToPixel(this.getBreakpoints()[breakpoint]) ];

    // remove current classes
    Object.keys(this.styles[breakpoint] || {}).map(key => {
      this.renderer2.removeStyle(this.elementRef.nativeElement, key);
    });

    // set new classes
    this.styles[breakpoint] = this.parseStyles(klass);

    // apply classes
    Object.keys(this.styles[breakpoint]).map(key => {
      if(this.styles[breakpoint][key] && breakpointWidth < containerWidth){
        const value = this.styles[breakpoint][key]?.replace('!important', '');
        console.log(key, value);
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

  private getBreakpoints(): NgxGridBreakpoints {
    return {
      xs: this.gridOptions?.breakpoints?.xs ?? GRID_OPTIONS_DEFAULTS.breakpoints.xs,
      sm: this.gridOptions?.breakpoints?.sm ?? GRID_OPTIONS_DEFAULTS.breakpoints.sm,
      md: this.gridOptions?.breakpoints?.md ?? GRID_OPTIONS_DEFAULTS.breakpoints.md,
      lg: this.gridOptions?.breakpoints?.lg ?? GRID_OPTIONS_DEFAULTS.breakpoints.lg,
      xl: this.gridOptions?.breakpoints?.xl ?? GRID_OPTIONS_DEFAULTS.breakpoints.xl,
      '2xl': this.gridOptions?.breakpoints?.['2xl'] ?? GRID_OPTIONS_DEFAULTS.breakpoints['2xl'],
      '3xl': this.gridOptions?.breakpoints?.['3xl'] ?? GRID_OPTIONS_DEFAULTS.breakpoints['3xl'],
      '4xl': this.gridOptions?.breakpoints?.['4xl'] ?? GRID_OPTIONS_DEFAULTS.breakpoints['4xl'],
    }
  }

  ngOnDestroy() {
    this.changes$.complete();
    this.subscriptions.map(s => s.unsubscribe());
    this.subscriptions = [];
  }
}
