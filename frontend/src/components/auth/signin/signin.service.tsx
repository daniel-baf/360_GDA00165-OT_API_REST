import { API_ENDPOINTS } from "../../../helpers/API.enum";

// src/services/auth/signin.service.ts
export interface SignInFormData {
  email: string;
  password: string;
  remember?: boolean;
}

// Define la estructura esperada del JSON de respuesta
interface SignInResponse {
  token: string;
  rol_id: number;
}

// La función retorna una Promesa que resuelve con un objeto SignInResponse
export const signInService = async (
  data: SignInFormData
): Promise<SignInResponse> => {
  const response = await fetch(API_ENDPOINTS.AUTH.SIGNIN, {
    method: "POST", // Especifica el método HTTP (POST)
    headers: {
      "Content-Type": "application/json", // Indica que envías JSON
    },
    body: JSON.stringify(data), // Convierte los datos a una cadena JSON
  });

  if (!response.ok) {
    // Lanza una excepción si el servidor responde con un error
    throw new Error(
      "No se ha podido iniciar sesión, verifique sus credenciales"
    );
  }

  const result: SignInResponse = await response.json(); // Analiza la respuesta como JSON
  return result; // Devuelve la respuesta parseada
};
