import {computed, Directive, ElementRef, inject, input, InputSignal, Signal} from "@angular/core";
import {GridRef} from "../../../services/grid-ref.service";
import {IGridColumnSize} from "../../../grid.interface";
import {GridService} from "../../../services/grid.service";

interface IGridColumnBreakpointInputs {
  'default': IGridColumnBreakpointInput;
  'xs': IGridColumnBreakpointInput;
  'sm': IGridColumnBreakpointInput;
  'md': IGridColumnBreakpointInput;
  'lg': IGridColumnBreakpointInput;
  'xl': IGridColumnBreakpointInput;
  '2xl': IGridColumnBreakpointInput;
  '3xl': IGridColumnBreakpointInput;
  '4xl': IGridColumnBreakpointInput;
  'mobile': IGridColumnBreakpointInput;
  'tablet': IGridColumnBreakpointInput;
  'desktop': IGridColumnBreakpointInput;
}

interface IGridColumnBreakpointInput {
  size: IGridColumnSize|null;
  offset: IGridColumnSize|null;
  order: number|null;
}

@Directive()
export abstract class GridColumnBase {
  readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);
  readonly gridService: GridService = inject(GridService);
  readonly parentGridRef = inject(GridRef, {
    skipSelf: true,
  });

  /** Breakpoint configuration */
  size: InputSignal<IGridColumnSize|null> = input<IGridColumnSize|null>(null, { alias: 'size' });
  offset: InputSignal<IGridColumnSize|null> = input<IGridColumnSize|null>(null, { alias: 'offset' });
  order: InputSignal<IGridColumnSize|null> = input<IGridColumnSize|null>(null, { alias: 'order' });
  size_xs: InputSignal<IGridColumnSize|null> = input<IGridColumnSize|null>(null, { alias: 'xs:size' });
  offset_xs: InputSignal<IGridColumnSize|null> = input<IGridColumnSize|null>(null, { alias: 'xs:offset' });
  order_xs: InputSignal<IGridColumnSize|null> = input<IGridColumnSize|null>(null, { alias: 'xs:order' });
  size_sm: InputSignal<IGridColumnSize|null> = input<IGridColumnSize|null>(null, { alias: 'sm:size' });
  offset_sm: InputSignal<IGridColumnSize|null> = input<IGridColumnSize|null>(null, { alias: 'sm:offset' });
  order_sm: InputSignal<IGridColumnSize|null> = input<IGridColumnSize|null>(null, { alias: 'sm:order' });
  size_md: InputSignal<IGridColumnSize|null> = input<IGridColumnSize|null>(null, { alias: 'md:size' });
  offset_md: InputSignal<IGridColumnSize|null> = input<IGridColumnSize|null>(null, { alias: 'md:offset' });
  order_md: InputSignal<IGridColumnSize|null> = input<IGridColumnSize|null>(null, { alias: 'md:order' });
  size_lg: InputSignal<IGridColumnSize|null> = input<IGridColumnSize|null>(null, { alias: 'lg:size' });
  offset_lg: InputSignal<IGridColumnSize|null> = input<IGridColumnSize|null>(null, { alias: 'lg:offset' });
  order_lg: InputSignal<IGridColumnSize|null> = input<IGridColumnSize|null>(null, { alias: 'lg:order' });
  size_xl: InputSignal<IGridColumnSize|null> = input<IGridColumnSize|null>(null, { alias: 'xl:size' });
  offset_xl: InputSignal<IGridColumnSize|null> = input<IGridColumnSize|null>(null, { alias: 'xl:offset' });
  order_xl: InputSignal<IGridColumnSize|null> = input<IGridColumnSize|null>(null, { alias: 'xl:order' });
  size_2xl: InputSignal<IGridColumnSize|null> = input<IGridColumnSize|null>(null, { alias: '2xl:size' });
  offset_2xl: InputSignal<IGridColumnSize|null> = input<IGridColumnSize|null>(null, { alias: '2xl:offset' });
  order_2xl: InputSignal<IGridColumnSize|null> = input<IGridColumnSize|null>(null, { alias: '2xl:order' });
  size_3xl: InputSignal<IGridColumnSize|null> = input<IGridColumnSize|null>(null, { alias: '3xl:size' });
  offset_3xl: InputSignal<IGridColumnSize|null> = input<IGridColumnSize|null>(null, { alias: '3xl:offset' });
  order_3xl: InputSignal<IGridColumnSize|null> = input<IGridColumnSize|null>(null, { alias: '3xl:order' });
  size_4xl: InputSignal<IGridColumnSize|null> = input<IGridColumnSize|null>(null, { alias: '4xl:size' });
  offset_4xl: InputSignal<IGridColumnSize|null> = input<IGridColumnSize|null>(null, { alias: '4xl:offset' });
  order_4xl: InputSignal<IGridColumnSize|null> = input<IGridColumnSize|null>(null, { alias: '4xl:order' });
  size_mobile: InputSignal<IGridColumnSize|null> = input<IGridColumnSize|null>(null, { alias: 'mobile:size' });
  offset_mobile: InputSignal<IGridColumnSize|null> = input<IGridColumnSize|null>(null, { alias: 'mobile:offset' });
  order_mobile: InputSignal<IGridColumnSize|null> = input<IGridColumnSize|null>(null, { alias: 'mobile:order' });
  size_tablet: InputSignal<IGridColumnSize|null> = input<IGridColumnSize|null>(null, { alias: 'tablet:size' });
  offset_tablet: InputSignal<IGridColumnSize|null> = input<IGridColumnSize|null>(null, { alias: 'tablet:offset' });
  order_tablet: InputSignal<IGridColumnSize|null> = input<IGridColumnSize|null>(null, { alias: 'tablet:order' });
  size_desktop: InputSignal<IGridColumnSize|null> = input<IGridColumnSize|null>(null, { alias: 'desktop:size' });
  offset_desktop: InputSignal<IGridColumnSize|null> = input<IGridColumnSize|null>(null, { alias: 'desktop:offset' });
  order_desktop: InputSignal<IGridColumnSize|null> = input<IGridColumnSize|null>(null, { alias: 'desktop:order' });

  /** Computed signal to return breakpoint sizes */
  readonly breakpoints: Signal<IGridColumnBreakpointInputs> = computed(() => ({
    'default': {
      size: this.size(),
      offset: this.offset(),
      order: this.order(),
    },
    'xs': {
      size: this.size_xs(),
      offset: this.offset_xs(),
      order: this.order_xs(),
    },
    'sm': {
      size: this.size_sm(),
      offset: this.offset_sm(),
      order: this.order_sm(),
    },
    'md': {
      size: this.size_md(),
      offset: this.offset_md(),
      order: this.order_md(),
    },
    'lg': {
      size: this.size_lg(),
      offset: this.offset_lg(),
      order: this.order_lg(),
    },
    'xl': {
      size: this.size_xl(),
      offset: this.offset_xl(),
      order: this.order_xl(),
    },
    '2xl': {
      size: this.size_2xl(),
      offset: this.offset_2xl(),
      order: this.order_2xl(),
    },
    '3xl': {
      size: this.size_3xl(),
      offset: this.offset_3xl(),
      order: this.order_3xl(),
    },
    '4xl': {
      size: this.size_4xl(),
      offset: this.offset_4xl(),
      order: this.order_4xl(),
    },
    'mobile': {
      size: this.size_mobile(),
      offset: this.offset_mobile(),
      order: this.order_mobile(),
    },
    'tablet': {
      size: this.size_tablet(),
      offset: this.offset_tablet(),
      order: this.order_tablet(),
    },
    'desktop': {
      size: this.size_desktop(),
      offset: this.offset_desktop(),
      order: this.order_desktop(),
    },
  }));

}
