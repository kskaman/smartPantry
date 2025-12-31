// import { NavLink } from "react-router";

// import { useAuth } from "../../context/AuthContext";
// import clsx from "clsx";
// import { NAV_LINKS, SETTINGS_LINK } from "../../constants";

// import { LogoutIcon } from "../../assets";

// const baseNavClasses = `
//   flex items-center gap-2 justify-center py-1 px-3
//   rounded-[8px] w-fit
// `;

// const inactiveText = `text-(--nav-item-text-color)`;
// const activeText = `bg-(--nav-item-bg-active) text-(--nav-item-text-active-color)`;

// const BottomNavbar = () => {
//   const { logout } = useAuth();

//   return (
//     <div
//       className={`flex items-center justify-center bg-(--main-container-bg)
//            h-full gap-4`}
//     >
//       {/* navigation links */}
//       <nav className="flex items-center justify-evenly flex-1 w-full h-full p-2">
//         {NAV_LINKS.map(({ name, Icon, to }) => (
//           <NavLink
//             to={to}
//             className={({ isActive }) =>
//               clsx(baseNavClasses, isActive ? activeText : inactiveText)
//             }
//             key={name}
//           >
//             {({ isActive }) => (
//               <>
//                 <div className="flex flex-col justify-center items-center gap-2">
//                   <Icon
//                     height={24}
//                     width={24}
//                     color={`${
//                       isActive
//                         ? "var(--nav-item-icon-active-color)"
//                         : "var(--nav-item-text-color)"
//                     }`}
//                   />

//                   {
//                     <span className="text-preset-4 hidden sm:inline">
//                       {name}
//                     </span>
//                   }
//                 </div>
//               </>
//             )}
//           </NavLink>
//         ))}

//         {/* settings * logout */}
//         <NavLink
//           to={SETTINGS_LINK.to}
//           className={({ isActive }) =>
//             clsx(baseNavClasses, isActive ? activeText : inactiveText)
//           }
//           key={SETTINGS_LINK.name}
//         >
//           {({ isActive }) => (
//             <>
//               <div className="flex flex-col items-center gap-2">
//                 <SETTINGS_LINK.Icon
//                   height={24}
//                   width={24}
//                   color={`${
//                     isActive
//                       ? "var(--nav-item-icon-active-color)"
//                       : "var(--nav-item-text-color)"
//                   }`}
//                 />

//                 <span className="text-preset-4 hidden sm:inline">
//                   {SETTINGS_LINK.name}
//                 </span>
//               </div>
//             </>
//           )}
//         </NavLink>

//         <div
//           className="flex flex-col items-center gap-2
//                cursor-pointer
//               rounded-[8px]"
//           onClick={logout}
//         >
//           <LogoutIcon
//             height={24}
//             width={24}
//             color={`var(--nav-item-text-color)`}
//           />

//           {<span className="text-preset-4 hidden sm:inline">Logout</span>}
//         </div>
//       </nav>
//     </div>
//   );
// };

// export default BottomNavbar;
