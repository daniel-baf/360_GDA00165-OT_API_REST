type SettingsTypes = {
  MAX_PRODUCTS_DISPLAYED: number;
  NUM_MAYORIST: number;
  CURRENCY_SYMBOL: string;
  API_URL: string;
  TITLE: string;
  MAX_ITEMS_PER_LONG_LIST: number;
};

export const Settings: SettingsTypes = {
  MAX_PRODUCTS_DISPLAYED: 7,
  MAX_ITEMS_PER_LONG_LIST: 100,
  NUM_MAYORIST: 12,
  CURRENCY_SYMBOL: "GTQ ",
  API_URL: "http://localhost:4000/api",
  TITLE: "MiTiendita",
};
