import { Profile } from "@/types/profile";
import { create } from "zustand";

type State = {
  userProfile:Profile | null;
  setUserProfile:(profile:Profile | null)=>void;
};

const useUserProfileStore = create<State>((set) => ({
  userProfile: null,
  setUserProfile:(profile)=>set({userProfile:profile})
}));

export default useUserProfileStore;
