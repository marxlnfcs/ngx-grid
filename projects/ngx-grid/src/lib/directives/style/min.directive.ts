import {computed, Directive, ElementRef, inject, input, OnChanges, OnDestroy, Renderer2, Signal} from "@angular/core";
import {IGridBreakpointName, IGridStyle} from "../../grid.interface";
import {BehaviorSubject, debounceTime} from "rxjs";
import {GridService} from "../../services/grid.service";
import {buildStyleBreakpoint, IGridStyleInput, IGridStyleInputs} from "./_helpers";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Directive({
  selector: '[min.xs.style], [min.sm.style], [min.md.style], [min.lg.style], [min.xl.style], [min.2xl.style], [min.3xl.style], [min.4xl.style], [min.mobile.style], [min.tablet.style], [min.desktop.style]',
  standalone: true,
})
export class GridStyleMin implements OnChanges, OnDestroy {
  readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);
  readonly renderer: Renderer2 = inject(Renderer2);
  readonly gridService: GridService = inject(GridService);

  private readonly changes$: BehaviorSubject<void> = new BehaviorSubject<any>(null);

  style_xs = input<IGridStyleInput>(null, { alias: 'xs.style' });
  style_sm = input<IGridStyleInput>(null, { alias: 'sm.style' });
  style_md = input<IGridStyleInput>(null, { alias: 'md.style' });
  style_lg = input<IGridStyleInput>(null, { alias: 'lg.style' });
  style_xl = input<IGridStyleInput>(null, { alias: 'xl.style' });
  style_2xl = input<IGridStyleInput>(null, { alias: '2xl.style' });
  style_3xl = input<IGridStyleInput>(null, { alias: '3xl.style' });
  style_4xl = input<IGridStyleInput>(null, { alias: '4xl.style' });
  style_mobile = input<IGridStyleInput>(null, { alias: 'mobile.style' });
  style_tablet = input<IGridStyleInput>(null, { alias: 'tablet.style' });
  style_desktop = input<IGridStyleInput>(null, { alias: 'desktop.style' });

  styles: Signal<IGridStyleInputs> = computed(() => ({
    'xs': this.style_xs(),
    'sm': this.style_sm(),
    'md': this.style_md(),
    'lg': this.style_lg(),
    'xl': this.style_xl(),
    '2xl': this.style_2xl(),
    '3xl': this.style_3xl(),
    '4xl': this.style_4xl(),
    'mobile': this.style_mobile(),
    'tablet': this.style_tablet(),
    'desktop': this.style_desktop(),
  }));

  computedStyles: Partial<Record<IGridBreakpointName, IGridStyle>> = {};

  constructor(){
    this.changes$.pipe(takeUntilDestroyed(), debounceTime(0)).subscribe(() => this.build());
    this.gridService.onWindowResize().pipe(takeUntilDestroyed()).subscribe(() => this.changes$.next());
  }

  private build(){
    Object.entries(this.styles()).map(([breakpoint, style]) => buildStyleBreakpoint(this, breakpoint as IGridBreakpointName, style));
  }

  ngOnChanges() {
    this.changes$.next();
  }

  ngOnDestroy() {
    this.changes$.complete();
  }
}
