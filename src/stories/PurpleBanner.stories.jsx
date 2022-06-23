import React from "react";

import { PurpleBanner as Component } from "../PurpleBanner";

export default {
  title: "PurpleBanner",
  component: Component,
  argTypes: {
    source: {
      name: "UTM source",
      defaultValue: "source",
      type: {
        name: "string",
        required: true,
      },
    },
  },
};

export const PurpleBanner = () => <Component />;
