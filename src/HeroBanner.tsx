import * as React from "react";
import type { FC } from "react";
import classNames from "classnames/bind";
import { setUTM } from "./lib/link";
import type { EventBanner } from "./types";
import { SummitLogo } from "./SummitLogo";

// @ts-ignore
import styles from "./PurpleBanner.css";

const cn = classNames.bind(styles);

export interface HeroBannerProps {
  banner: EventBanner;
  utmSource: string;
}

export const HeroBanner: FC<HeroBannerProps> = ({
  banner,
  utmSource,
}) => {
  return (
    <a
      className={cn("PurpleBanner__hero-link")}
      href={setUTM(banner.link, utmSource, banner.campaign)}
      target="_blank"
      rel="noreferrer"
    >
        <div className={cn("PurpleBanner__hero-content")}>
          <div className={cn("PurpleBanner__hero-block")}>
            <SummitLogo className={cn("PurpleBanner__hero-icon")} />
          </div>
          <div className={cn("PurpleBanner__hero-block")}>
            <div className={cn("PurpleBanner__hero-cta")}>
            Registration is open! <div className={cn("PurpleBanner__hero-cta-button")}>
              Join Now
              <svg
                width="10"
                height="10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="m5 .4-1.01 1 2.83 2.82-1.09-.03H.58v1.46l5.15-.02 1.1-.03L4 8.45l1 .99 4.36-4.35v-.34L5 .4Z"
                  fill="currentColor"
                />
                </svg>
              </div>
            </div>
          </div>
        </div>
    </a>
  );
};

export default HeroBanner;
