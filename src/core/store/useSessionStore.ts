import { create } from "zustand";
import { Modulo } from "../types";
import { lsCurEst, lsTknSessionKey } from "../utils/constants";

interface UseSessionStore {
  tknSession: string | null;
  setTknSession: (newTknSession:string) => void;
  modulosSesion: Modulo[] | null;
  setModulosSesion: (newModulosRolSesion: any) => void;
  moduloActual: Modulo | null;
  setModuloActual: (modulo: Modulo | null) => void;
  curEstab: number;
  setCurEstab: (establecimiento_id: number) => void;
  resetSessionStore: () => void;
  reset: () => void;
}

const tknSession = localStorage.getItem(lsTknSessionKey)
const curEstab = localStorage.getItem(lsCurEst) // Current establecimiento

const initialState = {
  curEstab: curEstab ? Number(curEstab) : 0,
  tknSession: tknSession,
  modulosSesion: null,
  moduloActual: null,
}

const useSessionStore = create<UseSessionStore>((set) => ({
    ...initialState,
    setCurEstab: (establecimiento_id) => {
      set({curEstab: establecimiento_id})
      window.localStorage.setItem(lsCurEst,  establecimiento_id.toString())
    },
    setModuloActual: (modulo) => {
      set({moduloActual: modulo})
    },
    setTknSession: (newTknSession) => {
      set({tknSession: newTknSession})
      window.localStorage.setItem(lsTknSessionKey,  newTknSession)
    },
    resetSessionStore: () => {
      window.localStorage.removeItem(lsTknSessionKey)
      set({tknSession: null})
      set({modulosSesion: null})
    },
    setModulosSesion: (newModulosRolSesion) => {
      set({modulosSesion: newModulosRolSesion})
    },
    reset: () => set(initialState),
}))

export default useSessionStore;