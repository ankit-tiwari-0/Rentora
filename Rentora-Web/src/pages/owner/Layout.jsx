
import { Outlet } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import OwnerNavbar from "../../component/ownerNav";
import OwnerSidebar from "../../component/OwnerSidebar";

const Layout = () => {
  const reduceMotion = useReducedMotion();

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <OwnerNavbar />

      <div className="flex min-h-[calc(100vh-64px)]">
          <OwnerSidebar />
        <main className="min-w-0 flex-1 p-4 sm:p-7 lg:p-10">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
