import { useContext } from "react";
import { NavLink } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import Button from "../global/Button";
import { useNavigate } from "react-router-dom";
import logoEventos from "../../images/Union.png";

function OrganizerSideBar() {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("OrganizerSideBar mroa biti unutar AuthProvider-a.");
  }

  const { currentUser, setCurrentUser } = authContext;

  const initial = currentUser?.firstName?.charAt(0).toUpperCase() ?? "O";

  const linkClassName = ({ isActive }: { isActive: boolean }) =>
    `block  px-4 py-3 transition-colors ${
      isActive
        ? "bg-[#EAEAEA] font-semibold text-[#333333]"
        : "text-[#777777] hover:bg-[#F3F3F3]"
    }`;

  function handleLogout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setCurrentUser(null);
    navigate("/");
  }
  return (
    <aside className="flex flex-col h-screen shrink-0 overflow-y-auto z-10 w-full border-b border-[#C8C2C2] bg-white p-4 text-lg md:min-h-screen md:w-86 md:border-b-0 md:border-r md:shadow-[12px_0_25px_rgba(0,0,0,0.14)]">
      <div className="flex h-[50px] items-start pl-2 pb-">
        {/* <img src={eventosLogo} alt="Eventos" className="scale-60 opacity-75" /> */}
      </div>

      <div className=" flex items-center gap-5 pb-5">
        {/* <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-mauve-300 text-xl font-semibold text-white">
          {logoEventos}
        </div> */}
        <img src={logoEventos} />

        <div className="min-w-0">
          <p className="truncate text-sm  text-[#181818]">
            {currentUser
              ? `${currentUser.firstName} ${currentUser.lastName}`
              : "Organizator"}
          </p>

          {/* <p className="mt-1 truncate text-sm text-[#A7A7A7]">
            {currentUser?.email}
          </p> */}
        </div>
      </div>

      <div className="mb-8 h-px w-full bg-[#4B5563]" />

      <nav className="flex flex-col -mx-4">
        <NavLink to="/organizer/events" end className={linkClassName}>
          Pregled događaja
        </NavLink>

        <NavLink to="/organizer/events/create" className={linkClassName}>
          Kreiraj novi događaj
        </NavLink>

        <NavLink to="/organizer/events/statistics" className={linkClassName}>
          Statistika događaja
        </NavLink>

        <NavLink to="/" className={linkClassName}>
          Pogledaj javnu stranicu
        </NavLink>
      </nav>

      <div className="-mx-4 -mb-4 mt-auto">
        <Button
          type="button"
          label="Odjavi se"
          onClick={handleLogout}
          className=" w-full flex cursor-pointer bg-[#EAEAEA] items-center justify-center h-[48px]  text-xl text-black transition-all duration-200 hover:bg-[#D8D8D8]"
        />
      </div>
    </aside>
  );
}
export default OrganizerSideBar;
