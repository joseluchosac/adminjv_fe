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
    {show: true, orderable: false, order_dir:"", field_name: "acciones", field_label:"Acciones",  },
    {show: false, orderable: true, order_dir:"", field_name: "id", field_label:"Id",  },
    {show: true, orderable: true, order_dir:"", field_name: "username", field_label:"Usuario",  },
    {show: true, orderable: true, order_dir:"", field_name: "nombres", field_label:"Nombres",  },
    {show: true, orderable: true, order_dir:"", field_name: "apellidos", field_label:"Apellidos",  },
    {show: true, orderable: true, order_dir:"", field_name: "email", field_label:"Email",  },
    {show: false, orderable: true, order_dir:"", field_name: "estado", field_label:"Estado",  },
    {show: true, orderable: true, order_dir:"", field_name: "rol", field_label:"Rol",  },
    {show: false, orderable: true, order_dir:"", field_name: "rol_id", field_label:"Rol Id",  },
    {show: true, orderable: true, order_dir:"", field_name: "caja", field_label:"Caja",  },
    {show: false, orderable: true, order_dir:"", field_name: "caja_id", field_label:"CajaID",  },
    {show: true, orderable: true, order_dir:"", field_name: "created_at", field_label:"F creación",  },
    {show: true, orderable: true, order_dir:"", field_name: "updated_at", field_label:"F actualización",  },
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