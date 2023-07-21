import {AfterViewInit, Directive, ElementRef, Inject, Input, OnDestroy, Optional, Renderer2} from "@angular/core";
import {NgxGridBreakpointName, NgxGridBreakpoints, NgxGridClass, NgxGridOptions} from "../interfaces/grid.interface";
import {BehaviorSubject, debounceTime, Subscription} from "rxjs";
import {GRID_OPTIONS, GRID_OPTIONS_DEFAULTS} from "../grid.constants";
import {createEvent} from "../utils/event.utils";
import {sizeToPixel} from "../utils/common.utils";

@Directive({
  selector: '[xs.class], [sm.class], [md.class], [lg.class], [xl.class], [2xl.class], [3xl.class], [4xl.class]',
})
export class NgxGridClassDirective implements AfterViewInit, OnDestroy {
  @Input('xs.class') _xsClass?: string|NgxGridClass|string[]|null;
  @Input('sm.class') _smClass?: string|NgxGridClass|string[]|null;
  @Input('md.class') _mdClass?: string|NgxGridClass|string[]|null;
  @Input('lg.class') _lgClass?: string|NgxGridClass|string[]|null;
  @Input('xl.class') _xlClass?: string|NgxGridClass|string[]|null;
  @Input('2xl.class') _2xlClass?: string|NgxGridClass|string[]|null;
  @Input('3xl.class') _3xlClass?: string|NgxGridClass|string[]|null;
  @Input('4xl.class') _4xlClass?: string|NgxGridClass|string[]|null;

  changes$: BehaviorSubject<null> = new BehaviorSubject<null>(null);
  subscriptions: Subscription[] = [];
  classes: { [breakpoint: string]: NgxGridClass } = {};

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
    this.buildBreakpoint('xs', this._xsClass);
    this.buildBreakpoint('sm', this._smClass);
    this.buildBreakpoint('md', this._mdClass);
    this.buildBreakpoint('lg', this._lgClass);
    this.buildBreakpoint('xl', this._xlClass);
    this.buildBreakpoint('2xl', this._2xlClass);
    this.buildBreakpoint('3xl', this._3xlClass);
    this.buildBreakpoint('4xl', this._4xlClass);
  }

  private buildBreakpoint(breakpoint: NgxGridBreakpointName, klass: any): void {

    // get sizes
    const [ containerWidth, breakpointWidth ] = [ window.innerWidth, sizeToPixel(this.getBreakpoints()[breakpoint]) ];

    // remove current classes
    Object.keys(this.classes[breakpoint] || {}).map(key => {
      this.renderer2.removeClass(this.elementRef.nativeElement, key);
    });

    // set new classes
    this.classes[breakpoint] = this.parseClasses(klass);

    // apply classes
    Object.keys(this.classes[breakpoint]).map(key => {
      if(this.classes[breakpoint][key] && breakpointWidth < containerWidth){
        this.renderer2.addClass(this.elementRef.nativeElement, key);
      }
    })

  }

  private parseClasses(klass: any): NgxGridClass {
    const classes: NgxGridClass = {};
    if(klass){
      switch(true){
        case typeof klass === 'string': {
          klass.split(' ').map((c: string) => classes[c.trim()] = true);
          break;
        }
        case Array.isArray(klass): {
          klass.map((c: string) => classes[c.trim()] = true);
          break;
        }
        case typeof klass === 'object': {
          Object.entries(klass).map(([key, value]) => classes[key.trim()] = !!value);
          break;
        }
      }
    }
    return classes;
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
