import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames/bind";
import { loadEvents } from "./lib/contentful.js";
import { checkEvents, readEvents, writeEvents } from "./lib/session-storage.js";
import EventLink from "./EventLink.jsx";

import styles from "./PurpleBanner.css";

const cn = classNames.bind(styles);

function PurpleBanner() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [isFirstLoading, setFirstLoading] = useState(true);
  const [currentEvent, setCurrentEvent] = useState(1);
  const [absoluteSlideNumber, setAbsoluteSlideNumber] = useState(1);
  const [noAnimate, setNoAnimate] = useState(false);
  const containerRef = useRef();
  const timeoutRef = useRef({});

  useEffect(() => {
    if (checkEvents()) {
      readEvents()
        .then((events) => {
          setEvents(events);
        })
        .catch(() => {
          setEvents([]);
        })
        .finally(() => {
          setFirstLoading(false);
          setLoading(false);
        });
    } else {
      loadEvents()
        .then((events) => {
          writeEvents(events);
          setEvents(events);
        })
        .catch(() => {
          setEvents([]);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  const makeOnClick = (slideNumber) => {
    return (event) => {
      if (slideNumber === currentEvent) {
        return;
      }
      event.preventDefault();
      setCurrentEvent(slideNumber);
      if (slideNumber > currentEvent) {
        setAbsoluteSlideNumber((absoluteSlideNumber) => absoluteSlideNumber + 1);
      } else {
        setAbsoluteSlideNumber((absoluteSlideNumber) => absoluteSlideNumber - 1);
      }
      clearTimeout(timeoutRef.current);
    };
  };

  let slides = null;

  if (events.length > 1 && !loading) {
    slides = (
      <>
        <EventLink event={events[events.length - 2]} slideNumber={-2} makeOnClick={makeOnClick} />
        <EventLink
          event={events[events.length - 1]}
          slideNumber={-1}
          makeOnClick={makeOnClick}
          isActive={currentEvent === -1}
        />
        {events.map((item, index) => {
          return (
            <EventLink
              key={item.id}
              event={item}
              slideNumber={index}
              makeOnClick={makeOnClick}
              isActive={index === currentEvent}
            />
          );
        })}
        <EventLink
          event={events[0]}
          slideNumber={events.length}
          makeOnClick={makeOnClick}
          isActive={events.length === currentEvent}
        />
        <EventLink event={events[1]} slideNumber={1} makeOnClick={makeOnClick} />
      </>
    );
  } else if (!loading) {
    slides = <EventLink event={events[0]} />;
  }

  const forceChangeSlide = () => {
    setNoAnimate(true);
    if (currentEvent === -1) {
      // если первый виртуальный
      setCurrentEvent(events.length - 1);
    } else {
      setCurrentEvent(0);
    }
    setTimeout(() => {
      setNoAnimate(false);
    }, 0);
  };

  const changeSlide = (events) => {
    if (currentEvent === events.length || currentEvent === -1) {
      forceChangeSlide();
    }
    timeoutRef.current = setTimeout(() => {
      setCurrentEvent((currentEvent) => (currentEvent + 1) % (events.length + 1));
      setAbsoluteSlideNumber((absoluteSlideNumber) => absoluteSlideNumber + 1);
    }, 4000);
  };

  const handleChangeSlide = (event) => {
    event.stopPropagation();
    if (event.target === containerRef.current) {
      changeSlide(events);
    }
  };

  return (
    <div
      className={cn("PurpleBanner", {
        "PurpleBanner--visible": !loading,
        "PurpleBanner--noAnimate": isFirstLoading,
      })}
      style={{
        "--current": currentEvent,
        "--absoluteSlideNumber": absoluteSlideNumber,
      }}
    >
      <div
        className={cn("PurpleBanner__container", {
          "PurpleBanner__container--noAnimate": noAnimate,
          "PurpleBanner__container--singleSlide": events.length === 1,
        })}
        ref={containerRef}
        onTransitionEnd={handleChangeSlide}
      >
        {slides}
      </div>
    </div>
  );
}

export { PurpleBanner };
