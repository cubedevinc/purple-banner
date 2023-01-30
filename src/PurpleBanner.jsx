import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames/bind";
import { loadEvents } from "./lib/contentful.js";
import { checkEvents, readEvents, writeEvents } from "./lib/session-storage.js";
import EventLink from "./EventLink.jsx";

import styles from "./PurpleBanner.css";

const cn = classNames.bind(styles);

function PurpleBanner({ utmSource, debugMode }) {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [isFirstLoading, setFirstLoading] = useState(true);
  const [currentEvent, setCurrentEvent] = useState(0);
  const [noAnimate, setNoAnimate] = useState(false);
  const timeoutRef = useRef({});

  useEffect(() => {
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
    return () => clearTimeout(timeoutRef.current);
  }, []);

  const makeOnClick = (slideNumber) => {
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
          utmSource={utmSource} />
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
          utmSource={utmSource} />
      </>
    );
  } else if (events.length === 1 && !loading) {
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

  const changeSlide = (events) => {
    if (currentEvent === events.length || currentEvent === -1) {
      forceChangeSlide();
    }
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setCurrentEvent((currentEvent) => (currentEvent + 1) % (events.length + 1));
    }, 4000);
  };

  const handleChangeSlide = (event) => {
    event.stopPropagation();
    if (event.target === event.currentTarget) {
      changeSlide(events);
    }
  };

  return (
    <div
      className={cn("PurpleBanner", {
        "PurpleBanner--visible": !loading,
        "PurpleBanner--noAnimate": !isFirstLoading,
      })}
      style={{
        "--current": currentEvent,
      }}
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
}

export { PurpleBanner };
