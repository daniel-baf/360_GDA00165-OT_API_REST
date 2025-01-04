import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signUpSchema } from "./signup.validatons";
import { SignUpFormData, SignUpProps } from "@services/users/signup.types";
import SignUpForm from "./signup.form";
import { fetchPutNewUser } from "@services/users/users.service";
import { useNotification } from "@context/Notification.context";

const SignUp: React.FC<SignUpProps> = ({ switchToSignIn }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: yupResolver(signUpSchema),
  });
  const notifContext = useNotification();

  const onSubmit: SubmitHandler<SignUpFormData> = (data) => {
    fetchPutNewUser(data)
      .then(() => {
        notifContext.showSuccess(
          "Usuario creado exitosamente, debes verificar tu usuario"
        );
      })
      .catch((err: string) => {
        notifContext.showError(`El servidor no pudo crear un usuario: ${err}`);
      });
  };

  return (
    <div className="p-6 space-y-6 sm:p-8 ">
      <SignUpForm
        register={register}
        errors={errors}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        switchToSignIn={switchToSignIn}
      />
    </div>
  );
};

export default SignUp;
