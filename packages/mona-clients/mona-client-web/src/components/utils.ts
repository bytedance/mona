import React from 'react';
import { TouchEvent, Touch, BaseTarget } from '@bytedance/mona';

function mapTouch(t: React.Touch): Touch {
  return {
    identifier: t.identifier,
    pageX: t.pageX,
    pageY: t.pageY,
    clientX: t.clientX,
    clientY: t.clientY,
  }
}

function mapTarget(t: any = {}): BaseTarget {
  return {
    id: t?.id as string,
    dataset: Object.assign({}, t?.dataset),
    tagName: t?.tagName
  }
}

export function formatTouchEvent({
  event,
  type,
}: {
  event: React.TouchEvent;
  type?: string;
}): TouchEvent<Touch> {
  const { touches, changedTouches, type: originType, timeStamp, target, currentTarget } = event;
  const result: TouchEvent<Touch> = {
    touches: Array.from(touches).map(touch => mapTouch(touch)),
    changedTouches: Array.from(changedTouches).map(touch => mapTouch(touch)),
    type: type || originType,
    timeStamp,
    target: mapTarget(target),
    currentTarget: mapTarget(currentTarget)
  }
  return result;
}

export function formatMouseEvent({
  event,
  type,
}: {
  event: React.MouseEvent;
  type?: string;
}): TouchEvent<Touch> {
  const { pageX, pageY, clientX, clientY, type: originType, timeStamp, target, currentTarget } = event;
  const result: TouchEvent<Touch> = {
    touches: [{ identifier: -1, pageX, pageY, clientX, clientY }],
    changedTouches: [],
    type: type || originType,
    timeStamp,
    target: mapTarget(target),
    currentTarget: mapTarget(currentTarget)
  }
  return result;
}