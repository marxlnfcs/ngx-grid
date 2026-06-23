import type {Grid} from "./grid.component";
import type {GridColumn} from "./columns/column";
import type {GridGroup} from "./columns/group";

export type IGridItem  = IGridColumn|IGridGroup;
export type IGridColumn = GridColumn|GridGroup;
export type IGridGroup = Grid|GridGroup;

export interface IGridItemReference {
  index: number;
  instance: IGridItem;
  styles: Record<string, string>;
  position: IGridItemReferencePosition;
}

export interface IGridItemReferencePosition {
  rowStart: number;
  rowEnd: number;
  columnStart: number;
  columnEnd: number;
  order: number;
}
