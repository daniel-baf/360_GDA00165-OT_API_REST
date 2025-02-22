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
    SEARCH: (filters: {
      category?: string;
      name?: string;
      id?: number;
    }) => string;
    CREATE: string;
    DELETE: (id: number) => string;
    CATEGORY: {
      LIST_ALL: string;
    };
    UPDATE: (id: number) => string;
  };
  STATUS: {
    USER: {
      LIST: string;
      ENABLE: (id: number) => string;
      DISABLE: (id: number) => string;
    };
  };
  ORDERS: {
    CREATE: string;
    DELETE: (orderId: number) => string;
    SEARCH: (orderId: number) => string;
    UPDATE: (orderId: number) => string;
    LIST: {
      BY_USER: (
        userId: number,
        detailed: boolean,
        offset: number,
        limit: number | undefined
      ) => string;
      ALL: {
        LIMIT_OFFSET: (offset: number, limit: number | undefined) => string;
      };
    };
    STATUS: {
      UPDATE: (orderId: number, statusId: number) => string;
    };
  };
  USER: {
    DIRECTIONS: {
      LIST: (userId?: number, offset?: number, limit?: number) => string;
    };
    LIST: (offset: number, limit: number) => string;
    CREATE: string;
    DELETE: (id: number) => string;
  };
};

export const API_ENDPOINTS: ApiEndpoints = {
  AUTH: {
    SIGNIN: `${API_URL}/auth/`,
    SIGNUP: `${API_URL}/auth/signup`,
  },
  STATUS: {
    USER: {
      LIST: `${API_URL}/states/user/list`,
      ENABLE: (id: number) => `${API_URL}/user/unlock/${id}`,
      DISABLE: (id: number) => `${API_URL}/user/block/${id}`,
    },
  },
  PRODUCTS: {
    LIST: {
      ALL: `${API_URL}/products`,
      LIM_OFFSET: (limit: number = 50, offset: number = 0) =>
        `${API_URL}/product/list?limit=${limit}&offset=${offset}`,
    },
    CREATE: `${API_URL}/product/category/create/`,
    DELETE: (id: number) => `${API_URL}/product/category/delete/${id}`,
    UPDATE: (id: number) => `${API_URL}/product/category/update/${id}`,
    CATEGORY: {
      LIST_ALL: `${API_URL}/product/category/list`,
    },
    SEARCH: ({ category = "", name = "", id }) => {
      const params = new URLSearchParams();
      if (category) params.append("category", category);
      if (name) params.append("name", name);
      if (id !== undefined) params.append("id", id.toString());
      return `${API_URL}/product/search?${params.toString()}`;
    },
  },
  ORDERS: {
    CREATE: `${API_URL}/order/create/`,
    DELETE: (orderId: number) => `${API_URL}/order/delete/${orderId}`,
    SEARCH: (orderId: number) =>
      `${API_URL}/order/search/${orderId}?detailed=true`,
    UPDATE: (orderId: number) => `${API_URL}/order/update/${orderId}`,
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
      ALL: {
        LIMIT_OFFSET: (offset: number = 0, limit: number | undefined) =>
          `${API_URL}/order/list?detailed=true&${
            limit ? `&limit=${limit}` : ""
          }${offset ? `&offset=${offset}` : ""}`,
      },
    },

    STATUS: {
      UPDATE: (orderId: number, statusId: number) =>
        `${API_URL}/order/swapState/?id=${orderId}&status=${statusId}`,
    },
  },
  USER: {
    DIRECTIONS: {
      LIST: (userId?: number, offset?: number, limit?: number) =>
        `${API_URL}/user/direction/list?${
          userId ? `usuario_id=${userId}` : ""
        }${limit ? `&limit=${limit}` : ""}${offset ? `&offset=${offset}` : ""}`,
    },
    DELETE: (id: number) => `${API_URL}/user/delete/${id}`,
    CREATE: `${API_URL}/user/create/`,
    LIST: (offset: number = 0, limit: number) =>
      `${API_URL}/user/list?offset=${offset}${limit ? `&limit=${limit}` : ""}`,
  },
};
