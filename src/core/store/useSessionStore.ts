import { create } from "zustand";
import { EmpresaSession, Modulo, ThisTerm, User } from "../types";
import { lsThisT, lsTknSessionKey } from "../utils/constants";

interface UseSessionStore {
  tknSession: string | null;
  empresaSession: EmpresaSession | null;
  userSession: User | null;
  modulosSesion: Modulo[] | null;
  moduloActual: Modulo | null;
  thisTerm: ThisTerm | null;
  setModuloActual: (modulo: Modulo | null) => void;
  setTknSession: (newTknSession:string) => void;
  setEmpresaSession: (newEmpresaSession:EmpresaSession) => void;
  setUserSession: (newUserSession:User) => void;
  resetSessionStore: () => void;
  setModulosSesion: (newModulosRolSesion: any) => void;
  setThisTerm: (newThisTerm: ThisTerm | null) => void;
  reset: () => void;
}

const tknSession = localStorage.getItem(lsTknSessionKey)
const thisT = localStorage.getItem(lsThisT) 

const initialState = {
  tknSession: tknSession,
  empresaSession: null,
  userSession: null,
  modulosSesion: null,
  moduloActual: null,
  thisTerm: thisT ? JSON.parse(atob(thisT)) as ThisTerm : null,
}

const useSessionStore = create<UseSessionStore>((set) => ({
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
      set({tknSession: null})
      set({userSession: null})
      set({modulosSesion: null})
    },
    setModulosSesion: (newModulosRolSesion) => {
      set({modulosSesion: newModulosRolSesion})
    },
    setThisTerm: (newThisTerm) => {
      if(newThisTerm){
        set({thisTerm: newThisTerm})
        window.localStorage.setItem(lsThisT, btoa(JSON.stringify(newThisTerm)))
      }else{
        set({thisTerm: null})
        window.localStorage.removeItem(lsThisT)
      }
    },
    reset: () => set(initialState),
}))

export default useSessionStore;