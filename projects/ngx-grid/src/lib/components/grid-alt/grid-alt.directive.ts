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
import {NgxGridColumnSize, NgxGridStrategy} from "../../interfaces/grid.interface";
import {NgxGridAltRef} from "../../services/grid-alt-ref.service";
import {NgxGridAltColumn, NgxGridAltGroup, NgxGridAltItem} from "../../interfaces/grid-alt-item.interface";
import {Subscription} from "rxjs";

export type NgxGridAltItemType = NgxGridAltColumnDirective|NgxGridAltGroupDirective;

@Directive()
export class NgxGridAltItemDirective implements NgxGridAltItem, OnDestroy, OnChanges {
  readonly type: 'column'|'group' = 'column';
  protected subs: Subscription[] = [];

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

  constructor(
    protected readonly elementRef: ElementRef<HTMLElement>,
    protected readonly gridRef: NgxGridAltRef,
  ){}

  apply(ngClass: { [klass: string]: any }, ngStyle: { [klass: string]: any }, ngxStyleVariables: { [variable: string]: string|number|boolean|null|undefined; }) {

    // apply classes
    if(ngClass){
      Object.entries(ngClass).map(([key, value]) => {
        switch(!!value){
          case true: {
            this.elementRef.nativeElement.classList.add(key);
            break;
          }
          case false: {
            this.elementRef.nativeElement.classList.remove(key);
            break;
          }
        }
      });
    }

    // apply styles
    if(ngStyle){
      Object.entries(ngStyle).map(([key, value]) => {
        switch(!!value){
          case true: {
            this.elementRef.nativeElement.style.setProperty(key, value);
            break;
          }
          case false: {
            this.elementRef.nativeElement.style.removeProperty(key);
            break;
          }
        }
      });
    }

    // apply variables
    if(ngxStyleVariables){
      Object.entries(ngxStyleVariables).map(([key, value]) => {
        switch(!!value){
          case true: {
            this.elementRef.nativeElement.style.setProperty(key, value as string);
            break;
          }
          case false: {
            this.elementRef.nativeElement.style.removeProperty(key);
            break;
          }
        }
      });
    }

  }

  ngOnChanges() {
    this.gridRef.emitChange();
  }

  ngOnDestroy(){
    this.subs.map(s => s.unsubscribe());
    this.subs = [];
  }

}

@Directive({
  selector: 'ngx-grid-alt-column',
  providers: [
    { provide: NgxGridAltItemDirective, useExisting: NgxGridAltColumnDirective }
  ],
  host: {
    '[class.ngx-grid-alt-column]': 'true',
  }
})
export class NgxGridAltColumnDirective extends NgxGridAltItemDirective implements NgxGridAltColumn, OnChanges {
  override readonly type = 'column';
}

@Directive({
  selector: 'ngx-grid-alt-group',
  providers: [
    { provide: NgxGridAltItemDirective, useExisting: NgxGridAltGroupDirective }
  ],
  host: {
    '[class.ngx-grid-alt-group]': 'true',
  }
})
export class NgxGridAltGroupDirective extends NgxGridAltItemDirective implements NgxGridAltGroup, AfterContentInit {
  override readonly type = 'group';

  @ContentChildren(NgxGridAltItemDirective) private itemsRef!: QueryList<NgxGridAltItemType>;

  @Input() strategy?: NgxGridStrategy|null;
  @Input() gap?: string|number|false|null;
  @Input() columnGap?: string|number|false|null;
  @Input() rowGap?: string|number|false|null;
  @Input() rows?: string[]|null;
  @Input() autoRows?: boolean|null;

  ngAfterContentInit() {
    this.subs.push(this.itemsRef.changes.subscribe(() => this.gridRef.emitChange()));
    this.gridRef.getChanges().subscribe(() => this.build());
  }

  private build(){
    this.gridRef.createColumns(this, this.itemsRef.map(d => d)).map(column => {
      column.item.apply(column.ngClass, column.ngStyle, column.ngxStyleVariables);
    });
  }
}
