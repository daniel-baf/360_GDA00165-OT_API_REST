import { useClientCart } from "@context/user/client/ClientCart.context";
import { FaShoppingCart } from "react-icons/fa";
import ClientCartSummary from "./subcomponentes/ClientCartSummary";

const ClientCart: React.FC = () => {
  const context = useClientCart();
  const { products } = context;

  if (products.length === 0) {
    return (
      <div className="flex-grow mx-auto flex items-center justify-center text-white">
        <div className="text-center p-6 bg-gray-800 shadow-md rounded-lg max-w-sm">
          <FaShoppingCart className="text-gray-400 text-6xl mb-4" />
          <h2 className="text-xl font-semibold text-gray-200">
            ¡Tu carrito está vacío!
          </h2>
          <p className="text-gray-400 mt-2">
            Agrega algunos productos para empezar a comprar.
          </p>
        </div>
      </div>
    );
  }

  return <ClientCartSummary products={products} />;
};

export default ClientCart;
