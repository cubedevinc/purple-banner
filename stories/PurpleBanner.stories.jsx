import React from "react";
import dayjs from "dayjs";
import { writeEvents } from "../src/lib/session-storage";
import { PurpleBanner as Component } from "../src/PurpleBanner";

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

writeEvents([ {
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

]);

export const PurpleBanner = () => <Component debugMode />;
