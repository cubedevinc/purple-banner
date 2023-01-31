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
  slides: EventBanner[];
  currentSlide: number;
  previousSlide: number;
  nextSlide: number;
  nextSlide2: number;
}

export const initialState: State = {
  state: "loading",
  booted: false,
  slides: [],
  currentSlide: 0,
  previousSlide: 0,
  nextSlide: 0,
  nextSlide2: 0,
};

export type BannerActions =
  | "load"
  | "slides-loaded"
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

export interface ActionNextSlide extends Action {
  type: "next-slide";
}

export interface ActionFinishTransition extends Action {
  type: "finish-transition";
}

export type Actions =
  | ActionLoad
  | ActionSlidesLoaded
  | ActionNextSlide
  | ActionFinishTransition;

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
          currentSlide: 0,
          previousSlide: slides.length - 1,
          nextSlide: 1,
          nextSlide2: 2 % slides.length,
        };
      }
      return {
        ...state,
        state: "idle",
        slides,
      };

    case "next-slide":
      return {
        ...state,
        state: "transitioning",
        booted: true,
        previousSlide: state.currentSlide,
        currentSlide: (state.currentSlide + 1) % state.slides.length,
        nextSlide: (state.currentSlide + 2) % state.slides.length,
        nextSlide2: (state.currentSlide + 3) % state.slides.length,
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

export const withLogger: (
  reducer: Reducer<State, Actions>
) => Reducer<State, Actions> = (reducer) => (state, action) => {
  console.log(action, state);

  const next = reducer(state, action);

  console.log(action, next);

  return next;
};
