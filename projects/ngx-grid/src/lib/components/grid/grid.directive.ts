import {
  AfterContentInit,
  ContentChildren,
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  QueryList
} from "@angular/core";
import {NgxGridColumnSize, NgxGridGapSize, NgxGridStrategy} from "../../interfaces/grid.interface";
import {NgxGridColumn, NgxGridGroup, NgxGridItemTemplate} from "../../interfaces/grid-item.interface";
import {Subject, takeUntil} from "rxjs";
import {NgxGridRef} from "../../services/grid-ref.service";

export type NgxGridItemType = NgxGridColumnDirective|NgxGridGroupDirective;

@Directive()
export class NgxGridItemDirective implements NgxGridItemTemplate, OnDestroy, OnChanges {
  readonly type: 'column'|'group' = 'column';
  protected destroy$: Subject<void> = new Subject<void>();

  @Input('size') _size?: NgxGridColumnSize|null;
  @Input('offset') _offset?: NgxGridColumnSize|null;
  @Input('order') _order?: number|null;

  @Input('xs:size') _xs?: NgxGridColumnSize|null;
  @Input('xs:offset') _xsOffset?: NgxGridColumnSize|null;
  @Input('xs:order') _xsOrder?: number|null;

  @Input('sm:size') _sm?: NgxGridColumnSize|null;
  @Input('sm:offset') _smOffset?: NgxGridColumnSize|null;
  @Input('sm:order') _smOrder?: number|null;

  @Input('md:size') _md?: NgxGridColumnSize|null;
  @Input('md:offset') _mdOffset?: NgxGridColumnSize|null;
  @Input('md:order') _mdOrder?: number|null;

  @Input('lg:size') _lg?: NgxGridColumnSize|null;
  @Input('lg:offset') _lgOffset?: NgxGridColumnSize|null;
  @Input('lg:order') _lgOrder?: number|null;

  @Input('xl:size') _xl?: NgxGridColumnSize|null;
  @Input('xl:offset') _xlOffset?: NgxGridColumnSize|null;
  @Input('xl:order') _xlOrder?: number|null;

  @Input('2xl:size') _2xl?: NgxGridColumnSize|null;
  @Input('2xl:offset') _2xlOffset?: NgxGridColumnSize|null;
  @Input('2xl:order') _2xlOrder?: number|null;

  @Input('3xl:size') _3xl?: NgxGridColumnSize|null;
  @Input('3xl:offset') _3xlOffset?: NgxGridColumnSize|null;
  @Input('3xl:order') _3xlOrder?: number|null;

  @Input('4xl:size') _4xl?: NgxGridColumnSize|null;
  @Input('4xl:offset') _4xlOffset?: NgxGridColumnSize|null;
  @Input('4xl:order') _4xlOrder?: number|null;

  @Input('mobile:size') _mobile?: NgxGridColumnSize|null;
  @Input('mobile:offset') _mobileOffset?: NgxGridColumnSize|null;
  @Input('mobile:order') _mobileOrder?: number|null;

  @Input('tablet:size') _tablet?: NgxGridColumnSize|null;
  @Input('tablet:offset') _tabletOffset?: NgxGridColumnSize|null;
  @Input('tablet:order') _tabletOrder?: number|null;

  @Input('desktop:size') _desktop?: NgxGridColumnSize|null;
  @Input('desktop:offset') _desktopOffset?: NgxGridColumnSize|null;
  @Input('desktop:order') _desktopOrder?: number|null;

  constructor(
    public readonly elementRef: ElementRef<HTMLElement>,
    protected readonly gridRef: NgxGridRef,
  ){}

  ngOnChanges() {
    this.gridRef.emitChange();
  }

  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete();
  }

}

@Directive({
  selector: 'ngx-grid-column',
  providers: [
    { provide: NgxGridItemDirective, useExisting: NgxGridColumnDirective }
  ],
})
export class NgxGridColumnDirective extends NgxGridItemDirective implements NgxGridColumn, OnChanges {
  override readonly type = 'column';
}

@Directive({
  selector: 'ngx-grid-group',
  providers: [
    { provide: NgxGridItemDirective, useExisting: NgxGridGroupDirective }
  ],
})
export class NgxGridGroupDirective extends NgxGridItemDirective implements NgxGridGroup, AfterContentInit {
  override readonly type = 'group';

  @ContentChildren(NgxGridItemDirective) private itemsRef!: QueryList<NgxGridItemType>;

  @Input() strategy?: NgxGridStrategy;
  @Input() gap?: NgxGridGapSize;
  @Input() columnGap?: NgxGridGapSize;
  @Input() rowGap?: NgxGridGapSize;
  @Input() rows?: string[]|null;
  @Input() autoRows?: boolean|null;

  get items(): NgxGridItemType[] {
    return this.itemsRef.toArray()
  }

  ngAfterContentInit() {
    this.itemsRef.changes.pipe(takeUntil(this.destroy$)).subscribe(() => this.gridRef.emitChange());
  }
}
