import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  InputSignal,
  InputSignalWithTransform,
  OnChanges,
  Renderer2,
  RendererStyleFlags2,
  Signal
} from '@angular/core';
import {
  IGridAutoRows,
  IGridBreakpoint,
  IGridBreakpointName,
  IGridColumnSizeEven,
  IGridOptions
} from "../../grid.interface";
import {GridService} from "../../services/grid.service";
import {debounceTime} from "rxjs";
import {GridRef} from "../../services/grid-ref.service";
import {CommonModule} from "@angular/common";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

interface IGridCenteredSizeInputs {
  'default': IGridColumnSizeEven|null;
  'xs': IGridColumnSizeEven|null;
  'sm': IGridColumnSizeEven|null;
  'md': IGridColumnSizeEven|null;
  'lg': IGridColumnSizeEven|null;
  'xl': IGridColumnSizeEven|null;
  '2xl': IGridColumnSizeEven|null;
  '3xl': IGridColumnSizeEven|null;
  '4xl': IGridColumnSizeEven|null;
  'mobile': IGridColumnSizeEven|null;
  'tablet': IGridColumnSizeEven|null;
  'desktop': IGridColumnSizeEven|null;
}

@Component({
  selector: 'ngx-grid-centered',
  templateUrl: './grid-centered.component.html',
  styleUrls: ['./grid-centered.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule],
  providers: [GridRef],
  host: {
    '[class.ngx-grid-centered]': 'true',
  }
})
export class GridCentered implements OnChanges {
  readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);
  readonly renderer: Renderer2 = inject(Renderer2);
  readonly gridService: GridService = inject(GridService);
  readonly ownGridRef: GridRef = inject(GridRef, {
    self: true,
  });

  baseBreakpoint: InputSignal<IGridBreakpointName|undefined> = input<IGridBreakpointName|undefined>();
  baseSize: InputSignal<IGridColumnSizeEven|undefined> = input<IGridColumnSizeEven|undefined>();
  autoRows: InputSignal<IGridAutoRows|undefined> = input<IGridAutoRows|undefined>();

  options: InputSignalWithTransform<IGridOptions, Partial<IGridOptions>|undefined> = input<IGridOptions, Partial<IGridOptions>|undefined>(this.gridService.options, {
    transform: (partial) => this.gridService.buildOptions(partial, {
      baseBreakpoint: this.baseBreakpoint(),
      baseSize: this.baseSize(),
      autoRows: this.autoRows(),
    })
  });

  size_default: InputSignal<IGridColumnSizeEven|null> = input<IGridColumnSizeEven|null>(12, { alias: 'size' });
  size_xs: InputSignal<IGridColumnSizeEven|null> = input<IGridColumnSizeEven|null>(null, { alias: 'xs:size' });
  size_sm: InputSignal<IGridColumnSizeEven|null> = input<IGridColumnSizeEven|null>(null, { alias: 'sm:size' });
  size_md: InputSignal<IGridColumnSizeEven|null> = input<IGridColumnSizeEven|null>(null, { alias: 'md:size' });
  size_lg: InputSignal<IGridColumnSizeEven|null> = input<IGridColumnSizeEven|null>(null, { alias: 'lg:size' });
  size_xl: InputSignal<IGridColumnSizeEven|null> = input<IGridColumnSizeEven|null>(null, { alias: 'xl:size' });
  size_2xl: InputSignal<IGridColumnSizeEven|null> = input<IGridColumnSizeEven|null>(null, { alias: '2xl:size' });
  size_3xl: InputSignal<IGridColumnSizeEven|null> = input<IGridColumnSizeEven|null>(null, { alias: '3xl:size' });
  size_4xl: InputSignal<IGridColumnSizeEven|null> = input<IGridColumnSizeEven|null>(null, { alias: '4xl:size' });
  size_mobile: InputSignal<IGridColumnSizeEven|null> = input<IGridColumnSizeEven|null>(null, { alias: 'mobile:size' });
  size_tablet: InputSignal<IGridColumnSizeEven|null> = input<IGridColumnSizeEven|null>(null, { alias: 'tablet:size' });
  size_desktop: InputSignal<IGridColumnSizeEven|null> = input<IGridColumnSizeEven|null>(null, { alias: 'desktop:size' });

  sizes: Signal<IGridCenteredSizeInputs> = computed(() => ({
    'default': this.size_default(),
    'xs': this.size_xs(),
    'sm': this.size_sm(),
    'md': this.size_md(),
    'lg': this.size_lg(),
    'xl': this.size_xl(),
    '2xl': this.size_2xl(),
    '3xl': this.size_3xl(),
    '4xl': this.size_4xl(),
    'mobile': this.size_mobile(),
    'tablet': this.size_tablet(),
    'desktop': this.size_desktop(),
  }));

  constructor(){
    this.ownGridRef.changes.pipe(takeUntilDestroyed(), debounceTime(0)).subscribe({ next: () => this.build() });
    this.gridService.onWindowResize().pipe(takeUntilDestroyed()).subscribe({ next: () => this.ownGridRef.emitChange() });
  }

  ngOnChanges() {
    this.ownGridRef.updateOptions(this.options());
    this.ownGridRef.emitChange();
  }

  private build(){
    const baseSize = this.ownGridRef.options().baseSize as number;
    const breakpointSize = this.ownGridRef.getNearestBreakpoint(this as any, null, this.createBreakpoints())?.size || null;
    if(breakpointSize && breakpointSize < baseSize){
      const size = (((baseSize - breakpointSize) / baseSize) * 100) / 2;
      this.renderer.setStyle(this.elementRef.nativeElement, 'padding-left', `${size}%`, RendererStyleFlags2.Important);
      this.renderer.setStyle(this.elementRef.nativeElement, 'padding-right', `${size}%`, RendererStyleFlags2.Important);
    }else{
      this.renderer.setStyle(this.elementRef.nativeElement, 'padding-left', '0', RendererStyleFlags2.Important);
      this.renderer.setStyle(this.elementRef.nativeElement, 'padding-right', '0', RendererStyleFlags2.Important);
    }
    this.elementRef.nativeElement.classList.add('ngx-grid-built');
  }

  private createBreakpoints(): IGridBreakpoint[] {
    const sizes = this.sizes();
    return Object.entries(sizes).map(([name, size]) => {
      return this.ownGridRef.createBreakpoint(
        name as IGridBreakpointName,
        size ?? (name === this.options().baseBreakpoint ? sizes['default'] : null),
      );
    });
  }

}
