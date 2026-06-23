import {
  Directive,
  inject,
  input,
  InputSignal,
  OnChanges,
  OnDestroy,
  TemplateRef,
  ViewContainerRef
} from "@angular/core";
import {BehaviorSubject, debounceTime} from "rxjs";
import {IGridBreakpointName} from "../grid.interface";
import {GridService} from "../services/grid.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Directive({
  selector: '[ngxScreenSize], [ngxScreenSizeMin], [ngxScreenSizeMax]',
  standalone: true,
})
export class GridScreenSize implements OnChanges, OnDestroy {
  protected readonly viewContainerRef: ViewContainerRef = inject(ViewContainerRef);
  protected readonly templateRef: TemplateRef<any> = inject(TemplateRef);
  protected readonly gridService: GridService = inject(GridService);

  screenSize: InputSignal<IGridBreakpointName|null> = input<IGridBreakpointName|null>(null, { alias: 'ngxScreenSize' });
  screenSizeMin: InputSignal<IGridBreakpointName|null> = input<IGridBreakpointName|null>(null, { alias: 'ngxScreenSizeMin' });
  screenSizeMax: InputSignal<IGridBreakpointName|null> = input<IGridBreakpointName|null>(null, { alias: 'ngxScreenSizeMax' });

  private changes$: BehaviorSubject<void> = new BehaviorSubject<any>(null);

  constructor(){
    this.changes$.pipe(takeUntilDestroyed(), debounceTime(0)).subscribe(() => this.build());
    this.gridService.onWindowResize().pipe(takeUntilDestroyed()).subscribe(() => this.changes$.next());
  }

  private build(){
    this.viewContainerRef.clear();
    if(this.screenSize() && this.gridService.isBreakpointMin(this.screenSize()) && this.gridService.isBreakpointMax(this.screenSize())){
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }else if(this.screenSizeMin() && this.gridService.isBreakpointMin(this.screenSizeMin())){
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }else if(this.screenSizeMax() && this.gridService.isBreakpointMax(this.screenSizeMax())){
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
  }

  ngOnChanges() {
    this.changes$.next();
  }

  ngOnDestroy() {
    this.changes$.complete();
  }

}
