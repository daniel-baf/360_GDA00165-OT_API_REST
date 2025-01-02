const HeaderAdmin: React.FC = () => {
  return (
    <header className="bg-blue-600 p-4 flex justify-between items-center">
      <div className="text-white text-xl font-bold">Admin Dashboard</div>
      <nav className="flex space-x-4">
        <a href="/home" className="text-white hover:text-gray-300">
          Home
        </a>
        <a href="/settings" className="text-white hover:text-gray-300">
          Settings
        </a>
        <a href="/profile" className="text-white hover:text-gray-300">
          Profile
        </a>
        <button className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-200">
          Usuarios
        </button>
      </nav>
    </header>
  );
};

export default HeaderAdmin;
