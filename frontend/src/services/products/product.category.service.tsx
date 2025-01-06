import { ProductCategory } from "@components/user/client/products/product.types";
import { API_ENDPOINTS } from "@helpers/API.enum";

/**
 * Fetches the list of product categories from the API.
 *
 * @param {string} token - The authentication token to be used in the request.
 * @returns {Promise<ProductCategory[]>} A promise that resolves to an array of product categories.
 * @throws Will throw an error if the fetch request fails.
 */
async function fetchProductsCategory(
  token: string
): Promise<ProductCategory[]> {
  if (!token) {
    return []; // Return an empty array if no token is provided
  }

  const response = await fetch(API_ENDPOINTS.PRODUCTS.CATEGORY.LIST_ALL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.log("NO DIO: " + token);

    throw new Error(await response.text());
  }

  const products: ProductCategory[] = await response.json();
  return products;
}

/**
 * Sends a POST request to create a new product category.
 *
 * @param {string} token - The authorization token to be included in the request headers.
 * @param {Object} data - The data for the new product category.
 * @param {string} data.nombre - The name of the product category.
 * @param {string} data.descripcion - The description of the product category.
 *
 * @returns {Promise<Object>} The response data from the API.
 *
 * @throws {Error} If the response is not ok, throws an error with the response text.
 */
async function fetchCreateProductCategory(
  token: string,
  data: { nombre: string; descripcion: string }
): Promise<ProductCategory> {
  const response = await fetch(API_ENDPOINTS.PRODUCTS.CREATE, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return await response.json();
}

async function fetchDeleteProductCategory(
  token: string,
  id: number
): Promise<ProductCategory> {
  const response = await fetch(API_ENDPOINTS.PRODUCTS.DELETE(id), {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return await response.json();
}
export { fetchProductsCategory, fetchCreateProductCategory, fetchDeleteProductCategory };
