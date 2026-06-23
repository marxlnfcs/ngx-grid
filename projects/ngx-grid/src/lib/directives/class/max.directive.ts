import {computed, Directive, ElementRef, inject, input, OnChanges, OnDestroy, Renderer2, Signal} from "@angular/core";
import {IGridBreakpointName, IGridClass} from "../../grid.interface";
import {BehaviorSubject, debounceTime} from "rxjs";
import {GridService} from "../../services/grid.service";
import {buildClassBreakpoint, IGridClassInput, IGridClassInputs} from "./_helpers";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Directive({
  selector: '[max.xs.class], [max.sm.class], [max.md.class], [max.lg.class], [max.xl.class], [max.2xl.class], [max.3xl.class], [max.4xl.class], [max.mobile.class], [max.tablet.class], [max.desktop.class]',
  standalone: true,
})
export class GridClassMax implements OnChanges, OnDestroy {
  readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);
  readonly renderer: Renderer2 = inject(Renderer2);
  readonly gridService: GridService = inject(GridService);

  private readonly changes$: BehaviorSubject<void> = new BehaviorSubject<any>(null);

  class_xs = input<IGridClassInput>(null, { alias: 'xs.class' });
  class_sm = input<IGridClassInput>(null, { alias: 'sm.class' });
  class_md = input<IGridClassInput>(null, { alias: 'md.class' });
  class_lg = input<IGridClassInput>(null, { alias: 'lg.class' });
  class_xl = input<IGridClassInput>(null, { alias: 'xl.class' });
  class_2xl = input<IGridClassInput>(null, { alias: '2xl.class' });
  class_3xl = input<IGridClassInput>(null, { alias: '3xl.class' });
  class_4xl = input<IGridClassInput>(null, { alias: '4xl.class' });
  class_mobile = input<IGridClassInput>(null, { alias: 'mobile.class' });
  class_tablet = input<IGridClassInput>(null, { alias: 'tablet.class' });
  class_desktop = input<IGridClassInput>(null, { alias: 'desktop.class' });

  classes: Signal<IGridClassInputs> = computed(() => ({
    'xs': this.class_xs(),
    'sm': this.class_sm(),
    'md': this.class_md(),
    'lg': this.class_lg(),
    'xl': this.class_xl(),
    '2xl': this.class_2xl(),
    '3xl': this.class_3xl(),
    '4xl': this.class_4xl(),
    'mobile': this.class_mobile(),
    'tablet': this.class_tablet(),
    'desktop': this.class_desktop(),
  }));

  computedClasses: Partial<Record<IGridBreakpointName, IGridClass>> = {};

  constructor(){
    this.changes$.pipe(takeUntilDestroyed(), debounceTime(0)).subscribe(() => this.build());
    this.gridService.onWindowResize().pipe(takeUntilDestroyed()).subscribe(() => this.changes$.next());
  }

  private build(){
    Object.entries(this.classes()).map(([breakpoint, klass]) => buildClassBreakpoint(this, breakpoint as IGridBreakpointName, klass));
  }

  ngOnChanges(){
    this.changes$.next();
  }

  ngOnDestroy() {
    this.changes$.complete();
  }
}
