import {IGridBreakpointName, IGridClass} from "../../grid.interface";
import {GridClass} from "./base.directive";
import {GridClassMin} from "./min.directive";
import {GridClassMax} from "./max.directive";

export type IGridClassInput = string|IGridClass|string[]|null;
export interface IGridClassInputs {
  'xs': IGridClassInput;
  'sm': IGridClassInput;
  'md': IGridClassInput;
  'lg': IGridClassInput;
  'xl': IGridClassInput;
  '2xl': IGridClassInput;
  '3xl': IGridClassInput;
  '4xl': IGridClassInput;
  'mobile': IGridClassInput;
  'tablet': IGridClassInput;
  'desktop': IGridClassInput;
}

/** @internal */
export function buildClassBreakpoint(item: GridClass|GridClassMin|GridClassMax, breakpoint: IGridBreakpointName, klass: IGridClassInput): void {

  // remove current classes
  Object.keys(item.computedClasses[breakpoint] || {}).map(key => {
    item.renderer.removeClass(item.elementRef.nativeElement, key);
  });

  // parse classes
  item.computedClasses[breakpoint] = parseClasses(klass);

  // apply classes
  Object.entries(item.computedClasses[breakpoint]).map(([key, value]) => {
    if(!value) return;
    if(item instanceof GridClassMax) {
      if(item.gridService.isBreakpointMax(breakpoint)){
        item.renderer.addClass(item.elementRef.nativeElement, key);
      }
    }else{
      if(item.gridService.isBreakpointMin(breakpoint)){
        item.renderer.addClass(item.elementRef.nativeElement, key);
      }
    }
  });

}

/** @internal */
function parseClasses(klass: any): IGridClass {
  const classes: IGridClass = {};
  if(klass){
    switch(true){
      case typeof klass === 'string': {
        klass.split(' ').map((c: string) => classes[c.trim()] = true);
        break;
      }
      case Array.isArray(klass): {
        klass.map((c: string) => classes[c.trim()] = true);
        break;
      }
      case typeof klass === 'object': {
        Object.entries(klass).map(([key, value]) => classes[key.trim()] = !!value);
        break;
      }
    }
  }
  return classes;
}
