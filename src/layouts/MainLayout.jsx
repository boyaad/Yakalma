import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <>
      <header>
        <h2>Yakalma</h2>
      </header>

      <main>
        <Outlet />
      </main>

      <footer>
        <p>© Yakalma 2026</p>
      </footer>
    </>
  );
}

export default MainLayout;