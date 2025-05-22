import { create } from "zustand";
import { CampoTable, FilterCurrent, FilterParams } from "../types";

interface UseUsersStore {
  currentUserId: number;
  camposUser: CampoTable[];
  filterParamsUsers: FilterParams;
  filterUsersCurrent: FilterCurrent;
  showUserFormMdl: boolean;
  showUsersFilterMdl: boolean;
  setShowUserFormMdl: (bool:boolean) => void;
  setFilterParamsUsers: (params:FilterParams) => void;
  setFilterUsersCurrent: () => void;
  setShowUsersFilterMdl: (p: boolean) => void;
  setCurrentUserId: (userId: number) => void;
  reset: () => void;
}

export const usersStoreInit = {
  currentUserId: 0,
  camposUser: [
    {show: false, orderable: true, order_dir:"", fieldname: "id", text:"Id",  },
    {show: true, orderable: true, order_dir:"", fieldname: "nombres", text:"Nombres",  },
    {show: true, orderable: true, order_dir:"", fieldname: "apellidos", text:"Apellidos",  },
    {show: true, orderable: true, order_dir:"", fieldname: "username", text:"Usuario",  },
    {show: true, orderable: true, order_dir:"", fieldname: "email", text:"Email",  },
    {show: true, orderable: true, order_dir:"", fieldname: "estado", text:"Estado",  },
    {show: true, orderable: true, order_dir:"", fieldname: "rol", text:"Rol",  },
    {show: false, orderable: true, order_dir:"", fieldname: "rol_id", text:"Rol Id",  },
    {show: true, orderable: true, order_dir:"", fieldname: "caja", text:"Caja",  },
    {show: false, orderable: true, order_dir:"", fieldname: "caja_id", text:"CajaID",  },
    {show: true, orderable: true, order_dir:"", fieldname: "created_at", text:"F creación",  },
    {show: true, orderable: true, order_dir:"", fieldname: "updated_at", text:"F actualización",  },
  ],
  filterParamsUsers: {
    offset: 25,
    search: "",
    equals: [], // [{fieldname: "sucursal_id", value: "1", text:"principal", campo_text: "Sucursal"}]
    between: {fieldname: "", campo_text: "", range: ""}, // {fieldname: "created_at", campo_text:"Creado", range: "2024-12-18 00:00:00, 2024-12-19 23:59:59"}
    orders: [], // [{fieldname: "nombres", order_dir: "ASC", text: "Nombres"}]
  },
  filterUsersCurrent: {
    equals: [],
    between: {fieldname: "", campo_text: "", range: ""},
    orders: [], 
  },
  showUserFormMdl: false,
  showUsersFilterMdl: false
}

const useUsersStore = create<UseUsersStore>(( set, get ) => ({
  ...usersStoreInit,
  setShowUserFormMdl: (bool) => { set({ showUserFormMdl: bool }) },
  setShowUsersFilterMdl: (bool) => set({ showUsersFilterMdl: bool }),
  setFilterParamsUsers: (params) => {
    set({filterParamsUsers: params})
  },
  setFilterUsersCurrent: () => {
    const {equals, between, orders} = get().filterParamsUsers
    const newCamposUsers = get().camposUser.map(el=>{
      const order = orders.find(order => order.fieldname === el.fieldname)
      return order ? {...el, order_dir: order?.order_dir} : {...el, order_dir: ""}
    })
    // console.log(newCamposUsers)
    set({camposUser: newCamposUsers})
    set({filterUsersCurrent: {equals, between, orders}})
  },
  setCurrentUserId: (userId) => set({currentUserId: userId}),
  reset: () => set(usersStoreInit),
}))

export default useUsersStore;