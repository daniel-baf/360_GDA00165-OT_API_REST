import { Product } from "@components/user/client/products/product.types";
import { ReactNode, useState, createContext, useContext } from "react";
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

const ClientCartContext = createContext<ClientCartType | undefined>(undefined);

const ClientCartProvider: React.FC<ClientCartProviderProps> = ({
  children,
}) => {
  const [products, setProducts] = useState<CartItem[]>([]);

  const authContext = useContext(AuthContext);
  const messageManager = useContext(NotificationContext);

  if (!authContext || !messageManager) {
    return <div>Loading...</div>; // Graceful error handling
  }

  const add = (product: Product) => {
    const index = products.findIndex((p) => p.product.id === product.id);

    if (index === -1 && product.stock === 0) {
      messageManager.showInfo("No hay stock disponible");
      return;
    }

    if (index === -1) {
      setProducts([...(products || []), { product, quantity: 1 }]);
      return;
    }

    const pre_product = products[index];
    if (pre_product.quantity >= product.stock) {
      messageManager.showInfo("No hay stock disponible");
      return;
    }

    pre_product.quantity += 1;
    setProducts([...products]);
  };

  const remove = (product: Product) => {
    const newProducts = products.filter((p) => p.product.id !== product.id);
    messageManager.showInfo("Producto eliminado del carrito");
    setProducts(newProducts);
  };

  const decrease = (product: Product) => {
    const index = products.findIndex((p) => p.product.id === product.id);
    if (index === -1) {
      return;
    }
    const pre_product = products[index];
    if (pre_product.quantity === 1) {
      remove(product);
      return;
    }
    pre_product.quantity -= 1;
    setProducts([...products]);
  };

  const clear = () => {
    setProducts([]);
  };

  return (
    <ClientCartContext.Provider
      value={{ products, add, remove, clear, decrease }}
    >
      {children}
    </ClientCartContext.Provider>
  );
};

// Correctly export the context and provider
export { ClientCartProvider, ClientCartContext };
