import { getDate } from "./date";

function setUTM(link, source, campaign) {
  const url = new URL(link);

  url.searchParams.set("utm_medium", "purple");
  url.searchParams.set("utm_source", source);
  url.searchParams.set("utm_campaign", campaign === null ? getDate() : campaign);

  return url;
}

export { setUTM };
