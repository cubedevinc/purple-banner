import { getISODate } from "./date.js";

const currentISODate = getISODate();

const query = `
  {
    purpleBannerCollection(
      where: {
        AND: [
          {start_lte: "${currentISODate}"},
          {end_gte: "${currentISODate}"}
        ]
      },
      order: [end_ASC],
      limit: 1
    ) {
      items {
        message,
        link,
        campaign,
        sys {
          id
        }
      }
    }
  }
`;

function parseEvents(rawEvents) {
  return rawEvents.map(({ sys, ...rest }) => ({
    ...rest,
    id: sys.id,
  }));
}

async function loadEvents() {
  const response = await fetch(process.env.CONTENTFUL_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.CONTENTFUL_AUTH_TOKEN}`,
    },
    body: JSON.stringify({ query }),
  });

  const { data, errors } = await response.json();

  if (errors) {
    throw errors;
  }

  return parseEvents(data.purpleBannerCollection.items);
}

export { loadEvents };
