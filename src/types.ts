export interface Event {
  slug: string;
  dateTime: string;
  duration: number;
  title: string;
}

export interface EventBanner {
  id: number;
  link: string;
  message: string;
  campaign: string;
  event?: Event;
}

export interface RawEventBanner extends Omit<EventBanner, "id"> {
  sys: {
    id: string;
  };
}
