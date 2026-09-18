import { Link, useNavigate } from "react-router-dom";
import NavBar from "./Navbar";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import logo from "../../assets/logo.svg";
import userIcon from "../../assets/icons/userIcon.svg";
import cartIcon from "../../assets/icons/cartIcon.svg";
import CartContext from "../../context/CartContext";
import { useLocation } from "react-router-dom";

type HeaderProps = {
  isOverlay?: boolean;
};

function Header({ isOverlay = false }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage =
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/register";

  const isProfilePage = location.pathname === "/profile";
  const isUserTicketPage = location.pathname === "/profile/tickets";

  const authContext = useContext(AuthContext);
  const cartContext = useContext(CartContext);

  if (!authContext) {
    throw new Error("Header mora biti unutar AuthContext.Provider-a");
  }

  if (!cartContext) {
    throw new Error("Header mora biti unutar CartProvider-a.");
  }

  const { currentUser, setCurrentUser } = authContext;
  const { cartCount } = cartContext;

  function handleLogout() {
    setCurrentUser(null);

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    navigate("/");
  }

  return (
    <header
      className={`top-0 left-0 z-20 flex w-full h-16  text-white items-center justify-between 
        ${isHomePage ? "absolute bg-transparent" : "relative bg-[#181818]"} 
        ${isProfilePage || isUserTicketPage ? "px-8 lg:px-16" : "px-6 md:px-16 xl:px-60"}`}
    >
      <div className="flex items-center justify-center gap-10">
        <Link to="/">
          <img src={logo} alt="Logo" />
        </Link>

        <NavBar />
      </div>

      <div className="flex items-center justify-center gap-6">
        {currentUser ? (
          <>
            <Link to="/profile">
              <div className="flex justify-center items-center h-8 w-8 rounded-full bg-[#4A4A4A9E]">
                <img src={userIcon} alt="Profile icon" />
              </div>
            </Link>

            <Link
              to="/cart"
              className="relative flex justify-center items-center bg-[#4A4A4A9E] border border-[#3D3D3D] rounded-full h-8 w-8"
            >
              <div className="absolute -right-[6px] -top-[6px] rounded-full bg-white h-4 w-4 flex justify-center items-center text-black text-[12px]">
                {cartCount}
              </div>
              <img src={cartIcon} alt="cart" className="scale-125" />
            </Link>

            <div className="flex justify-center items-center bg-[#4A4A4A9E] px-4 py-1 text-[16px] rounded-full">
              <button
                type="button"
                onClick={handleLogout}
                className="cursor-pointer"
              >
                Odjavi se
              </button>
            </div>
          </>
        ) : (
          <>
            <Link
              to="/cart"
              className="relative flex justify-center items-center bg-[#4A4A4A9E] border border-[#3D3D3D] rounded-full h-8 w-8"
            >
              <div className="absolute -right-[6px] -top-[6px] rounded-full bg-white h-4 w-4 flex justify-center items-center text-black text-[12px]">
                {cartCount}
              </div>
              <img src={cartIcon} alt="cart" className="scale-125" />
            </Link>
            <div className="flex justify-center items-center bg-[#4A4A4A9E] px-4 py-1 text-[16px] rounded-full">
              <Link to="/login">Prijavi se</Link>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
export default Header;
