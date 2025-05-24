import { create } from "zustand";
import { CampoTable, FilterParams } from "../types";
import { filterParamsInit } from "../utils/constants";

interface UseUsersStore {
  camposUser: CampoTable[];
  filterParamsUsers: FilterParams;
  setFilterParamsUsers: (params:FilterParams) => void;
  setCamposUser: (camposUser: CampoTable[]) => void;
  reset: () => void;
}

const usersStoreInit = {
  camposUser: [
    {show: true, orderable: false, order_dir:"", field_name: "acciones", label:"Acciones",  },
    {show: false, orderable: true, order_dir:"", field_name: "id", label:"Id",  },
    {show: true, orderable: true, order_dir:"", field_name: "username", label:"Usuario",  },
    {show: true, orderable: true, order_dir:"", field_name: "nombres", label:"Nombres",  },
    {show: true, orderable: true, order_dir:"", field_name: "apellidos", label:"Apellidos",  },
    {show: true, orderable: true, order_dir:"", field_name: "email", label:"Email",  },
    {show: false, orderable: true, order_dir:"", field_name: "estado", label:"Estado",  },
    {show: true, orderable: true, order_dir:"", field_name: "rol", label:"Rol",  },
    {show: false, orderable: true, order_dir:"", field_name: "rol_id", label:"Rol Id",  },
    {show: true, orderable: true, order_dir:"", field_name: "caja", label:"Caja",  },
    {show: false, orderable: true, order_dir:"", field_name: "caja_id", label:"CajaID",  },
    {show: true, orderable: true, order_dir:"", field_name: "created_at", label:"F creación",  },
    {show: true, orderable: true, order_dir:"", field_name: "updated_at", label:"F actualización",  },
  ],
  filterParamsUsers: filterParamsInit,
}

const useUsersStore = create<UseUsersStore>(( set ) => ({
  ...usersStoreInit,
  setFilterParamsUsers: (params) => {
    set({filterParamsUsers: params})
  },

  setCamposUser: (camposUser) => {
    set({camposUser})
  },
  reset: () => set(usersStoreInit),
}))

export default useUsersStore;