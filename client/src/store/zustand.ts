import { create } from "zustand";
import AuthService from "../services/user-service";
import type { Document } from "../interfaces/interfaces";
import { jwtDecode } from "jwt-decode";

type StoreState = {
  documents: Document[];
  setDocuments: (docs: Document[]) => void;
  getDocuments: () => Promise<void>;
  title: string;
  setTitle: (titlee: string) => void;
  content: string;
  setContent: (contentt: string) => void;
  showShare: boolean;
  setshowShare: (valuee: boolean) => void;
  filterOption: string;
  setFilterOption: (option: string) => void;
  permissionOfuser: string;
  setPermissionOfuser: (permission: string) => void;

  colorOfUser: Map<number, string>;
  setColorOfUser: (userId: number, color: string) => void;
  removeColorOfUser: (userId: number) => void;

  activeUsers: { userId: number; userEmail: string }[];
  setActiveUsers: (
    users:
      | { userId: number; userEmail: string }[]
      | ((
          prev: { userId: number; userEmail: string }[]
        ) => { userId: number; userEmail: string }[])
  ) => void;

  editingTitle: { userId: number; userEmail: string } | null;
  setEditingTitle: (user: { userId: number; userEmail: string } | null) => void;

  token: string | null;
  user: any;
  setAuth: (token: string, user: any) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
};

export const useStore = create<StoreState>((set, get) => ({
  documents: [],
  filterOption: "Owned by me",
  setFilterOption: (option) => set({ filterOption: option }),
  setDocuments: (docs) => set({ documents: docs }),
  getDocuments: async () => {
    try {
      const token = get().token;
      const response = await AuthService.getdocuments(token!);
      const filterOption = get().filterOption;
      if (filterOption == "Owned by me") {
        set({ documents: response.data.alldocuments.ownedbyme });
      } else if (filterOption == "Not owned by me") {
        set({ documents: response.data.alldocuments.notownedbyme });
      } else if (filterOption == "Owned by anyone") {
        set({ documents: response.data.alldocuments.ownedbyanyone });
      }
    } catch (error) {
      console.error("Error fetching:", error);
    }
  },
  title: "",
  setTitle: (title) => set({ title }),
  content: "",
  setContent: (content) => set({ content }),
  showShare: false,
  setshowShare: (valuee) => set({ showShare: valuee }),
  permissionOfuser: "",
  setPermissionOfuser: (permissionOfuser) => set({ permissionOfuser }),

  colorOfUser: new Map<number, string>(),
  setColorOfUser: (userId, color) =>
    set((state) => {
      const newMap = new Map(state.colorOfUser);
      newMap.set(userId, color);
      return { colorOfUser: newMap };
    }),
  removeColorOfUser: (userId) =>
    set((state) => {
      const newMap = new Map(state.colorOfUser);
      newMap.delete(userId);
      return { colorOfUser: newMap };
    }),

  activeUsers: [],
  setActiveUsers: (users) =>
    set((state) => ({
      activeUsers:
        typeof users === "function" ? users(state.activeUsers) : users,
    })),

  editingTitle: null,
  setEditingTitle: (user) => set({ editingTitle: user }),

  //AUTH STUFF
  token: localStorage.getItem("token"),
  user: null,

  setAuth: (token, user) => {
    localStorage.setItem("token", token);
    set({ token, user });
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ token: null, user: null });
  },

  isAuthenticated: () => {
    const token = get().token;

    if (!token) {
      return false;
    }

    try {
      // Decode the JWT to get the expiration time
      const decoded: { exp: number } = jwtDecode(token);

      // Check if token is expired (exp is in seconds, Date.now() is in milliseconds)
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        // Token is expired, clear it
        get().logout();
        return false;
      }

      return true;
    } catch (error) {
      // If token can't be decoded, it's invalid
      get().logout();
      return false;
    }
  },
}));
