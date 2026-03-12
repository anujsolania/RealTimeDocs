import { useEffect, useRef, useState } from "react";
import image from "../assets/logo.png";
import AuthService from "../services/user-service";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/zustand";

const Navbar = () => {
  const [name, setName] = useState("");
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isOpen, setisOpen] = useState(false);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setDocuments = useStore((state) => state.setDocuments);
  const getDocuments = useStore((state) => state.getDocuments);

  const navigate = useNavigate();

  const token = useStore((state) => state.token);
  const logout = useStore((state) => state.logout);

  useEffect(() => {
    (async () => {
      try {
        const response = await AuthService.getuser(token!);
        setName(response.data.username);
      } catch (error: any) {
        console.error(error);
        alert(error.response.data.error);
      }
    })();
  }, []);

  const filterDocuments = async (filter: string) => {
    if (debounce.current) clearTimeout(debounce.current);
    if (filter === "") {
      getDocuments();
    } else {
      try {
        debounce.current = setTimeout(async () => {
          const response = await AuthService.filterdocuments({
            filter,
            token: token!,
          });
          setDocuments(response.data.filtereddocuments);
        }, 300);
      } catch (error: any) {
        console.error(error);
        alert(error.response.data.error);
      }
    }
  };

  const handlePosition = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX + -50,
    });
    setisOpen(!isOpen);
  };

  const handlelogout = () => {
    logout();
    navigate("/signin");
  };

  return (
    <div className="w-screen h-[50px] bg-white flex items-center justify-between p-10">
      <div className="flex gap-4">
        <img src={image} className="h-10 w-8 m-auto"></img>
        <h1 className="text-2xl font-semibold m-auto">RealTimeDocs</h1>
      </div>
      <div className="flex justify-end gap-10">
        <input
          className="bg-gray-300 rounded-lg p-5 h-8 w-52"
          placeholder="Search documents..."
          onChange={(e) => filterDocuments(e.target.value)}
        ></input>
        <button
          className="bg-blue-400 h-10 w-10 rounded-full text-white text-2xl m-auto"
          onClick={(e) => {
            handlePosition(e);
          }}
        >
          {name[0]}
        </button>
      </div>
      {isOpen && (
        <div
          className="absolute  bg-white border border-gray-300 rounded"
          style={{ top: position.top, left: position.left }}
        >
          <p className="hover:bg-gray-100 p-1.5" onClick={handlelogout}>
            Logout
          </p>
        </div>
      )}
    </div>
  );
};

export default Navbar;
