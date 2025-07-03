import { create } from "zustand";
import { EmpresaSession, Modulo, User } from "../types";
import { lsCurEst, lsTknSessionKey } from "../utils/constants";

interface UseSessionStore {
  tknSession: string | null;
  empresaSession: EmpresaSession | null;
  userSession: User | null;
  modulosSesion: Modulo[] | null;
  moduloActual: Modulo | null;
  curEstab: number;
  setCurEstab: (establecimiento_id: number) => void;
  setModuloActual: (modulo: Modulo | null) => void;
  setTknSession: (newTknSession:string) => void;
  setEmpresaSession: (newEmpresaSession:EmpresaSession) => void;
  setUserSession: (newUserSession:User) => void;
  resetSessionStore: () => void;
  setModulosSesion: (newModulosRolSesion: any) => void;
  reset: () => void;
}

const tknSession = localStorage.getItem(lsTknSessionKey)
const curEstab = localStorage.getItem(lsCurEst) // Current establecimiento

const initialState = {
  curEstab: curEstab ? Number(curEstab) : 0,
  tknSession: tknSession,
  empresaSession: null,
  userSession: null,
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
    setEmpresaSession: (newEmpresaSession) => {
      set({empresaSession: newEmpresaSession})
    },
    setUserSession: (newUserSession) => {
      set({userSession: newUserSession})
    },
    resetSessionStore: () => {
      window.localStorage.removeItem(lsTknSessionKey)
      set({tknSession: null})
      set({userSession: null})
      set({modulosSesion: null})
    },
    setModulosSesion: (newModulosRolSesion) => {
      set({modulosSesion: newModulosRolSesion})
    },
    reset: () => set(initialState),
}))

export default useSessionStore;