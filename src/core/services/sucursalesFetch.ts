const apiURL = import.meta.env.VITE_API_URL;
import { FilterParams } from "../types";
import { Sucursal } from "../types/catalogosTypes";

type FilterFetch = {
  filterParamsSucursales: FilterParams;
  pageParam: number | unknown;
  token?: string | null;
  signal?: AbortSignal | null
}

type FilterSucursalesFetchResp = {
  filas: Sucursal[];
  next: number;
  num_regs: number;
  offset: number;
  page: number;
  pages: number;
  previous: number
  error: boolean;
  msg: string;
  msgType: string
}

export const filterSucursalesFetch = async({
    filterParamsSucursales, 
    pageParam, 
    token = null,
    signal = null, 
  }: FilterFetch): Promise<FilterSucursalesFetchResp> => {
  let options: RequestInit  = {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(filterParamsSucursales),
    credentials: "include", // envio de cookies
  }
  if(signal){
    options.signal = signal
  }
  if(token){
    options.headers = {...options.headers, Authorization: "Bearer " + token}
  }
  const res = await fetch(`${apiURL}establecimientos/filter_sucursales?page=${pageParam}`, options)
  return res.json()
}




