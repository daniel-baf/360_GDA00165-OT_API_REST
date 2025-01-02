import React from "react";

interface ClientOrderGridProps {
  orders?: [];
}

const ClientOrderGrid: React.FC<ClientOrderGridProps> = () => {
  return (
    <div className="flex-grow container mx-auto text-stone-200">
      <h1 className="text-4xl font-bold text-center my-4">Ordenes</h1>
      <p>
        Resumen de las ordenes que haz hecho, ordenadas por fecha, solamente
        puedes{" "}
        <span className="bg-yellow-200 text-black px-2 py-1 rounded-full">
          cancelar
        </span>{" "}
        las que no hayan sido{" "}
        <span className="bg-yellow-200 text-black px-2 py-1 rounded-full">
          aprobadas
        </span>
      </p>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {/* {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.name}</td>
              <td>{order.quantity}</td>
              <td>{order.price}</td>
            </tr>
          ))} */}
        </tbody>
      </table>
    </div>
  );
};

export default ClientOrderGrid;
