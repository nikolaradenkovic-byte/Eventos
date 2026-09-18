import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminPage from "./pages/admin/AdminPage";
import AdminLayout from "./pages/admin/AdminLayout";
import { useContext, useEffect } from "react";
import RegisterPage from "./pages/RegisterPage";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import EventDetailsPage from "./pages/EventDetailsPage";
import EventPage from "./pages/EventPage";
import CartPage from "./pages/CartPage";
import { getUser } from "./api/userService";
import AuthContext from "./context/AuthContext";
import CheckoutPage from "./pages/CheckoutPage";
import OrganizerLayout from "./pages/organizer/OrganizerLayout";
import OrganizerEventsPage from "./pages/organizer/OrganizerEventsPage";
import CreateEventPage from "./pages/organizer/CreateEventPage";
import ProfilePage from "./pages/profile/ProfilePage";
import UserTicketsPage from "./pages/profile/UserTicketsPage";
import ProfileLayout from "./pages/profile/ProfileLayout";
import EventEditingPage from "./pages/organizer/EventEditPage";
import { Toaster } from "react-hot-toast";
import OrganizerEventsStatisticsPage from "./pages/organizer/OrganizerEventsStatisticsPages";
import EventSalesDetailsPage from "./pages/organizer/EventSalesDetailsPage";
import ControllerPage from "./pages/controllor/ControllerPage";

function App() {
  const authContext = useContext(AuthContext);
  const location = useLocation();

  const isOrganizerPage = location.pathname.startsWith("/organizer");
  const isAdminPage = location.pathname.startsWith("/admin");
  const isLoginPage = location.pathname.startsWith("/login");
  const isRegisterPage = location.pathname.startsWith("/register");
  const isProfilePage = location.pathname.startsWith("/profile");

  //const [error, setError] = useState("");

  if (!authContext) {
    throw new Error("App mora biti unutar AuthProvider-a");
  }

  const { currentUser, setCurrentUser, isLoading, setIsLoading } = authContext;

  useEffect(() => {
    async function getCurrentUser() {
      try {
        const user = await getUser();
        setCurrentUser(user);
      } catch (error) {
        console.error("Greška pri učitavanju korisnika.", error);
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    if (localStorage.getItem("accessToken")) {
      getCurrentUser();
    }
  }, [setCurrentUser, setIsLoading]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-[#181818]" />
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col min-h-screen ${
        isOrganizerPage || isAdminPage ? "bg-[#232323]" : "bg-[#1A1A1A]"
      }`}
    >
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#ffffff",
            color: "#181818",
          },
        }}
      />

      {!isOrganizerPage && !isAdminPage && !isProfilePage && <Header />}

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/events" element={<EventPage />} />
          <Route path="/event/:id" element={<EventDetailsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/profile" element={<ProfileLayout />}>
            <Route index element={<ProfilePage />} />
            <Route path="tickets" element={<UserTicketsPage />} />
          </Route>
          <Route
            path="/admin"
            element={
              <ProtectedRoute
                element={<AdminLayout />}
                allowedRoleIds={["28a9697e-4b45-4e31-a17e-f598c9505e33"]}
                userRoleId={currentUser?.roleId ?? ""}
                isLoading={isLoading}
              ></ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="users" replace />} />
            <Route path="users" element={<AdminPage />} />
          </Route>

          <Route
            path="/organizer"
            element={
              <ProtectedRoute
                element={<OrganizerLayout />}
                allowedRoleIds={["216e50f0-b90c-428c-85f3-a35d2d3f2a5a"]}
                userRoleId={currentUser?.roleId ?? ""}
                isLoading={isLoading}
              />
            }
          >
            <Route index element={<Navigate to="events" replace />} />
            <Route path="events" element={<OrganizerEventsPage />} />
            <Route path="events/create" element={<CreateEventPage />} />
            <Route
              path="events/statistics"
              element={<OrganizerEventsStatisticsPage />}
            />
            <Route path="events/:id/edit" element={<EventEditingPage />} />
            <Route
              path="events/:id/sales"
              element={<EventSalesDetailsPage />}
            />
          </Route>

          <Route
            path="/controller"
            element={
              <ProtectedRoute
                element={<ControllerPage />}
                allowedRoleIds={["d75ac8f5-3521-4d77-9f42-72f147f32199"]}
                userRoleId={currentUser?.roleId ?? ""}
                isLoading={isLoading}
              />
            }
          />
        </Routes>
      </main>

      {!isOrganizerPage &&
        !isAdminPage &&
        !isLoginPage &&
        !isRegisterPage &&
        !isProfilePage && <Footer />}
    </div>
  );
}

export default App;
