export interface SignUpProps {
  switchToSignIn: () => void;
}

export type SignUpFormData = {
  email: string;
  nombre_completo: string;
  password: string;
  telefono?: string;
  NIT?: string | null;
  fecha_nacimiento: string; // Cambiado a string porque React Hook Form no maneja Date directamente
  terms: boolean;
};
