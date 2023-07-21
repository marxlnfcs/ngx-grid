import {
  AfterViewInit,
  Directive,
  Inject,
  Input,
  OnDestroy,
  Optional,
  TemplateRef,
  ViewContainerRef
} from "@angular/core";
import {NgxGridBreakpointName, NgxGridBreakpoints, NgxGridOptions} from "../interfaces/grid.interface";
import {GRID_OPTIONS, GRID_OPTIONS_DEFAULTS} from "../grid.constants";
import {sizeToPixel} from "../utils/common.utils";
import {BehaviorSubject, debounceTime, Subscription} from "rxjs";
import {createEvent} from "../utils/event.utils";

@Directive({
  selector: '[ngxScreenSize]',
})
export class NgxGridScreenSizeDirective implements AfterViewInit, OnDestroy {
  @Input() ngxScreenSize?: NgxGridBreakpointName|null;

  changes$: BehaviorSubject<null> = new BehaviorSubject<null>(null);
  subscriptions: Subscription[] = [];

  constructor(
    @Optional() @Inject(GRID_OPTIONS) private gridOptions: NgxGridOptions,
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
  ){}

  ngAfterViewInit(){
    this.subscriptions.push(createEvent(window, 'resize', this.constructor.name).subscribe(() => this.changes$.next(null)));
    this.subscriptions.push(this.changes$.pipe(debounceTime(0)).subscribe(() => this.build()));
  }

  private build(){

    // clear view
    this.viewContainerRef.clear();

    // get nearest breakpoint
    const breakpoint = this.getBreakpoints()[this.ngxScreenSize || this.gridOptions?.baseBreakpoint || GRID_OPTIONS_DEFAULTS.baseBreakpoint];

    // get sizes
    const [ containerWidth, breakpointWidth ] = [ window.innerWidth, sizeToPixel(breakpoint) ];

    // clear view if breakpointWidth > containerWidth
    if(breakpointWidth < containerWidth){
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }

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
