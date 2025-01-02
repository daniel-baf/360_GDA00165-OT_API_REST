import { jwtDecode } from "jwt-decode";

interface PublicTokenPayload {
  db_user: {
    nombre_completo: string;
    rol_id: number;
    estado_id: number;
    id: number;
  };
}

interface TokenPayload extends PublicTokenPayload {
  name: string;
  exp: number;
}

// Función para obtener el payload del token
const decode = (token: string): TokenPayload | null => {
  try {
    const decoded = jwtDecode<TokenPayload>(token);
    return decoded;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

// Función para obtener solo la información pública (sin `name`)
const getTokenDecoded = (
  token: string
): PublicTokenPayload["db_user"] | null => {
  const payload = decode(token);
  return payload?.db_user || null;
};

export { getTokenDecoded };
