import * as React from "react";
import { type FC, useEffect, useReducer, useRef, useState } from "react";
import classNames from "classnames/bind";
import { loadEvents } from "./lib/contentful";
import { checkEvents, readEvents, writeEvents } from "./lib/session-storage";
import EventLink from "./EventLink";
import type { MakeOnClick } from "./types";
import { bannerStateReducer, initialState, withLogger } from "./lib/state";

// @ts-ignore
import styles from "./PurpleBanner.css";

const cn = classNames.bind(styles);

export interface PurpleBannerProps {
  utmSource: string;
  debugMode?: boolean;
}

const IdleDuration = 4000;

export const PurpleBanner: FC<PurpleBannerProps> = ({
  utmSource,
  debugMode,
}) => {
  const [show, setShow] = useState(false);
  const [state, dispatch] = useReducer(
    withLogger(bannerStateReducer),
    initialState
  );
  const timeout = useRef<NodeJS.Timer>();

  const nextSlide = (first?: boolean) => {
    clearTimeout(timeout.current);
    if (first) {
      timeout.current = setTimeout(
        () => dispatch({ type: "next-slide" }),
        IdleDuration
      );
    } else {
      dispatch({ type: "next-slide" });
    }
  };

  useEffect(() => {
    const hide = navigator.userAgent.includes("Googlebot");
    if (!hide) {
      setShow(true);

      dispatch({ type: "load" });

      (checkEvents() ? readEvents() : loadEvents({ debugMode }))
        .then((events) => {
          writeEvents(events);
          dispatch({
            type: "slides-loaded",
            payload: events,
          });
          nextSlide(true);
        })
        .catch(() =>
          dispatch({
            type: "slides-loaded",
            payload: [],
          })
        );
    }

    return () => clearTimeout(timeout.current);
  }, []);

  const makeOnClick: MakeOnClick = React.useCallback(
    (slideNumber: number) => {
      return (event) => {
        if (slideNumber === state.currentSlide) {
          return;
        }
        event.preventDefault();
        nextSlide();
      };
    },
    [state.currentSlide]
  );

  let slides = null;

  if (state.slides.length > 1 && state.state !== "loading") {
    slides = (
      <>
        <EventLink
          event={state.slides[state.previousSlide]}
          slideNumber={-2}
          makeOnClick={makeOnClick}
          utmSource={utmSource}
        />
        <EventLink
          event={state.slides[state.slides.length - 1]}
          slideNumber={-1}
          makeOnClick={makeOnClick}
          isActive={state.previousSlide === state.slides.length - 1}
          utmSource={utmSource}
        />
        {state.slides.map((item, index) => {
          return (
            <EventLink
              key={item.id}
              event={item}
              slideNumber={index}
              makeOnClick={makeOnClick}
              isActive={index === state.currentSlide}
              utmSource={utmSource}
            />
          );
        })}
        <EventLink
          event={state.slides[0]}
          slideNumber={state.slides.length}
          makeOnClick={makeOnClick}
          isActive={state.nextSlide === 0}
          utmSource={utmSource}
        />
        <EventLink
          event={state.slides[1]}
          slideNumber={1}
          makeOnClick={makeOnClick}
          utmSource={utmSource}
        />
      </>
    );
  } else if (state.slides.length === 1 && state.state !== "loading") {
    slides = (
      <EventLink
        event={state.slides[0]}
        slideNumber={0}
        utmSource={utmSource}
      />
    );
  } else {
    slides = null;
  }

  const handleChangeSlide: React.TransitionEventHandler<HTMLDivElement> = (
    event
  ) => {
    event.stopPropagation();
    if (event.target === event.currentTarget) {
      nextSlide(true);
    }
  };

  if (!show) {
    return null;
  }

  return (
    <div
      className={cn("PurpleBanner", {
        "PurpleBanner--visible": state.state !== "loading",
        "PurpleBanner--noAnimate": !state.booted,
      })}
      style={
        {
          "--current": state.currentSlide,
        } as React.CSSProperties
      }
      onTransitionEnd={handleChangeSlide}
    >
      <div
        className={cn("PurpleBanner__container", {
          "PurpleBanner__container--noAnimate": !state.booted,
          "PurpleBanner__container--singleSlide": state.slides.length === 1,
        })}
        onTransitionEnd={handleChangeSlide}
      >
        {slides}
      </div>
    </div>
  );
};
