import * as React from "react";
import {
  type FC,
  useEffect,
  useReducer,
  useRef,
  useState,
  useCallback,
} from "react";
import classNames from "classnames/bind";
import { loadEvents } from "./lib/contentful";
import { checkEvents, readEvents, writeEvents } from "./lib/session-storage";
import EventLink from "./EventLink";
import type { MakeOnClick } from "./types";
import { bannerStateReducer, initialState } from "./lib/state";

// @ts-ignore
import styles from "./PurpleBanner.css";

const cn = classNames.bind(styles);

export interface PurpleBannerProps {
  utmSource: string;
  debugMode?: boolean;
}

const IdleDuration = 1000;

export const PurpleBanner: FC<PurpleBannerProps> = ({
  utmSource,
  debugMode,
}) => {
  const [show, setShow] = useState(false);
  const [state, dispatch] = useReducer(bannerStateReducer, initialState);
  const timeout = useRef<NodeJS.Timer>();

  const goToSlide = (i: number, noAnimate?: boolean) =>
    dispatch({ type: "go-to-slide", slide: i, noAnimate });

  const goLast = useCallback(() => {
    goToSlide(state.slides.length, true);
    setTimeout(() => goToSlide(state.slides.length - 1), 10);
  }, [state.slides.length]);

  const goNext = useCallback(() => {
    if (state.currentSlide === state.slides.length - 1) {
      goFirst();
    } else {
      dispatch({ type: "next-slide" });
    }
  }, [state.slides.length, state.currentSlide]);

  const nextSlide = (delay?: boolean) => {
    clearTimeout(timeout.current);
    if (delay) {
      timeout.current = setTimeout(() => goNext(), IdleDuration);
    } else {
      goNext();
    }
  };

  const goFirst = useCallback(() => {
    goToSlide(-1, true);
    setTimeout(() => goToSlide(0), 10);
  }, [state.slides.length]);

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
        event.preventDefault();
        if (slideNumber === state.currentSlide) {
          return;
        }
        goToSlide(slideNumber);
      };
    },
    [state.currentSlide]
  );

  let slides = null;

  if (state.slides.length > 1 && state.state !== "loading") {
    slides = (
      <>
        <EventLink
          event={state.slides[state.slides.length - 2]}
          slideNumber={-2}
          utmSource={utmSource}
        />
        <EventLink
          event={state.slides[state.slides.length - 1]}
          slideNumber={-1}
          onClick={(e) => {
            e.preventDefault();
            goLast();
          }}
          isActive={state.currentSlide === state.slides.length - 1}
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
          slideNumber={0}
          onClick={(e) => {
            e.preventDefault();
            goFirst();
          }}
          isActive={state.currentSlide === 0}
          utmSource={utmSource}
        />
        <EventLink
          event={state.slides[1]}
          slideNumber={1}
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

  const noAnimate = !state.booted || state.noAnimate;

  return (
    <div
      className={cn("PurpleBanner", {
        "PurpleBanner--visible": state.state !== "loading",
        "PurpleBanner--noAnimate": noAnimate,
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
          "PurpleBanner__container--noAnimate": noAnimate,
          "PurpleBanner__container--singleSlide": state.slides.length === 1,
        })}
        onTransitionEnd={handleChangeSlide}
      >
        {slides}
      </div>
    </div>
  );
};
