// @ts-nocheck
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { writeEvents } from "../src/lib/session-storage";
import { PurpleBanner as Component } from "../src/PurpleBanner";
import { EventBanner } from "../src/types";

export default {
  title: "PurpleBanner",
  component: Component,
  argTypes: {
    source: {
      name: "UTM source",
      defaultValue: "source",
      type: {
        name: "string",
        required: true,
      },
    },
  },
};

const withEvents = (Comp, events: EventBanner[]) => {
  // eslint-disable-next-line react/display-name
  return () => {
    const [ready, setReady] = useState(false);
    useEffect(() => {
      sessionStorage.clear();
      writeEvents(events);
      setReady(true);
    }, []);

    if (!ready) {
      return false;
    }

    return <Comp />;
  };
};

export const Default = withEvents(
  () => <Component debugMode />,
  [
    {
      message: "legacy banner without linked event",
      link: "https://example.com/event/1",
      campaign: "1",
      id: 1,
    },
    {
      message: "event 1",
      link: "https://example.com/event/1",
      campaign: "1",
      id: 2,
      event: {
        slug: "event1",
        title: "upcoming event",
        dateTime: dayjs().add(5, "day").toString(),
        duration: 1,
      },
    },
    {
      message: "event 2",
      link: "https://example.com/event/2",
      campaign: "2",
      id: 3,
      event: {
        slug: "event2",
        title: "upcoming event with registration (register link)",
        registerLink: "https://example.com/event/3",
        dateTime: dayjs().add(10, "day").toString(),
        duration: 1,
      },
    },
    {
      message: "event 3",
      link: "https://example.com/event/3",
      campaign: "3",
      id: 4,
      event: {
        slug: "event",
        title: "upcoming event with registration (zoom webinar id)",
        zoomWebinarId: "123",
        dateTime: dayjs().add(10, "day").toString(),
        duration: 12,
      },
    },
    {
      message: "event 4",
      link: "https://example.com/event/4",
      campaign: "3",
      id: 5,
      event: {
        slug: "event",
        title: "ongoing event",
        dateTime: dayjs().subtract(1, "hour").toString(),
        duration: 12,
      },
    },
    {
      message: "event 5",
      link: "https://example.com/event/5",
      campaign: "3",
      id: 6,
      event: {
        slug: "event",
        title: "fire event",
        zoomWebinarId: "123",
        dateTime: dayjs().add(1, "hour").toString(),
        duration: 12,
      },
    },
  ]
);

export const LegacyEvents = withEvents(
  () => <Component debugMode />,
  [1, 2, 3].map((i) => ({
    message: `legacy event ${i}`,
    link: "https://example.com/event/1",
    campaign: "utm",
    id: i,
  }))
);

export const OneEvent = withEvents(
  () => <Component debugMode />,
  [
    {
      link: "https://example.com/event/1",
      campaign: "utm",
      id: 0,
      message: `event`,
      event: {
        slug: 0,
        title: `event`,
        dateTime: dayjs().add(5, "day").toString(),
        duration: 1,
      },
    },
  ]
);

export const TwoEvents = withEvents(
  () => <Component debugMode />,
  [1, 2].map((i) => ({
    link: "https://example.com/event/1",
    campaign: "utm",
    message: `event ${i}`,
    id: i,
    event: {
      slug: i,
      title: `event ${i}`,
      dateTime: dayjs()
        .add(5 + i, "day")
        .toString(),
      duration: 1,
    },
  }))
);

export const SixEvents = withEvents(
  () => <Component debugMode />,
  [1, 2, 3, 4, 5, 6].map((i) => ({
    link: "https://example.com/event/1",
    campaign: "utm",
    id: i,
    message: `event ${i}`,
    event: {
      slug: i,
      title: `event ${i}`,
      dateTime: dayjs()
        .add(5 + i, "day")
        .toString(),
      duration: 1,
    },
  }))
);
