const apiURL = import.meta.env.VITE_API_URL;
import { FilterParams, Marca } from "../types";

type FilterFetch = {
  filterParamsMarcas: FilterParams;
  pageParam: number | unknown;
  token?: string | null;
  signal?: AbortSignal | null
}

type FilterMarcasFetchResp = {
  filas: Marca[];
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

export const filterMarcasFetch = async({
    filterParamsMarcas, 
    pageParam, 
    signal = null, 
    token = null
  }: FilterFetch): Promise<FilterMarcasFetchResp> => {
  let options: RequestInit  = {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(filterParamsMarcas),
    credentials: "include", // envio de cookies
  }
  if(signal){
    options.signal = signal
  }
  if(token){
    options.headers = {...options.headers, Authorization: "Bearer " + token}
  }
  const res = await fetch(`${apiURL}marcas/filter_marcas?page=${pageParam}`, options)
  return res.json()
}




