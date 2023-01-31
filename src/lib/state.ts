import { type Reducer, useReducer, useCallback, useRef } from "react";
import type { EventBanner } from "../types";

export type BannerState = "loading" | "transitioning" | "idle";

export interface State {
  state: BannerState;
  booted: boolean;
  noAnimate: boolean;
  slides: EventBanner[];
  prevSlide: number;
  currentSlide: number;
  nextSlide: number;
}

export const initialState: State = {
  state: "loading",
  booted: false,
  noAnimate: false,
  slides: [],
  prevSlide: 0,
  currentSlide: 0,
  nextSlide: 0,
};

export type BannerActions =
  | "load"
  | "slides-loaded"
  | "prev-slide"
  | "go-to-slide"
  | "next-slide"
  | "finish-transition";

export interface Action {
  type: BannerActions;
}

export interface ActionLoad extends Action {
  type: "load";
}

export interface ActionSlidesLoaded extends Action {
  type: "slides-loaded";
  payload: EventBanner[];
}

export interface ActionGoToSlide extends Action {
  type: "go-to-slide";
  slide: number;
  noAnimate?: boolean;
}

export interface ActionNextSlide extends Action {
  type: "next-slide";
}

export interface ActionFinishTransition extends Action {
  type: "finish-transition";
}

export type Actions =
  | ActionLoad
  | ActionSlidesLoaded
  | ActionGoToSlide
  | ActionNextSlide
  | ActionFinishTransition;

function getSlides(
  current: number,
  length: number
): Pick<State, "currentSlide" | "prevSlide" | "nextSlide"> {
  return {
    prevSlide: (length + current - 1) % length,
    currentSlide: current,
    nextSlide: (length + current + 1) % length,
  };
}
export const bannerStateReducer: Reducer<State, Actions> = (state, action) => {
  switch (action.type) {
    case "load":
      return {
        ...state,
        state: "loading",
      };

    case "slides-loaded":
      const slides = action.payload;
      if (slides.length > 1) {
        return {
          ...state,
          state: "idle",
          slides,
          ...getSlides(0, slides.length),
        };
      }
      return {
        ...state,
        state: "idle",
        slides,
      };

    case "go-to-slide":
      return {
        ...state,
        state: "transitioning",
        booted: true,
        noAnimate: !!action.noAnimate,
        ...getSlides(action.slide, state.slides.length),
      };

    case "next-slide":
      return {
        ...state,
        state: "transitioning",
        booted: true,
        ...getSlides(state.currentSlide + 1, state.slides.length),
      };

    case "finish-transition":
      return {
        ...state,
        state: "idle",
      };

    default:
      return state;
  }
};

function tick(handler: () => void) {
  setTimeout(handler, 10);
}

export const useSlides = (timeout: number = 4000) => {
  const [state, dispatch] = useReducer(bannerStateReducer, initialState);
  const timer = useRef<NodeJS.Timer>();

  const resetTimeout = () => clearTimeout(timer.current);

  const goToSlide = (i: number, noAnimate?: boolean) => {
    resetTimeout();
    dispatch({ type: "go-to-slide", slide: i, noAnimate });
  };

  const goLast = useCallback(() => {
    goToSlide(state.slides.length, true);
    tick(() => goToSlide(state.slides.length - 1));
  }, [state.slides.length]);

  const goFirst = useCallback(() => {
    goToSlide(-1, true);
    tick(() => goToSlide(0));
  }, [state.slides.length]);

  const goNext = useCallback(() => {
    if (state.currentSlide === state.slides.length - 1) {
      goFirst();
    } else {
      dispatch({ type: "next-slide" });
    }
  }, [state.slides.length, state.currentSlide]);

  const nextSlide = (delay?: boolean) => {
    if (delay) {
      timer.current = setTimeout(() => goNext(), timeout);
    } else {
      goNext();
    }
  };

  return {
    state,
    dispatch,
    nextSlide,
    goToSlide,
    goLast,
    goFirst,
    resetTimeout,
  };
};
