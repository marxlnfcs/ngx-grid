import {NgxGridBreakpointName, NgxGridClass} from "../../interfaces/grid.interface";
import {NgxGridService} from "../../services/grid.service";
import {ElementRef, Renderer2} from "@angular/core";

/** @internal */
export interface ClassBreakpointRequester {
  renderer2: Renderer2;
  elementRef: ElementRef<HTMLElement>,
  gridService: NgxGridService;
  classes: { [breakpoint: string]: NgxGridClass };
}

/** @internal */
export function buildClassBreakpoint(requester: ClassBreakpointRequester, mode: 'min'|'max', breakpoint: NgxGridBreakpointName, klass: any): void {

  // remove current classes
  Object.keys(requester.classes[breakpoint] || {}).map(key => {
    requester.renderer2.removeClass(requester.elementRef.nativeElement, key);
  });

  // parse classes
  requester.classes[breakpoint] = parseClasses(klass);

  // apply classes
  Object.keys(requester.classes[breakpoint]).map(key => {
    if(requester.classes[breakpoint][key]){
      switch(mode) {
        case 'max': {
          if(requester.gridService.isBreakpointMax(breakpoint)){
            requester.renderer2.addClass(requester.elementRef.nativeElement, key);
          }
          break;
        }
        case 'min':
        default: {
          if(requester.gridService.isBreakpointMin(breakpoint)){
            requester.renderer2.addClass(requester.elementRef.nativeElement, key);
          }
          break;
        }
      }
    }
  })

}

/** @internal */
function parseClasses(klass: any): NgxGridClass {
  const classes: NgxGridClass = {};
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
