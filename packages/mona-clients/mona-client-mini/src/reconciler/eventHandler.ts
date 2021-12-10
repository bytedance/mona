type ElementKey = string;
type EventName = string;
export type EventMap = Map<ElementKey, Record<EventName, any>>;
export function genEventHandler(eventMap: EventMap) {
  return function eventHandler(event: any) {
    console.log('eventHandler');
    const key = event.target.id;
    const eventName = event.type;
    console.log('eventHandler', { key, eventName });

    const events = eventMap.get(key);
    events?.[eventName]?.(event);
  };
}
