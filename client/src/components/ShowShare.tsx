import { useEffect, useState } from "react";
import AuthService from "../services/user-service";
import { useStore } from "../store/zustand";
import type { Collaborator } from "../interfaces/interfaces";

type showShareProps = {
  numericdocumentId: number;
};

const ShowShare = ({ numericdocumentId }: showShareProps) => {
  const [email, setEmail] = useState("");
  const [permission, setPermission] = useState("");

  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [loading, setLoading] = useState(false);

  // const showShare = useStore((state) => state.showShare)
  const setshowShare = useStore((state) => state.setshowShare);

  const token = useStore((state) => state.token);
  //  const decodedToken: TokenPayload = jwtDecode(token)

  const sharedocument = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const response = await AuthService.sharedocument(
        token!,
        numericdocumentId,
        email,
        permission
      );
      alert(response.data.message);
      setshowShare(false);
    } catch (error: any) {
      console.error(error);
      alert(error.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  const getcollaborators = async () => {
    try {
      const response = await AuthService.getcollaborators(
        token!,
        numericdocumentId
      );
      const collaborators = response.data.collaborators;
      console.log(collaborators);
      setCollaborators(collaborators);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getcollaborators();

    return () => {
      setCollaborators([]);
    };
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center  bg-gray-700/50 z-10">
      <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col min-h-[400px] w-[70%] sm:w-[50%] lg:w-[40%] gap-6">
        <p className="text-lg font-semibold">Share Document</p>
        <div>
          <p className="">Email:</p>
          <input
            className="border border-gray-300 rounded w-full p-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></input>
        </div>
        <div>
          <p>Collaborators:</p>
          <div className="flex flex-col gap-2 mt-2">
            {collaborators.length === 0 ? (
              <button className="bg-gray-100 h-[30px] rounded w-full p-1 shadow text-sm text-left px-2">
                No collaborators yet
              </button>
            ) : (
              collaborators.map((collaborator) => (
                <button
                  key={collaborator.id}
                  className="bg-gray-100 h-[30px] rounded w-full p-1 shadow text-left px-3 flex items-center justify-between"
                >
                  <span>{collaborator.user.email}</span>
                  <span className="text-xs text-gray-600">
                    {collaborator.permission}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
        <div>
          <p>Permission:</p>
          <select
            className="w-full p-1 border border-gray-300 rounded"
            value={permission}
            onChange={(e) => setPermission(e.target.value)}
          >
            <option value="">Select permission</option>
            <option value="VIEW">VIEW</option>
            <option value="EDIT">EDIT</option>
          </select>
          <div className="flex justify-end gap-2 mt-5">
            <button
              className="p-2 rounded border border-gray-300"
              onClick={() => setshowShare(false)}
            >
              Cancel
            </button>
            <button
              className={`p-2 rounded text-white ${
                loading ? "bg-sky-400 cursor-not-allowed" : "bg-sky-600"
              }`}
              disabled={loading}
              onClick={sharedocument}
            >
              {loading ? "Sharing..." : "Share"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowShare;
