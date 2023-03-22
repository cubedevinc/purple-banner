import * as React from "react";
import { type FC, useEffect, useState, useCallback } from "react";
import classNames from "classnames/bind";
import { loadEvents } from "./lib/contentful";
import { checkEvents, readEvents, writeEvents } from "./lib/session-storage";
import EventLink from "./EventLink";
import { useSlides } from "./lib/state";

// @ts-ignore
import styles from "./PurpleBanner.css";
const cn = classNames.bind(styles);

export interface PurpleBannerProps {
  utmSource: string;
  debugMode?: boolean;
  slideDuration?: number;
}

const SlideDuration = 4000;

export const PurpleBanner: FC<PurpleBannerProps> = ({
  utmSource,
  debugMode,
  slideDuration = SlideDuration,
}) => {
  const [show, setShow] = useState(false);
  const {
    state,
    dispatch,
    nextSlide,
    resetTimeout,
    goToSlide,
    goLast,
    goFirst,
  } = useSlides(slideDuration);

  const noAnimate = !state.booted || state.state === "skipping";
  const hasNext = state.slides.length > 0;

  const onSlideClick = useCallback(
    (event: React.MouseEvent<HTMLElement, MouseEvent>, slideNumber: number) => {
      if (slideNumber === state.currentSlide) {
        return;
      }
      event.preventDefault();
      goToSlide(slideNumber);
    },
    [state.currentSlide]
  );

  const handleChangeSlide: React.TransitionEventHandler<HTMLDivElement> = (
    event
  ) => {
    event.stopPropagation();
    if (event.target === event.currentTarget) {
      nextSlide(true);
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

    return () => resetTimeout();
  }, []);

  if (!show) {
    return null;
  }

  const slides =
    state.state === "loading" ? null : state.slides.length > 1 ? (
      <>
        <EventLink
          event={state.slides[state.slides.length - 2]}
          utmSource={utmSource}
        />
        <EventLink
          event={state.slides[state.slides.length - 1]}
          onClick={(e) => {
            e.preventDefault();
            goLast();
          }}
          isActive={state.currentSlide === -1}
          utmSource={utmSource}
        />

        {state.slides.map((item, index) => {
          return (
            <EventLink
              key={item.id}
              event={item}
              onClick={(e) => onSlideClick(e, index)}
              isActive={index === state.currentSlide}
              utmSource={utmSource}
            />
          );
        })}

        <EventLink
          event={state.slides[0]}
          onClick={(e) => {
            e.preventDefault();
            goFirst();
          }}
          isActive={state.currentSlide === state.slides.length}
          utmSource={utmSource}
        />
        <EventLink event={state.slides[1]} utmSource={utmSource} />
      </>
    ) : state.slides.length === 1 ? (
      <EventLink event={state.slides[0]} utmSource={utmSource} isActive />
    ) : null;

  return (
    <div
      className={cn("PurpleBanner", {
        "PurpleBanner--visible": state.state !== "loading",
      })}
      style={
        {
          "--current": state.currentSlide,
        } as React.CSSProperties
      }
    >
      <div
        className={cn("PurpleBanner__container", {
          "PurpleBanner__container--noAnimate": noAnimate,
          "PurpleBanner__container--singleSlide": state.slides.length === 1,
        })}
        onTransitionEnd={hasNext ? handleChangeSlide : () => {}}
      >
        {slides}
      </div>
    </div>
  );
};
