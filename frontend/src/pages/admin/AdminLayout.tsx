import { Outlet } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";

function AdminLayout() {
  return (
    <div className="flex h-screen overflow-hidden flex-col md:flex-row bg-[#F4F4F4]">
      <AdminSidebar />

      <main className="min-w-0 flex-1 px-30 py-8 bg-white overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
export default AdminLayout;
