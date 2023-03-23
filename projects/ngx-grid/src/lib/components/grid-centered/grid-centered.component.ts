import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import {NgxGridColumnSize, NgxGridColumnSizeEven} from "../../interfaces/grid.interface";

@Component({
  selector: 'ngx-grid-centered',
  templateUrl: './grid-centered.component.html',
  styleUrls: ['./grid-centered.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxGridCenteredComponent implements OnInit, OnChanges {
  @Input() autoRows?: boolean|null;

  @Input() size?: NgxGridColumnSizeEven|null = 12;
  @Input('xs:size') size_xs?: NgxGridColumnSizeEven|null;
  @Input('sm:size') size_sm?: NgxGridColumnSizeEven|null;
  @Input('md:size') size_md?: NgxGridColumnSizeEven|null;
  @Input('lg:size') size_lg?: NgxGridColumnSizeEven|null;
  @Input('xl:size') size_xl?: NgxGridColumnSizeEven|null;
  @Input('2xl:size') size_2xl?: NgxGridColumnSizeEven|null;
  @Input('3xl:size') size_3xl?: NgxGridColumnSizeEven|null;
  @Input('4xl:size') size_4xl?: NgxGridColumnSizeEven|null;

  offset?: NgxGridColumnSize;
  offset_xs?: NgxGridColumnSize;
  offset_sm?: NgxGridColumnSize;
  offset_md?: NgxGridColumnSize;
  offset_lg?: NgxGridColumnSize;
  offset_xl?: NgxGridColumnSize;
  offset_2xl?: NgxGridColumnSize;
  offset_3xl?: NgxGridColumnSize;
  offset_4xl?: NgxGridColumnSize;

  constructor(
    private changeDetectorRef: ChangeDetectorRef
  ){}

  ngOnInit(){
    this.build();
  }

  ngOnChanges(changes: SimpleChanges){
    this.build();
    this.changeDetectorRef.markForCheck();
  }

  private build(){
    this.size = this.size || 12;
    this.offset = (this.size && this.size <= 10) ? ((12 - this.size) / 2) as NgxGridColumnSize : undefined;
    ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'].map((size) => {
      // @ts-ignore
      this['size_'+size] = this.size['size_'+size] || null;
      // @ts-ignore
      this['offset_'+size] = (this.size['size_'+size] && this.size['size_'+size] <= 10) ? ((12 - this.size['size_'+size]) / 2) as NgxGridColumnSize : undefined;
    });
  }
}
