import NavBar from "./NavBar";

export default function Layout({ children }) {
  return (
    <div className="app-shell">
      <NavBar />
      <main className="app-container">{children}</main>
    </div>
  );
}
