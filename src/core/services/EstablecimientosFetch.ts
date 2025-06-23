const apiURL = import.meta.env.VITE_API_URL;
import { FilterParams } from "../types";
import { Establecimiento } from "../types/catalogosTypes";

type FilterFetch = {
  filterParamsEstablecimientos: FilterParams;
  pageParam: number | unknown;
  token?: string | null;
  signal?: AbortSignal | null
}

type FilterEstablecimientosFetchResp = {
  filas: Establecimiento[];
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

export const filterEstablecimientosFetch = async({
    filterParamsEstablecimientos, 
    pageParam, 
    token = null,
    signal = null, 
  }: FilterFetch): Promise<FilterEstablecimientosFetchResp> => {
  let options: RequestInit  = {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(filterParamsEstablecimientos),
    credentials: "include", // envio de cookies
  }
  if(signal){
    options.signal = signal
  }
  if(token){
    options.headers = {...options.headers, Authorization: "Bearer " + token}
  }
  const res = await fetch(`${apiURL}establecimientos/filter_establecimientos?page=${pageParam}`, options)
  return res.json()
}




