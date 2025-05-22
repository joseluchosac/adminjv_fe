import { create } from "zustand";
import { EmpresaSession, Modulo, User } from "../types";
import { lsTknSessionKey } from "../utils/constants";

interface UseSessionStore {
  tknSession: string | null;
  empresaSession: EmpresaSession | null;
  userSession: User | null;
  modulosSesion: Modulo[] | null;
  moduloActual: Modulo | null;
  setModuloActual: (modulo: Modulo | undefined) => void;
  setTknSession: (newTknSession:string) => void;
  setEmpresaSession: (newEmpresaSession:EmpresaSession) => void;
  setUserSession: (newUserSession:User) => void;
  resetSessionStore: () => void;
  setModulosSesion: (newModulosRolSesion: any) => void;
  reset: () => void;
}

const tknSession = localStorage.getItem(lsTknSessionKey)

const initialState = {
  tknSession: tknSession,
  empresaSession: null,
  userSession: null,
  modulosSesion: null,
  moduloActual: null,
}

const useSessionStore = create<UseSessionStore>((set) => {
  return {
    ...initialState,
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
      window.sessionStorage.removeItem(lsTknSessionKey)
      set({tknSession: null})
      set({userSession: null})
      set({modulosSesion: null})
    },
    setModulosSesion: (newModulosRolSesion) => {
      set({modulosSesion: newModulosRolSesion})
    },
    reset: () => set(initialState),
  }
})

export default useSessionStore;