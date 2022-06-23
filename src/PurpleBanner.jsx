import React, { useEffect, useState } from "react";
import { loadEvents } from "./lib/contentful.js";
import { setUTM } from "./lib/link.js";
import { checkEvents, readEvents, writeEvents } from "./lib/session-storage.js";

import "./PurpleBanner.css";

function className({ isLoading, isFirstLoading }) {
  let result = "cubedev-purple-banner";

  if (!isFirstLoading) {
    result += " cubedev-purple-banner_no-animation";
  }

  if (!isLoading) {
    result += " cubedev-purple-banner_visible";
  }

  return result;
}

// eslint-disable-next-line react/prop-types
function PurpleBanner({ source }) {
  const [isLoading, setLoading] = useState(true);
  const [isFirstLoading, setFirstLoading] = useState(true);
  const [events, setEvents] = useState([]);

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

  return (
    <div className={className({ isLoading, isFirstLoading })}>
      {!isLoading &&
        events.map(({ id, link, message, campaign }) => (
          <a
            key={id}
            className="cubedev-purple-banner__link"
            href={setUTM(link, source, campaign)}
            target="_blank"
            rel="noreferrer"
          >
            {message}
          </a>
        ))}
    </div>
  );
}

export { PurpleBanner };
