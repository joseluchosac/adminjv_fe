import { create } from "zustand";
import { CampoTable, FilterParams } from "../types";
import { filterParamsInit } from "../utils/constants";

interface UseUsersStore {
  camposUser: CampoTable[];
  filterParamsUsers: FilterParams;
  showUsersFilterMdl: boolean;
  setFilterParamsUsers: (params:FilterParams) => void;
  setShowUsersFilterMdl: (p: boolean) => void;
  setCamposUser: (camposUser: CampoTable[]) => void;
  reset: () => void;
}

const usersStoreInit = {
  camposUser: [
    {show: false, orderable: true, order_dir:"", fieldname: "id", label:"Id",  },
    {show: true, orderable: true, order_dir:"", fieldname: "nombres", label:"Nombres",  },
    {show: true, orderable: true, order_dir:"", fieldname: "apellidos", label:"Apellidos",  },
    {show: true, orderable: true, order_dir:"", fieldname: "username", label:"Usuario",  },
    {show: true, orderable: true, order_dir:"", fieldname: "email", label:"Email",  },
    {show: true, orderable: true, order_dir:"", fieldname: "estado", label:"Estado",  },
    {show: true, orderable: true, order_dir:"", fieldname: "rol", label:"Rol",  },
    {show: false, orderable: true, order_dir:"", fieldname: "rol_id", label:"Rol Id",  },
    {show: true, orderable: true, order_dir:"", fieldname: "caja", label:"Caja",  },
    {show: false, orderable: true, order_dir:"", fieldname: "caja_id", label:"CajaID",  },
    {show: true, orderable: true, order_dir:"", fieldname: "created_at", label:"F creación",  },
    {show: true, orderable: true, order_dir:"", fieldname: "updated_at", label:"F actualización",  },
  ],
  filterParamsUsers: filterParamsInit,
  showUsersFilterMdl: false
}

const useUsersStore = create<UseUsersStore>(( set ) => ({
  ...usersStoreInit,
  setShowUsersFilterMdl: (bool) => set({ showUsersFilterMdl: bool }),
  setFilterParamsUsers: (params) => {
    set({filterParamsUsers: params})
  },

  setCamposUser: (camposUser) => {
    set({camposUser})
  },
  reset: () => set(usersStoreInit),
}))

export default useUsersStore;