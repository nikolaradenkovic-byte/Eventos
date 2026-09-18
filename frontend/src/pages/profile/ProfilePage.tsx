import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthContext";
import Input from "../../components/global/Input";

function ProfilePage() {
  const authContext = useContext(AuthContext);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  if (!authContext) {
    throw new Error("ProfilePage mora biti unutar AuthProvider-a.");
  }

  const { currentUser, setCurrentUser } = authContext;

  useEffect(() => {
    if (currentUser) {
      setFirstName(currentUser.firstName);
      setLastName(currentUser.lastName);
      setEmail(currentUser.email);
    }
  }, [currentUser]);

  return (
    <div className="w-full max-w-5xl">
      <h1 className="mb-8 text-3xl font-semibold">Moj nalog</h1>

      <div className="grid grud-cols-1 gap-5 md:grid-cols-2">
        <Input
          label="Ime"
          id="firstName"
          type="text"
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
          inputClassName="h-12 w-full rounded border border-[#555555] bg-transparent px-4 text-white outline-none"
        />

        <Input
          label="Prezime"
          id="lastName"
          type="text"
          value={lastName}
          onChange={(event) => setLastName(event.target.value)}
          inputClassName="h-12 w-full rounded border border-[#555555] bg-transparent px-4 text-white outline-none"
        />

        <Input
          label="Email"
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="md:col-span-2"
          inputClassName="h-12 w-full rounded border border-[#555555] bg-transparent px-4 text-white outline-none"
        />
      </div>
    </div>
  );
}
export default ProfilePage;
