import { IconInfo } from "@/types/iconInfo";
import { create } from "zustand";

type State = {
  icons:IconInfo[];
  setIcons:(icons:IconInfo[])=>void;
};

const useIconStore = create<State>((set) => ({
  icons:[],
  setIcons:(icons)=>set({icons})
}));

export default useIconStore;
