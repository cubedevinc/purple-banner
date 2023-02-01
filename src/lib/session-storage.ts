import type { EventBanner } from "../types";
import { getDate } from "./date";

export function checkEvents() {
  return window?.sessionStorage?.getItem(
    `cubedev-event-banner_v2_${getDate()}`
  );
}

export async function readEvents() {
  const data = window?.sessionStorage?.getItem(
    `cubedev-event-banner_v2_${getDate()}`
  );
  try {
    return Promise.resolve(JSON.parse(data!) as EventBanner[]);
  } catch (error) {
    return Promise.reject(error);
  }
}

export function writeEvents(events: EventBanner[]) {
  window?.sessionStorage?.setItem(
    `cubedev-event-banner_v2_${getDate()}`,
    JSON.stringify(events)
  );
}
