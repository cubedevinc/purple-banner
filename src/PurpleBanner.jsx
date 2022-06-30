import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames/bind";
import { loadEvents } from "./lib/contentful.js";
import { checkEvents, readEvents, writeEvents } from "./lib/session-storage.js";
import EventLink from "./EventLink.jsx";

import styles from "./PurpleBanner.css";

const cn = classNames.bind(styles);

function PurpleBanner({ utmSource }) {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [isFirstLoading, setFirstLoading] = useState(true);
  const [currentEvent, setCurrentEvent] = useState(0);
  const [absoluteSlideNumber, setAbsoluteSlideNumber] = useState(0);
  const [noAnimate, setNoAnimate] = useState(false);
  const containerRef = useRef();
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
    return () => clearTimeout(timeoutRef.current);
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
        <EventLink event={events[events.length - 2]} slideNumber={-2} makeOnClick={makeOnClick} utmSource={utmSource} />
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
        <EventLink event={events[1]} slideNumber={1} makeOnClick={makeOnClick} utmSource={utmSource} />
      </>
    );
  } else if (!loading) {
    slides = <EventLink event={events[0]} utmSource={utmSource} />;
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
        "PurpleBanner--noAnimate": !isFirstLoading,
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
