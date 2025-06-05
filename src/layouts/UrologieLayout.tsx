// // src/layouts/UrologieLayout.tsx
// import React, { useState } from "react";
// import Sidebar from "../components/Sidebar";
// import Navbar from "../components/Navbar"; // À créer si ce n’est pas encore fait
// import { Outlet } from "react-router-dom";

// const UrologieLayout = () => {
//   const [isCollapsed, setIsCollapsed] = useState(false);

//   return (
//     <div className="flex h-screen">
//       <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

//       <div className="flex flex-col flex-1 overflow-hidden">
//         <Navbar isSidebarCollapsed={false} />
//         <main className="p-4 overflow-y-auto">
//           <Outlet /> 
//           {/* C'est ici que les sous-pages apparaîtront */}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default UrologieLayout;


// src/layouts/UrologieLayout.tsx
import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

const UrologieLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* ✅ Correction: passer isCollapsed au lieu de false */}
        <Navbar isSidebarCollapsed={isCollapsed} />
        
        <main className="p-4 overflow-y-auto">
          <Outlet />
          {/* C'est ici que les sous-pages apparaîtront */}
        </main>
      </div>
    </div>
  );
};

export default UrologieLayout;