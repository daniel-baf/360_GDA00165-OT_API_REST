import { Product } from "@components/user/client/products/product.types";
import {
  createContext,
  ReactNode,
  useState,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { NotificationContext } from "@context/Notification.context";
import { fetchProducts } from "@services/products/product.service";
import { AuthContext } from "@context/auth/signin/Signin.context";
import { Settings } from "CONFIGURATION";
import {
  getTokenDecoded,
  PublicTokenPayload,
} from "@helpers/auth/auth.service";

// Context type definitions
interface ClientPorductsGridType {
  products: Product[];
  loadProducts: (maxProducts?: number, offset?: number) => Promise<void>;
  loadMoreProducts: () => Promise<void>;
  token: string | null;
  token_decoded: PublicTokenPayload["user"] | null;
  max_products_shown: boolean;
  handleSearchProducts: (arg0: Product[]) => void;
}

// Provider props
interface ClientPorductsGridProviderProps {
  children: ReactNode;
}

// Create the context, initialize undefined to handle errors
const ClientPorductsGridContext = createContext<
  ClientPorductsGridType | undefined
>(undefined);

const ClientPorductsGridProvider: React.FC<ClientPorductsGridProviderProps> = ({
  children,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentOffset, setCurrentOffset] = useState(0); // Estado para controlar el offset
  const [max_products_shown, setMaxProductsShown] = useState(false);

  const CURRENT_LIMIT = Settings.MAX_PRODUCTS_DISPLAYED;

  const authContext = useContext(AuthContext);
  const messageManager = useContext(NotificationContext);
  const token = useMemo(() => authContext?.token ?? null, [authContext?.token]);
  const token_decoded = useMemo(() => {
    return token ? getTokenDecoded(token) : null;
  }, [token]);

  // Función para reiniciar productos y establecer un valor específico
  const handleSearchProducts = useCallback(
    async (newProducts: Product[]) => {
      setProducts(newProducts);
      setCurrentOffset(0);
      setMaxProductsShown(newProducts.length < CURRENT_LIMIT);
    },
    [CURRENT_LIMIT]
  );

  // Función para cargar productos
  const loadProducts = useCallback(
    async (maxProducts: number = CURRENT_LIMIT, offset: number = 0) => {
      if (!token) {
        return;
      }

      try {
        const data = await fetchProducts(token, maxProducts, offset);
        setProducts(data); // Establecer productos en estado
      } catch (error) {
        messageManager?.showError(`${error}`);
      }
    },
    [token, messageManager, CURRENT_LIMIT] // Depend on token and messageManager
  );

  // Función para cargar más productos (scroll infinito)
  const loadMoreProducts = useCallback(async () => {
    const newOffset = currentOffset + CURRENT_LIMIT; // Calcular el nuevo offset

    try {
      // Cargar más productos y agregarlos al estado actual
      const data = await fetchProducts(token!, CURRENT_LIMIT, newOffset);
      setProducts((prevProducts) => [...prevProducts, ...data]); // Agregar nuevos productos al estado
      setCurrentOffset(newOffset); // Actualizar el offset
      if (data.length < CURRENT_LIMIT) {
        messageManager?.showInfo(`No hay más productos para cargar`);
        setMaxProductsShown(true);
      }
    } catch (error) {
      console.error("Error al cargar más productos:", error);
    }
  }, [currentOffset, token, messageManager, CURRENT_LIMIT]); // Depend on currentOffset, token, and messageManager

  return (
    <ClientPorductsGridContext.Provider
      value={{
        products,
        loadProducts,
        loadMoreProducts,
        token,
        max_products_shown,
        token_decoded,
        handleSearchProducts,
      }}
    >
      {children}
    </ClientPorductsGridContext.Provider>
  );
};

// Custom hook for consuming the context
const useClientPorductsGridContext = () => {
  const context = useContext(ClientPorductsGridContext);
  if (!context) {
    throw new Error(
      "useClientContext debe ser usado dentro de un ClientContextProvider"
    );
  }
  return context;
};

export {
  ClientPorductsGridContext,
  ClientPorductsGridProvider,
  useClientPorductsGridContext,
};
