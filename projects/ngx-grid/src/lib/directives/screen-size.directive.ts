import {AfterViewInit, Directive, Input, OnDestroy, TemplateRef, ViewContainerRef} from "@angular/core";
import {NgxGridBreakpointName} from "../interfaces/grid.interface";
import {BehaviorSubject, debounceTime, Subject, takeUntil} from "rxjs";
import {NgxGridService} from "../services/grid.service";

@Directive({
  selector: '[ngxScreenSize], [ngxScreenSizeMin], [ngxScreenSizeMax]',
})
export class NgxGridScreenSizeDirective implements AfterViewInit, OnDestroy {
  @Input() ngxScreenSize?: NgxGridBreakpointName|null;
  @Input() ngxScreenSizeMin?: NgxGridBreakpointName|null;
  @Input() ngxScreenSizeMax?: NgxGridBreakpointName|null;

  changes$: BehaviorSubject<void> = new BehaviorSubject<any>(null);
  destroy$: Subject<void> = new Subject();

  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private gridService: NgxGridService,
  ){}

  ngAfterViewInit(){
    this.gridService.onWindowResize().pipe(takeUntil(this.destroy$)).subscribe(() => this.changes$.next());
    this.changes$.pipe(takeUntil(this.destroy$), debounceTime(0)).subscribe(() => this.build());
  }

  private build(){

    // clear view
    this.viewContainerRef.clear();

    // get breakpoint
    const breakpoint = this.screenSizeMin || this.screenSizeMax || this.gridService.getOptions().baseBreakpoint;

    // create view if condition is true
    if(this.screenSize && this.gridService.isBreakpointMin(breakpoint) && this.gridService.isBreakpointMax(breakpoint)){
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }else if(this.screenSizeMin && this.gridService.isBreakpointMin(breakpoint)){
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }else if(this.screenSizeMax && this.gridService.isBreakpointMax(breakpoint)){
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }

  }

  private get screenSize(): NgxGridBreakpointName|null {
    return this.ngxScreenSize || null;
  }

  private get screenSizeMin(): NgxGridBreakpointName|null {
    return this.ngxScreenSizeMin || null;
  }

  private get screenSizeMax(): NgxGridBreakpointName|null {
    return this.ngxScreenSizeMin || this.ngxScreenSizeMax || null;
  }

  ngOnDestroy() {
    this.changes$.complete();
    this.destroy$.next();
    this.destroy$.complete();
  }

}
