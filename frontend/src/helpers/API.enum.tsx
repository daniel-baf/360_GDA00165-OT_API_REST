const API_URL = "http://localhost:4000/api";

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
        `${API_URL}/product/list/${limit}/${offset}`,
    },
  },
};
