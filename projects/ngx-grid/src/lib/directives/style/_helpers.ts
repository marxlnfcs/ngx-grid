import {RendererStyleFlags2} from "@angular/core";
import {IGridBreakpointName, IGridStyle} from "../../grid.interface";
import {GridStyle} from "./base.directive";
import {GridStyleMin} from "./min.directive";
import {GridStyleMax} from "./max.directive";

export type IGridStyleInput = string|IGridStyle|string[]|null;
export interface IGridStyleInputs {
  'xs': IGridStyleInput;
  'sm': IGridStyleInput;
  'md': IGridStyleInput;
  'lg': IGridStyleInput;
  'xl': IGridStyleInput;
  '2xl': IGridStyleInput;
  '3xl': IGridStyleInput;
  '4xl': IGridStyleInput;
  'mobile': IGridStyleInput;
  'tablet': IGridStyleInput;
  'desktop': IGridStyleInput;
}

/** @internal */
export function buildStyleBreakpoint(item: GridStyle|GridStyleMin|GridStyleMax, breakpoint: IGridBreakpointName, style: IGridStyleInput): void {

  // remove current styles
  Object.keys(item.computedStyles[breakpoint] || {}).map(key => {
    item.renderer.removeStyle(item.elementRef.nativeElement, key);
  });

  // parse styles
  item.computedStyles[breakpoint] = parseStyles(style);

  // apply styles
  Object.entries(item.computedStyles[breakpoint]).map(([key, value]) => {
    value = value?.replace('!important', '');
    const important = value?.indexOf('!important') !== -1;

    if(item instanceof GridStyleMax){
      if(item.gridService.isBreakpointMax(breakpoint)){
        item.renderer.setStyle(item.elementRef.nativeElement, key, value, important ? RendererStyleFlags2.Important : undefined);
      }
    }else{
      if(item.gridService.isBreakpointMin(breakpoint)){
        item.renderer.setStyle(item.elementRef.nativeElement, key, value, important ? RendererStyleFlags2.Important : undefined);
      }
    }
  });

}

/** @internal */
function parseStyles(style: any): IGridStyle {
  const styles: IGridStyle = {};
  if(style){
    switch(true){
      case typeof style === 'string': {
        style.split(';').map((s: string) => {
          const [ key, value ] = s.split(':');
          if(key && value){
            styles[key.trim()] = value.trim();
          }
        });
        break;
      }
      case Array.isArray(style): {
        style.map((s: string) => {
          s.split(';').map((s: string) => Object.assign(styles, parseStyles(s)));
        });
        break;
      }
      case typeof style === 'object': {
        Object.entries(style).map(([key, value]) => style[key.trim()] = value);
        break;
      }
    }
  }
  return styles;
}
