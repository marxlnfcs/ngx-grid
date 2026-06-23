import {Directive, inject, Injector, input, InputSignal, OnChanges, TemplateRef, ViewContainerRef} from "@angular/core";
import {GridRef} from "../../services/grid-ref.service";

@Directive({
  selector: '[ngxGridTemplateOutlet]',
  standalone: true,
})
export class GridTemplateOutlet<TContext = unknown> implements OnChanges {
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly injector = inject(Injector);
  private readonly gridRef = inject(GridRef);

  readonly ngxGridTemplateOutlet: InputSignal<TemplateRef<TContext>|null> = input<TemplateRef<TContext>|null>(null);
  readonly ngxGridTemplateOutletContext: InputSignal<TContext|null> = input<TContext|null>(null);

  ngOnChanges(): void  {
    // clear current view
    this.viewContainerRef.clear();

    // get and validate template outlet
    const template = this.ngxGridTemplateOutlet();
    if(!template){
      return;
    }

    // create injector
    const viewInjector = Injector.create({
      parent: this.injector,
      providers: [
        { provide: GridRef, useValue: this.gridRef }
      ]
    });

    // create view
    this.viewContainerRef.createEmbeddedView(template, this.ngxGridTemplateOutletContext() ?? ({} as TContext), {
      injector: viewInjector
    });
  }
}
