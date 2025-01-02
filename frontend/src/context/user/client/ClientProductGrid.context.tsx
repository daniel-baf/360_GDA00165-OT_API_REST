import { createContext, ReactNode, useState, useContext } from "react";
import { Product } from "../../../components/user/client/products/product.types";
import { AuthContext } from "../../auth/signin/Signin.context";
import { fetchProducts } from "../../../services/products/product.service";
import { NotificationContext } from "../../Notification.context";
import { Settings } from "../../../helpers/CONFIGURATION.enum";

// Context type definitions
interface ClientContextType {
  products: Product[];
  loadProducts: (maxProducts?: number, offset?: number) => Promise<void>;
  loadMoreProducts: () => Promise<void>;
  token: string | null;
  max_products_shown: boolean;
}

// Provider props
interface ClientContextProviderProps {
  children: ReactNode;
}

// Create the context, initialize undefined to handle errors
const ClientContext = createContext<ClientContextType | undefined>(undefined);

const ClientContextProvider: React.FC<ClientContextProviderProps> = ({
  children,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentOffset, setCurrentOffset] = useState(0); // Estado para controlar el offset
  const [max_products_shown, setMaxProductsShown] = useState(false);

  const CURRENT_LIMIT = Settings.MAX_PRODUCTS_DISPLAYED;

  const authContext = useContext(AuthContext);
  const messageManager = useContext(NotificationContext);

  if (!authContext) {
    throw new Error("El contexto de autenticación no está definido");
  }

  const { token } = authContext;

  // Función para cargar productos
  const loadProducts = async (
    maxProducts: number = CURRENT_LIMIT,
    offset: number = 0
  ) => {
    if (!token) {
      return;
    }

    try {
      const data = await fetchProducts(token, maxProducts, offset);
      setProducts(data); // Establecer productos en estado
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };

  // Función para cargar más productos (scroll infinito)
  const loadMoreProducts = async () => {
    const newOffset = currentOffset + CURRENT_LIMIT; // Calcular el nuevo offset
    console.log(
      `Cargando más productos desde ${newOffset} hasta ${
        newOffset + CURRENT_LIMIT
      }`
    );

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
  };

  return (
    <ClientContext.Provider
      value={{
        products,
        loadProducts,
        loadMoreProducts,
        token,
        max_products_shown,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
};

// Custom hook for consuming the context
const useClientContext = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error(
      "useClientContext debe ser usado dentro de un ClientContextProvider"
    );
  }
  return context;
};

export { ClientContext, ClientContextProvider, useClientContext };
