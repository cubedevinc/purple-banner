// @ts-nocheck
import React from "react";
import dayjs from "dayjs";
import { EventLink as Component } from "../src/EventLink";

import "../src/PurpleBanner.css";

export default {
  title: "EventLink",
  component: Component,
};

const baseEvent = {
  message: "event message",
  link: "https://example.com/event/1",
  campaign: "utm",
  id: 1,
  event: {
    slug: "event",
    title: "upcoming event",
    dateTime: dayjs().add(5, "day").toString(),
    duration: 1,
  },
};

const BannerPreview = ({ children }) => (
  <div
    className="PurpleBanner"
    style={{
      height: "auto",
      maxHeight: "none",
      display: "flex",
      flexFlow: "column",
    }}
  >
    {children}
  </div>
);

export const Default = () => (
  <BannerPreview>
    {[
      {
        ...baseEvent,
        message: "live event",
        event: {
          ...baseEvent.event,
          title: "live event",
          dateTime: dayjs().subtract(4, "hour").toString(),
          duration: 8,
        },
      },
      {
        ...baseEvent,
        message: "upcoming event in 1 minute",
        event: {
          ...baseEvent.event,
          title: "upcoming event in 1 minute",
          dateTime: dayjs().add(2, "minute").toString(),
        },
      },
      {
        ...baseEvent,
        message: "upcoming event in 15 minutes",
        event: {
          ...baseEvent.event,
          title: "upcoming event in 15 minutes",
          dateTime: dayjs().add(16, "minute").toString(),
        },
      },
      {
        ...baseEvent,
        message: "upcoming event in 1 hour",
        event: {
          ...baseEvent.event,
          title: "upcoming event in 1 hour",
          dateTime: dayjs().add(61, "minute").toString(),
        },
      },
      {
        ...baseEvent,
        message: "upcoming event in 4 hours",
        event: {
          ...baseEvent.event,
          title: "upcoming event in 4 hours",
          dateTime: dayjs().add(4, "hour").toString(),
        },
      },
      {
        ...baseEvent,
        message: "upcoming event in 11 hours",
        event: {
          ...baseEvent.event,
          title: "upcoming event in 11 hours",
          dateTime: dayjs().add(12, "hour").toString(),
        },
      },
      {
        ...baseEvent,
        message: "upcoming event in 15 hours (tomorrow)",
        event: {
          ...baseEvent.event,
          title: "upcoming event in 15 hours (tomorrow)",
          dateTime: dayjs().add(15, "hour").toString(),
        },
      },
      {
        ...baseEvent,
        message: "past event",
        event: {
          ...baseEvent.event,
          title: "past event",
          dateTime: dayjs().subtract(15, "hour").toString(),
        },
      },
    ].map((event, i) => (
      <Component
        key={i}
        slideNumber={1}
        isActive={true}
        utmSource="utm"
        event={event}
      />
    ))}
  </BannerPreview>
);
