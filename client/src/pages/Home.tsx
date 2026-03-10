import Body from "../components/Body";
import Navbar from "../components/Navbar";

const Home = () => {
  return (
    <div className="bg-gray-300 min-h-screen w-screen flex flex-col">
      <Navbar />
      <div className="grow">
        <Body></Body>
      </div>
      <div className="bg-[#50A2FF] font-serif text-center p-2">
        © 2026 RealTimeDocs. Released under the MIT License.
      </div>
    </div>
  );
};

export default Home;
