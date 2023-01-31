import type { Reducer } from "react";
import type { EventBanner } from "../types";

/**
 * <root>
 *  |\
 *  | \(no stored data)
 *  |  \
 *  |  loading
 *  | /
 *  |/
 * idle _________
 *  |             \
 *  |              \
 *  | (next slide) /
 *  |             /
 * transitioning--
 */
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
