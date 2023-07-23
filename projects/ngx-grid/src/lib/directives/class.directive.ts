import {AfterViewInit, Directive, ElementRef, Input, OnDestroy, Renderer2} from "@angular/core";
import {NgxGridBreakpointName, NgxGridClass} from "../interfaces/grid.interface";
import {BehaviorSubject, debounceTime, Subject, takeUntil} from "rxjs";
import {NgxGridService} from "../services/grid.service";

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
  @Input('mobile.class') _mobileClass?: string|NgxGridClass|string[]|null;
  @Input('tablet.class') _tabletClass?: string|NgxGridClass|string[]|null;
  @Input('desktop.class') _desktopClass?: string|NgxGridClass|string[]|null;

  changes$: BehaviorSubject<void> = new BehaviorSubject<any>(null);
  destroy$: Subject<void> = new Subject<void>();

  classes: { [breakpoint: string]: NgxGridClass } = {};

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
    this.buildBreakpoint('xs', this._xsClass);
    this.buildBreakpoint('sm', this._smClass);
    this.buildBreakpoint('md', this._mdClass);
    this.buildBreakpoint('lg', this._lgClass);
    this.buildBreakpoint('xl', this._xlClass);
    this.buildBreakpoint('2xl', this._2xlClass);
    this.buildBreakpoint('3xl', this._3xlClass);
    this.buildBreakpoint('4xl', this._4xlClass);
    this.buildBreakpoint('mobile', this._mobileClass);
    this.buildBreakpoint('tablet', this._tabletClass);
    this.buildBreakpoint('desktop', this._desktopClass);
  }

  private buildBreakpoint(breakpoint: NgxGridBreakpointName, klass: any): void {

    // remove current classes
    Object.keys(this.classes[breakpoint] || {}).map(key => {
      this.renderer2.removeClass(this.elementRef.nativeElement, key);
    });

    // set new classes
    this.classes[breakpoint] = this.parseClasses(klass);

    // apply classes
    Object.keys(this.classes[breakpoint]).map(key => {
      if(this.classes[breakpoint][key] && this.gridService.isBreakpointMax(breakpoint)){
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

  ngOnDestroy() {
    this.changes$.complete();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
