import { useState } from "react";
import { register } from "../api/authService";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/global/Input";
import Button from "../components/global/Button";
import heroImage from "../images/hero.jpg";

function RegisterPage() {
  const [firstName, setName] = useState("");
  const [lastName, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const [error, setError] = useState("");

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const isRegistered = await register({
      email,
      firstName,
      lastName,
      password,
    });

    if (isRegistered) {
      navigate("/login");
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
            Registruj se
          </h1>

          <Input
            id="name"
            type="text"
            value={firstName}
            placeholder="Ime"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setName(event.target.value)
            }
            inputClassName="h-12 w-full rounded border border-[#ADADAD] px-4 text-sm text-black placeholder:text-[#ADADAD] outline-none"
          />

          <Input
            id="lastname"
            type="text"
            value={lastName}
            placeholder="Prezime"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setLastname(event.target.value)
            }
            inputClassName="h-12 w-full rounded border border-[#ADADAD] px-4 text-sm text-black placeholder:text-[#ADADAD] outline-none"
          />

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

          <Button
            type="submit"
            className="cursor-pointer h-[48px] bg-[#E98400] p-2 rounded-[5px] text-white font-semibold mt-6"
            label="Nastavi"
          />

          <p className="mt-1 text-s text-[#4D4D4D] mb-10">
            Već imate nalog?{" "}
            <Link
              to="/login"
              className="border-b border-[#4D4D4D] font-semibold"
            >
              Prijavi se
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
export default RegisterPage;
