import React from "react";
import { setUTM } from "./lib/link.js";
import styles from "./PurpleBanner.css";

import classNames from "classnames/bind";

const cn = classNames.bind(styles);

function EventLink({ event, slideNumber, makeOnClick, isActive = false }) {
  let onClick = () => {};

  if (makeOnClick) {
    onClick = makeOnClick(slideNumber);
  }

  return (
    <a
      className={cn("PurpleBanner__link", { "PurpleBanner__link--active": isActive })}
      href={setUTM(event.link, "blog", event.campaign)}
      key={event.id}
      target={"_blank"}
      rel={"noreferrer"}
      onClick={onClick}
    >
      {event.message}
    </a>
  );
}

export default EventLink;
