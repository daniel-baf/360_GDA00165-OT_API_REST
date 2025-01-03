import { Settings } from "CONFIGURATION";

const API_URL = Settings.API_URL;

type ApiEndpoints = {
  AUTH: {
    SIGNIN: string;
    SIGNUP: string;
  };
  PRODUCTS: {
    LIST: {
      ALL: string;
      LIM_OFFSET: (limit: number, offset: number) => string;
    };
  };
  ORDERS: {
    LIST: {
      BY_USER: (
        userId: number,
        detailed: boolean,
        offset: number,
        limit: number | undefined
      ) => string;
    };
  };
};

export const API_ENDPOINTS: ApiEndpoints = {
  AUTH: {
    SIGNIN: `${API_URL}/auth/`,
    SIGNUP: `${API_URL}/auth/signup`,
  },
  PRODUCTS: {
    LIST: {
      ALL: `${API_URL}/products`,
      LIM_OFFSET: (limit: number = 50, offset: number = 0) =>
        `${API_URL}/product/list?limit=${limit}&offset=${offset}`,
    },
  },
  ORDERS: {
    LIST: {
      BY_USER: (
        userId: number,
        detailed: boolean = false,
        offset: number = 0,
        limit: number | undefined
      ) =>
        `${API_URL}/order/list?target_user=${userId}${
          detailed ? `&detailed=${detailed}` : ""
        }${limit ? `&limit=${limit}` : ""}${offset ? `&offset=${offset}` : ""}`,
    },
  },
};
