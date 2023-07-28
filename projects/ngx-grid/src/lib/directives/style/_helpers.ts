import {ElementRef, Renderer2, RendererStyleFlags2} from "@angular/core";
import {NgxGridService} from "../../services/grid.service";
import {NgxGridBreakpointName, NgxGridStyle} from "../../interfaces/grid.interface";

/** @internal */
export interface StyleBreakpointRequester {
  renderer2: Renderer2;
  elementRef: ElementRef<HTMLElement>,
  gridService: NgxGridService;
  styles: { [breakpoint: string]: NgxGridStyle };
}

/** @internal */
export function buildStyleBreakpoint(requester: StyleBreakpointRequester, mode: 'min'|'max', breakpoint: NgxGridBreakpointName, styles: any): void {

  // remove current styles
  Object.keys(requester.styles[breakpoint] || {}).map(key => {
    requester.renderer2.removeStyle(requester.elementRef.nativeElement, key);
  });

  // parse styles
  requester.styles[breakpoint] = parseStyles(styles);

  // apply styles
  Object.keys(requester.styles[breakpoint]).map(key => {
    const value = requester.styles[breakpoint][key]?.replace('!important', '');
    const important = requester.styles[breakpoint][key]?.indexOf('!important') !== -1;

    switch(mode){
      case 'max': {
        if(requester.gridService.isBreakpointMax(breakpoint)){
          requester.renderer2.setStyle(requester.elementRef.nativeElement, key, value, important ? RendererStyleFlags2.Important : undefined);
        }
        break;
      }
      case 'min':
      default: {
        if(requester.gridService.isBreakpointMin(breakpoint)){
          requester.renderer2.setStyle(requester.elementRef.nativeElement, key, value, important ? RendererStyleFlags2.Important : undefined);
        }
        break;
      }
    }
  });

}

/** @internal */
function parseStyles(style: any): NgxGridStyle {
  const styles: NgxGridStyle = {};
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
