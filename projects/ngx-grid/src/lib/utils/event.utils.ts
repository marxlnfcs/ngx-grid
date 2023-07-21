import {fromEvent, Observable, Subject, takeUntil} from "rxjs";

let events: Array<EventItem> = [];

export type EventLikeElement = Window|Document|HTMLElement;
export interface EventItem {
  scope: any;
  element: EventLikeElement;
  event: string;
  optionsHash: string;
  stream$: Observable<any>;
  destroy$: Subject<void>;
}

export interface EventListenerOptions {
  capture?: boolean;
  passive?: boolean;
  once?: boolean;
}

export function createEvent<EventResponse = any>(element: EventLikeElement, event: string, options?: EventListenerOptions): Observable<EventResponse>;
export function createEvent<EventResponse = any>(element: EventLikeElement, event: string, scope?: any|'default', options?: EventListenerOptions): Observable<EventResponse>;
export function createEvent<EventResponse = any>(element: EventLikeElement, event: string, scopeOrOptions?: string|'default'|EventListenerOptions, opts?: EventListenerOptions): Observable<EventResponse> {

  // get options and scope
  const scope = typeof scopeOrOptions === 'string' ? scopeOrOptions : 'default';
  const options = scopeOrOptions !== undefined && scopeOrOptions !== null && typeof scopeOrOptions === 'object' ? scopeOrOptions : opts;

  // check if event is already created
  const optionsHash = btoa(JSON.stringify(options || {}));
  const existingEvent = events.find(i => i.element === element && i.event === event && i.optionsHash === optionsHash && (!scope || (i.scope && scope === i.scope)));

  // return the existing observable if available
  if(existingEvent){
    return existingEvent.stream$;
  }

  // create new event observable
  const destroy$: Subject<void> = new Subject<void>();
  // @ts-ignore
  const stream$: Observable<EventResponse> = fromEvent<EventResponse>(element, event, options).pipe(takeUntil(destroy$));

  // add to events list
  events.push({
    scope: scope,
    element: element,
    event: event,
    optionsHash: optionsHash,
    stream$: stream$,
    destroy$: destroy$,
  });

  // return observable
  return stream$;

}

export function removeEvent(element: EventLikeElement, event: string, scope?: any): void {
  events = events.filter(item => {
    if(item.element === element && item.event === event && (!scope || (item.scope && item.scope === scope))){
      item.destroy$.next();
      item.destroy$.complete();
      return false;
    }
    return true;
  });
}
