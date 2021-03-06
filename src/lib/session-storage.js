import { getDate } from "./date.js";

function checkEvents() {
  return window?.sessionStorage?.getItem(`cubedev-event-banner_v2_${getDate()}`);
}

async function readEvents() {
  const data = window?.sessionStorage?.getItem(`cubedev-event-banner_v2_${getDate()}`);
  try {
    return Promise.resolve(JSON.parse(data));
  } catch (error) {
    return Promise.reject(error);
  }
}

function writeEvents(events) {
  window?.sessionStorage?.setItem(`cubedev-event-banner_v2_${getDate()}`, JSON.stringify(events));
}

export { checkEvents, readEvents, writeEvents };
