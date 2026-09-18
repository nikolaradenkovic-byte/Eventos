import { Outlet } from "react-router-dom";
import OrganizerSideBar from "../../components/organizer/OrganizerSideBar";

function OrganizerLayout() {
  return (
    <div className="flex h-screen overflow-hidden flex-col md:flex-row bg-[#F4F4F4]">
      <OrganizerSideBar />

      <main className="min-w-0 flex-1 px-30 py-8 bg-[#F5F5F5] overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
export default OrganizerLayout;
