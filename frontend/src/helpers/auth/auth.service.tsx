import { jwtDecode } from "jwt-decode";

export interface PublicTokenPayload {
  user: {
    nombre_completo: string;
    rol_id: number;
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
    console.log("UNABLE TO DECODE TOKEN" + `${error}`);
  }
  return null;
};

// Función para obtener solo la información pública (sin `name`)
const getTokenDecoded = (token: string): PublicTokenPayload["user"] | null => {
  const payload = decode(token);
  return payload?.user || null;
};

export { getTokenDecoded };
