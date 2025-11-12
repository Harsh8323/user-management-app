import { Link, NavLink, Outlet } from "react-router-dom";
import { ROUTES } from "../utils/constants.js";

const navClassName = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
    isActive
      ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
      : "text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)]"
  }`;

const Layout = () => {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="border-b border-[var(--border)] bg-[var(--card)] shadow-xs">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link
            to={ROUTES.home}
            className="flex items-center gap-2 text-lg font-semibold"
          >
            <span className="rounded-lg bg-[var(--primary)] px-2 py-1 text-sm text-[var(--primary-foreground)]">
              UM
            </span>
            <span>User Manager</span>
          </Link>
          <nav className="flex items-center gap-2 sm:gap-3">
            <NavLink to={ROUTES.home} className={navClassName}>
              Home
            </NavLink>
            <NavLink to={ROUTES.createUser} className={navClassName}>
              Add user
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="mx-auto min-h-[calc(100vh-80px)] w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
