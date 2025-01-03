import React from "react";
import { UseFormRegister, FormState, SubmitHandler } from "react-hook-form";
import { InputField, Checkbox, Button } from "../../forms/Form";
import { SignUpFormData, SignUpProps } from "@services/users/signup.types";

interface SignUpFormProps {
  register: UseFormRegister<SignUpFormData>;
  errors: FormState<SignUpFormData>["errors"];
  handleSubmit: (
    onSubmit: SubmitHandler<SignUpFormData>
  ) => (e?: React.BaseSyntheticEvent) => void;
  onSubmit: SubmitHandler<SignUpFormData>;
  switchToSignIn: SignUpProps["switchToSignIn"];
}

const SignUpForm: React.FC<SignUpFormProps> = ({
  register,
  errors,
  handleSubmit,
  onSubmit,
  switchToSignIn,
}) => (
  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
    <InputField
      id="email_id"
      name="email"
      type="email"
      label="Correo Electrónico"
      placeholder="correo@dominio.com"
      registration={register("email")}
      error={errors.email}
    />
    <InputField
      id="nombre_completo_id"
      name="nombre_completo"
      label="Nombre Completo"
      type="text"
      placeholder="Juan Perez"
      registration={register("nombre_completo")}
      error={errors.nombre_completo}
    />
    <InputField
      id="password_id"
      name="password"
      label="Contraseña"
      type="password"
      placeholder="********"
      registration={register("password")}
      error={errors.password}
    />
    <div className="flex space-x-4">
      <InputField
        id="telefono_id"
        name="telefono"
        label="Teléfono"
        type="tel"
        placeholder="12345678"
        registration={register("telefono")}
        error={errors.telefono}
      />
      <InputField
        id="NIT_id"
        name="NIT"
        label="NIT"
        type="text"
        placeholder="111123a"
        registration={register("NIT")}
        error={errors.NIT}
      />
    </div>
    <InputField
      id="fecha_nacimiento"
      name="fecha_nacimiento"
      label="Fecha de Nacimiento"
      type="date"
      placeholder="dd/mm/aaaa"
      registration={register("fecha_nacimiento")}
      error={errors.fecha_nacimiento}
    />
    <Checkbox
      id="terms"
      label="Acepto los términos y condiciones"
      registration={register("terms")}
      error={errors.terms}
    />
    <Button type="submit" label="Crear cuenta" />
    <p className="text-sm font-light text-gray-500 dark:text-gray-400">
      ¿Ya tienes cuenta?{" "}
      <a
        href="#"
        className="font-medium text-primary-600 hover:underline dark:text-primary-500"
        onClick={(e) => {
          e.preventDefault();
          switchToSignIn();
        }}
      >
        Iniciar sesión
      </a>
    </p>
  </form>
);

export default SignUpForm;
