type ElementKey = string;
type EventName = string;
export type EventMap = Map<ElementKey, Record<EventName, any>>;
export function genEventHandler(eventMap: EventMap) {
  return function eventHandler(event: any) {
    const key = event.target.id;
    const eventName = event.type;

    const events = eventMap.get(key);
    events?.[eventName]?.(event);
  };
}
