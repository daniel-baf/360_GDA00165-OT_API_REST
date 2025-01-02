import React, { useState } from "react";
import SignIn from "./signin/Signin";
import SignUp from "./signup/Signup";

const Home: React.FC = () => {
  const [isSigningIn, setIsSigningIn] = useState(true);

  const title = isSigningIn ? "Inicio de sesión" : "Registro";

  return (
    <section className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <a
        href="#"
        className="flex items-center mb-6 text-2xl font-semibold text-gray-200 dark:text-white"
      >
        <img
          src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
          alt="logo"
          className="w-8 h-8 mr-2"
        />
        MiTiendita
      </a>
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center p-4">
          {title}
        </h1>
        <div className="p-4">
          {isSigningIn ? (
            <SignIn switchToSignUp={() => setIsSigningIn(false)} />
          ) : (
            <SignUp switchToSignIn={() => setIsSigningIn(true)} />
          )}
        </div>
      </div>
    </section>
  );
};

export default Home;
