import { FaTwitter, FaInstagram } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-950 text-white py-2 h-auto pt-3">
      <div className="container mx-auto text-center">
        <div className="mb-4">
          <a href="https://twitter.com" className="mx-2 text-xl">
            <FaTwitter />
          </a>
          <a href="https://instagram.com" className="mx-2 text-xl">
            <FaInstagram />
          </a>
        </div>
        <p className="text-sm">
          &copy; 2023 Your Company. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
