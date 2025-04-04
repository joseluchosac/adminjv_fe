import { create } from "zustand";
import { ls_layoutKey } from "../types/initials";

const layoutInit = {
  darkMode: false,
  fixedHeader: false,
  sidebarMini: false,
};

interface UseLayoutStore {
  layout: typeof layoutInit;
  setLayout: (newLayout:typeof layoutInit) => void;
}

const lsLayout = localStorage.getItem(ls_layoutKey)
if(!lsLayout) localStorage.setItem(ls_layoutKey, JSON.stringify(layoutInit)) 

const initialState = {
  layout: lsLayout ? JSON.parse(lsLayout) : layoutInit,
} 
const useLayoutStore = create<UseLayoutStore>((set) => {
  return {
    ...initialState,
    setLayout: (newLayout) => {
      localStorage.setItem(ls_layoutKey, JSON.stringify(newLayout))
      set({layout: newLayout})
    },
  }
})

export default useLayoutStore;