import { ProductCategory } from "@components/user/client/products/product.types";
import { API_ENDPOINTS } from "@helpers/API.enum";

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

export { fetchProductsCategory };
