import { Outlet } from "react-router-dom";
import ProfileSidebar from "../../components/profile/ProfileSidebar";
import Header from "../../components/layout/Header";

function ProfileLayout() {
  return (
    <div className="flex min-h-screen bg-[#1A1A1A] text-white">
      <ProfileSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header />

        <main className="flex-1 px-8 py-10 lg:px-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
export default ProfileLayout;
