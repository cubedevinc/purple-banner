import { getDate } from "./date";

function setUTM(link: string, source: string, campaign: string | null) {
  const url = new URL(link);

  url.searchParams.set("utm_medium", "purple");
  url.searchParams.set("utm_source", source);
  url.searchParams.set(
    "utm_campaign",
    campaign === null ? getDate() : campaign
  );

  return url.toString();
}

export { setUTM };
