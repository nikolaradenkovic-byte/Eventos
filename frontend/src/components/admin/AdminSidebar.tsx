import { NavLink, useNavigate } from "react-router-dom";
import Button from "../global/Button";
import AuthContext from "../../context/AuthContext";
import { useContext } from "react";

function AdminSidebar() {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("OrganizerSideBar mroa biti unutar AuthProvider-a.");
  }

  const { currentUser, setCurrentUser } = authContext;

  function handleLogout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setCurrentUser(null);
    navigate("/");
  }

  return (
    <aside className="flex flex-col h-screen shrink-0 overflow-y-auto w-86 border-r border-[#C8C2C2] bg-white p-6 shadow-xl ">
      <nav className="flex flex-col gap-4">
        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `rounded-xl px-4 py-3 transition ${
              isActive
                ? "bg-[#E98400] text-white"
                : "text-[#333333] hover:bg-[#FFF3E3]"
            }`
          }
        >
          Pregled korisnika
        </NavLink>
      </nav>

      <Button
        type="button"
        label="Odjavi se"
        onClick={handleLogout}
        className="mt-auto w-full rounded-lg px-4 py-3 text-left cursor-pointer"
      />
    </aside>
  );
}
export default AdminSidebar;
