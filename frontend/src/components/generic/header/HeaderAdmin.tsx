const HeaderAdmin: React.FC = () => {
  return (
    <header className="shadow-lg mb-10 text-white bg-slate-950">
      <nav className="container mx-auto flex items-center justify-between p-4">
        <div className="text-white text-xl font-bold">Admin Dashboard</div>
        <ul className="flex items-center space-x-4">
          <li>
            <a href="/home" className="hover:text-blue-300 transition">
              Home
            </a>
          </li>
          <li>
            <a href="/settings" className="hover:text-blue-300 transition">
              Settings
            </a>
          </li>
          <li>
            <a href="/profile" className="hover:text-blue-300 transition">
              Profile
            </a>
          </li>
          <li>
            <button className="hover:text-blue-300 transition">Usuarios</button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default HeaderAdmin;
