import React, { useContext, useState } from "react";
import { login } from "../api/authService";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/global/Button";
import AuthContext from "../context/AuthContext";
import { AuthStatus } from "../shared/constants/AuthStatus";
import { getUser } from "../api/userService";
import heroImage from "../images/hero.jpg";
import Input from "../components/global/Input";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  const navigate = useNavigate();

  const organizerRoleId = "22FEA888-84E5-49C5-9953-9B94FAA386A2";

  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("LoginPage mora biti unutar AuthContext.Provider-a");
  }

  const { setCurrentUser } = authContext;

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoginLoading(true);
    const authStatus = await login({ email, password });
    setIsLoginLoading(false);

    if (authStatus === AuthStatus.AUTHORIZED) {
      // pozovi get user
      const user = await getUser();

      setCurrentUser(user);
      console.log(user);
      switch (user.roleId) {
        case "216e50f0-b90c-428c-85f3-a35d2d3f2a5a":
          navigate("/organizer/events");
          break;
        case "28a9697e-4b45-4e31-a17e-f598c9505e33":
          navigate("/admin/users");
          break;
        case "d75ac8f5-3521-4d77-9f42-72f147f32199":
          console.log("Kontroler");
          navigate("/controller");
          break;

        default:
          navigate("/");
          break;
      }
    } else if (authStatus === AuthStatus.UNAUTHORIZED) {
      setError("Pogrešan e-mail ili lozinka.");
      setPassword("");
    } else {
      setError("Doslo je do neočekivane greske.");
    }
  }

  return (
    <main className="relative min-h-screen ">
      <img
        src={heroImage}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-black/65" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-8 py-12 shadow-2xl sm:px-8 sm:py-10 lg:px-10">
        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-[400px] flex-col gap-6 rounded-lg bg-white px-8 py-10 "
        >
          <h1 className="mt-15 mb-7 text-center text-4xl font-semibold text-[#4D4D4D]">
            Prijavi se
          </h1>

          <div className="flex flex-col gap-2">
            <Input
              id="email"
              type="email"
              value={email}
              placeholder="Email"
              onChange={(event) => setEmail(event.target.value)}
              inputClassName="h-12 w-full rounded border border-[#ADADAD] px-4 text-sm text-black placeholder:text-[#ADADAD] outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <Input
              id="password"
              type="password"
              value={password}
              placeholder="Lozinka"
              onChange={(event) => setPassword(event.target.value)}
              inputClassName="h-12 w-full rounded border border-[#ADADAD] px-4 text-sm text-black placeholder:text-[#ADADAD] outline-none"
            />
          </div>

          {error && <p className="text-center text-sm text-red-600">{error}</p>}

          {isLoginLoading ? (
            <div className="flex flex-col justify-center items-center cursor-pointer h-[48px] bg-[#E98400] p-2 rounded-[5px] text-white font-semibold mt-6">
              <div className="h-5 w-5 animate-spin rounded-full border-4 border-white/30 border-t-white" />
            </div>
          ) : (
            <Button
              type="submit"
              className="cursor-pointer h-[48px] bg-[#E98400] p-2 rounded-[5px] text-white font-semibold mt-6"
              label="Nastavi"
            />
          )}

          <p className="mt-1 text-s text-[#4D4D4D] mb-10">
            Nemate nalog?{" "}
            <Link
              to="/register"
              className="border-b border-[#4D4D4D] font-semibold"
            >
              Registruj se
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}

export default LoginPage;
