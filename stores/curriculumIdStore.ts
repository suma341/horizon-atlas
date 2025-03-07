import { create } from "zustand";

type State = {
  curriculumId:string;
  setCurriculumId:(id:string)=>void;
};

const useCurriculumIdStore = create<State>((set) => ({
  curriculumId: "",
  setCurriculumId:(id)=>set({curriculumId:id})
}));

export default useCurriculumIdStore;
