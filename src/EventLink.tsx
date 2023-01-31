import * as React from "react";
import type { FC } from "react";
import dayjs from "dayjs";
import { setUTM } from "./lib/link";
// @ts-ignore
import styles from "./PurpleBanner.css";
import type { EventBanner, Event, MakeOnClick } from "./types";

import classNames from "classnames/bind";

const cn = classNames.bind(styles);

export interface EventDateTimeProps {
  dateTime: string;
  isLive: boolean;
}

export const EventDateTime: FC<EventDateTimeProps> = ({ dateTime, isLive }) => {
  const d = dayjs(dateTime);

  if (isLive) {
    return (
      <span
        className={cn("PurpleBanner__event_date", "PurpleBanner__event--live")}
      >
        <span className={cn("PurpleBanner__event_live")} />
        Live
      </span>
    );
  }

  const h = d.diff(Date.now(), "hour");

  if (h > 12) {
    return (
      <span className={cn("PurpleBanner__event_date")}>
        {d.format("D MMM")}
      </span>
    );
  }

  if (h === 0) {
    const m = d.diff(Date.now(), "minutes");
    return (
      <span
        className={cn("PurpleBanner__event_date", "PurpleBanner__event--soon")}
      >
        <span className={cn("PurpleBanner__event_fire")} />
        In {m} {m === 1 ? "minute" : "minutes"}
      </span>
    );
  }

  return (
    <span
      className={cn("PurpleBanner__event_date", "PurpleBanner__event--soon")}
    >
      <span className={cn("PurpleBanner__event_fire")} />
      In {h} {h === 1 ? "hour" : "hours"}
    </span>
  );
};

export interface EventDetailsProps {
  event: Event;
}

export const EventDetails: FC<EventDetailsProps> = ({ event }) => {
  const start = dayjs(event.dateTime);
  const end = start.add(event.duration || 0, "hour");
  const isLive = start.isBefore(Date.now()) && end.isAfter(Date.now());
  const isSoon = isLive ? false : start.diff(Date.now(), "hour") < 12;

  return (
    <div className={cn("PurpleBanner__event")}>
      <EventDateTime dateTime={event.dateTime} isLive={isLive} />
      <span className={cn("PurpleBanner__event_title")}>{event.title}</span>
      <span
        className={cn("PurpleBanner__cta", {
          "PurpleBanner__event--live": isLive,
          "PurpleBanner__event--soon": isSoon,
        })}
      >
        {isLive ? "Join" : "Register"} now
        <svg
          width="10"
          height="10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="m5 .4-1.01 1 2.83 2.82-1.09-.03H.58v1.46l5.15-.02 1.1-.03L4 8.45l1 .99 4.36-4.35v-.34L5 .4Z"
            fill="currentColor"
          />
        </svg>
      </span>
    </div>
  );
};

export interface EventLinkProps {
  event: EventBanner;
  slideNumber: number;
  makeOnClick?: MakeOnClick;
  isActive?: boolean;
  utmSource: string;
}

export const EventLink: FC<EventLinkProps> = ({
  event,
  slideNumber,
  makeOnClick,
  isActive = false,
  utmSource,
}) => {
  const onClick = makeOnClick ? makeOnClick(slideNumber) : () => {};

  return (
    <a
      className={cn("PurpleBanner__link", {
        "PurpleBanner__link--active": isActive,
      })}
      href={setUTM(event.link, utmSource, event.campaign)}
      key={event.id}
      target={"_blank"}
      rel={"noreferrer"}
      onClick={onClick}
    >
      {event.event ? <EventDetails event={event.event} /> : event.message}
    </a>
  );
};

export default EventLink;
