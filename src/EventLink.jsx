import React from "react";
import dayjs from "dayjs";
import { setUTM } from "./lib/link.js";
import styles from "./PurpleBanner.css";

import classNames from "classnames/bind";

const cn = classNames.bind(styles);

export function EventDateTime({ dateTime, isLive }) {
  const d = dayjs(dateTime);

  if (isLive) {
    return <span className={cn("PurpleBanner__event_date", "PurpleBanner__event--live")}>Live</span>;
  }

  const h = d.diff(Date.now(), "hour");

  if (h > 12) {
    return <span className={cn("PurpleBanner__event_date")}>{d.format("D MMM")}</span>;
  }

  if (h === 0) {
    const m = d.diff(Date.now(), "minutes");
    return (
      <span className={cn("PurpleBanner__event_date", "PurpleBanner__event--soon")}>
        In {m} {m === 1 ? "minute" : "minutes"}
      </span>
    );
  }

  return (
    <span className={cn("PurpleBanner__event_date", "PurpleBanner__event--soon")}>
      In {h} {h === 1 ? "hour" : "hours"}
    </span>
  );
}

export const EventDetails = ({ event }) => {
  const start = dayjs(event.dateTime);
  const end = start.add(event.duration || 0, "hour");
  const isLive = start.isBefore(Date.now()) && end.isAfter(Date.now());
  const isSoon = isLive ? false : start.diff(Date.now(), "hour") < 12;

  return (
    <div className={cn("PurpleBanner__event")}>
      <EventDateTime dateTime={event.dateTime} isLive={isLive} />
      <span className={cn("PurpleBanner__event_title")}>{event.title}</span>
      <span
        className={cn("PurpleBanner__event_link", {
          "PurpleBanner__event--live": isLive,
          "PurpleBanner__event--soon": isSoon,
        })}
      >
        {isLive ? "Join" : "Register"} Now
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M4.99681 0.399902L3.98881 1.3919L6.82081 4.2239L5.73281 4.1919H0.580811V5.6479L5.73281 5.6319L6.83681 5.5999L3.98881 8.4479L4.99681 9.4399L9.34881 5.0879V4.7519L4.99681 0.399902Z"
            fill="currentColor"
          />
        </svg>
      </span>
    </div>
  );
};

export function EventLink({ event, slideNumber, makeOnClick, isActive = false, utmSource }) {
  let onClick = () => {};

  if (makeOnClick) {
    onClick = makeOnClick(slideNumber);
  }

  return (
    <a
      className={cn("PurpleBanner__link", { "PurpleBanner__link--active": isActive })}
      href={setUTM(event.link, utmSource, event.campaign)}
      key={event.id}
      target={"_blank"}
      rel={"noreferrer"}
      onClick={onClick}
    >
      {event.event ? <EventDetails event={event.event} /> : event.message}
    </a>
  );
}

export default EventLink;
