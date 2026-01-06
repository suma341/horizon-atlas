import { create } from "zustand";

type State = {
  normalized:boolean;
  setNormalized:(b:boolean)=>void;
};

const useNormalizedStore = create<State>((set) => ({
  normalized: false,
  setNormalized:(profile)=>set({normalized:profile})
}));

export default useNormalizedStore;
