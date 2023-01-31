import * as React from "react";
import { type FC, useEffect, useRef, useState } from "react";
import classNames from "classnames/bind";
import { loadEvents } from "./lib/contentful";
import { checkEvents, readEvents, writeEvents } from "./lib/session-storage";
import EventLink from "./EventLink";
import type { EventBanner, MakeOnClick } from "./types";

// @ts-ignore
import styles from "./PurpleBanner.css";

const cn = classNames.bind(styles);

export interface PurpleBannerProps {
  utmSource: string;
  debugMode?: boolean;
}

export const PurpleBanner: FC<PurpleBannerProps> = ({
  utmSource,
  debugMode,
}) => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<EventBanner[]>([]);
  const [isFirstLoading, setFirstLoading] = useState(true);
  const [currentEvent, setCurrentEvent] = useState(0);
  const [noAnimate, setNoAnimate] = useState(false);
  const timeoutRef = useRef<NodeJS.Timer>();

  useEffect(() => {
    if (!navigator.userAgent.includes("Googlebot")) {
      setShow(true);

      if (checkEvents()) {
        readEvents()
          .then((events) => {
            setEvents(events);
            changeSlide(events);
          })
          .catch(() => {
            setEvents([]);
          })
          .finally(() => {
            setNoAnimate(true);
            setFirstLoading(false);
            setLoading(false);
            setTimeout(() => {
              setNoAnimate(false);
            }, 100);
          });
      } else {
        loadEvents({ debugMode })
          .then((events) => {
            writeEvents(events);
            setEvents(events);
          })
          .catch(() => {
            setEvents([]);
          })
          .finally(() => {
            setNoAnimate(true);
            setLoading(false);
            setTimeout(() => {
              setNoAnimate(false);
            }, 100);
          });
      }
    }
    return () => clearTimeout(timeoutRef.current);
  }, []);

  const makeOnClick: MakeOnClick = (slideNumber: number) => {
    return (event) => {
      if (slideNumber === currentEvent) {
        return;
      }
      event.preventDefault();
      setCurrentEvent(slideNumber);
      clearTimeout(timeoutRef.current);
    };
  };

  let slides = null;

  if (events.length > 1 && !loading) {
    slides = (
      <>
        <EventLink
          event={events[events.length - 2]}
          slideNumber={-2}
          makeOnClick={makeOnClick}
          utmSource={utmSource}
        />
        <EventLink
          event={events[events.length - 1]}
          slideNumber={-1}
          makeOnClick={makeOnClick}
          isActive={currentEvent === -1}
          utmSource={utmSource}
        />
        {events.map((item, index) => {
          return (
            <EventLink
              key={item.id}
              event={item}
              slideNumber={index}
              makeOnClick={makeOnClick}
              isActive={index === currentEvent}
              utmSource={utmSource}
            />
          );
        })}
        <EventLink
          event={events[0]}
          slideNumber={events.length}
          makeOnClick={makeOnClick}
          isActive={events.length === currentEvent}
          utmSource={utmSource}
        />
        <EventLink
          event={events[1]}
          slideNumber={1}
          makeOnClick={makeOnClick}
          utmSource={utmSource}
        />
      </>
    );
  } else if (events.length === 1 && !loading) {
    // @ts-ignore
    slides = <EventLink event={events[0]} utmSource={utmSource} />;
  } else {
    slides = null;
  }

  const forceChangeSlide = () => {
    setNoAnimate(true);

    // there must be used a flushSync from react@18
    setTimeout(() => {
      if (currentEvent === -1) {
        setCurrentEvent(events.length - 1);
      } else {
        setCurrentEvent(0);
      }
    }, 10);
    setTimeout(() => {
      setNoAnimate(false);
    }, 20);
  };

  const changeSlide = (events: EventBanner[]) => {
    if (currentEvent === events.length || currentEvent === -1) {
      forceChangeSlide();
    }
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setCurrentEvent(
        (currentEvent) => (currentEvent + 1) % (events.length + 1)
      );
    }, 4000);
  };

  const handleChangeSlide: React.TransitionEventHandler<HTMLDivElement> = (
    event
  ) => {
    event.stopPropagation();
    if (event.target === event.currentTarget) {
      changeSlide(events);
    }
  };

  if (!show) {
    return null;
  }

  return (
    <div
      className={cn("PurpleBanner", {
        "PurpleBanner--visible": !loading,
        "PurpleBanner--noAnimate": !isFirstLoading,
      })}
      style={
        {
          "--current": currentEvent,
        } as React.CSSProperties
      }
      onTransitionEnd={handleChangeSlide}
    >
      <div
        className={cn("PurpleBanner__container", {
          "PurpleBanner__container--noAnimate": noAnimate,
          "PurpleBanner__container--singleSlide": events.length === 1,
        })}
        onTransitionEnd={handleChangeSlide}
      >
        {slides}
      </div>
    </div>
  );
};
