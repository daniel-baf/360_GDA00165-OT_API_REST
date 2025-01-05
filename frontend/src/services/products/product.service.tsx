import { API_ENDPOINTS } from "@helpers/API.enum";
import { Product } from "@components/user/client/products/product.types";

/**
 * Fetches a list of products from the API.
 *
 * @param {string} token - Authentication token.
 * @param {number} maxProducts - Maximum number of products to fetch.
 * @param {number} offset - Offset for pagination.
 * @returns {Promise<Product[]>} A promise that resolves to an array of products.
 * @throws {Error} If the token is not provided.
 * @throws {Error} If the API response is not successful.
 */
async function fetchProducts(
  token: string,
  maxProducts: number = 10,
  offset: number = 0
): Promise<Product[]> {
  if (!token) {
    throw new Error("Token no proporcionado.");
  }

  const response = await fetch(
    API_ENDPOINTS.PRODUCTS.LIST.LIM_OFFSET(maxProducts, offset),
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const products: Product[] = await response.json();
  return products;
}

export { fetchProducts };
