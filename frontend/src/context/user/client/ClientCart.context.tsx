import { Product } from "@components/user/client/products/product.types";
import {
  ReactNode,
  useState,
  createContext,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { NotificationContext } from "@context/Notification.context";
import { AuthContext } from "@context/auth/signin/Signin.context";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface ClientCartType {
  products: CartItem[];
  add: (product: Product) => void;
  remove: (product: Product) => void;
  clear: () => void;
  decrease: (product: Product) => void;
}

interface ClientCartProviderProps {
  children: ReactNode;
}

const CART_STORAGE_KEY = "cart";
const MESSAGES = {
  outOfStock: "No hay stock disponible",
  addedToCart: (name: string) => `${name} agregado al carrito`,
  removedFromCart: "Producto eliminado del carrito",
  cartCleared: "Carrito vacío",
};

const ClientCartContext = createContext<ClientCartType | undefined>(undefined);

const ClientCartProvider: React.FC<ClientCartProviderProps> = ({
  children,
}) => {
  const [products, setProducts] = useState<CartItem[]>([]);
  const authContext = useContext(AuthContext);
  const messageManager = useContext(NotificationContext);

  if (!authContext || !messageManager) {
    throw new Error("AuthContext and NotificationContext must be provided.");
  }

  const updateCart = (newProducts: CartItem[]) => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newProducts));
    setProducts(newProducts);
  };

  const findProductIndex = (id: number) =>
    products.findIndex((item) => item.product.id === id);

  const add = (product: Product) => {
    const index = findProductIndex(product.id);

    if (index === -1) {
      if (product.stock === 0) {
        messageManager.showInfo(MESSAGES.outOfStock);
        return;
      }
      updateCart([...products, { product, quantity: 1 }]);
      messageManager.showSuccess(MESSAGES.addedToCart(product.nombre));
      return;
    }

    const updatedProducts = [...products];
    const selectedProduct = updatedProducts[index];

    if (selectedProduct.quantity >= product.stock) {
      messageManager.showInfo(MESSAGES.outOfStock);
      return;
    }

    updatedProducts[index] = {
      ...selectedProduct,
      quantity: selectedProduct.quantity + 1,
    };
    updateCart(updatedProducts);
    messageManager.showSuccess(MESSAGES.addedToCart(product.nombre));
  };

  const remove = (product: Product) => {
    const updatedProducts = products.filter(
      (item) => item.product.id !== product.id
    );
    updateCart(updatedProducts);
    messageManager.showInfo(MESSAGES.removedFromCart);
  };

  const decrease = (product: Product) => {
    const index = findProductIndex(product.id);

    if (index === -1) return;

    const updatedProducts = [...products];
    const selectedProduct = updatedProducts[index];

    if (selectedProduct.quantity === 1) {
      remove(product);
      return;
    }

    updatedProducts[index] = {
      ...selectedProduct,
      quantity: selectedProduct.quantity - 1,
    };
    updateCart(updatedProducts);
  };

  const clear = () => {
    updateCart([]);
    messageManager.showInfo(MESSAGES.cartCleared);
  };

  useEffect(() => {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (storedCart) {
      try {
        const parsedCart: Partial<CartItem[]> = JSON.parse(storedCart);
        if (Array.isArray(parsedCart)) {
          setProducts(parsedCart as CartItem[]);
        }
      } catch {
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    }
  }, [authContext.token]);

  const contextValue = useMemo(
    () => ({
      products,
      add,
      remove,
      clear,
      decrease,
    }),
    [products]
  );

  return (
    <ClientCartContext.Provider value={contextValue}>
      {children}
    </ClientCartContext.Provider>
  );
};

const useClientCart = (): ClientCartType => {
  const context = useContext(ClientCartContext);
  if (!context) {
    throw new Error("useClientCart must be used within a ClientCartProvider");
  }
  return context;
};

export { ClientCartProvider, useClientCart };
