import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";
import Button from "../global/Button";

function ProfileSidebar() {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  if (!authContext) {
    throw new Error("ProfileSidebar mora biti unutar AuthProvider-a.");
  }

  const { setCurrentUser } = authContext;

  const linkClassName = ({ isActive }: { isActive: boolean }) =>
    `block border-b border-[#444444] px-6 py-4 transition-colors ${
      isActive ? "bg-[#3A3A3A] text-white" : "text-[#CCCCCC] hover:bg-[#2A2A2A]"
    }`;

  function handleLogout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    setCurrentUser(null);
    navigate("/");
  }

  return (
    <aside className="w-full border-r border-[#444444] bg-[#181818] md:w-64">
      <nav className="flex flex-col pt-25">
        <NavLink to="/profile" end className={linkClassName}>
          Moj nalog
        </NavLink>

        <NavLink to="/profile/tickets" className={linkClassName}>
          Moje karte
        </NavLink>

        <Button
          type="button"
          label="Odjavi se"
          onClick={handleLogout}
          className="mt-auto w-full rounded-lg px-4 py-3 text-left cursor-pointer"
        />
      </nav>
    </aside>
  );
}
export default ProfileSidebar;
