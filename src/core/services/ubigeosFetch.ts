const apiURL = import.meta.env.VITE_API_URL;
import { FilterParams, Ubigeo } from "../types";

type FilterFetch = {
  filterParamsUbigeos: FilterParams;
  pageParam: number;
  token?: string | null;
  signal?: AbortSignal | null 
}

type FilterUbigeosFetchResp = {
  filas: Ubigeo[];
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

export const filterUbigeosFetch = async ({
    filterParamsUbigeos, 
    pageParam, 
    token = null,
    signal = null, 
  }: FilterFetch): Promise<FilterUbigeosFetchResp> => {
  let options: RequestInit = {
    method: "POST",
    headers: { "Content-Type": "application/json"},
    body: JSON.stringify(filterParamsUbigeos),
    credentials: "include", // envio de cookies
  }
  if(signal){
    options.signal = signal
  }
  if(token){
    options.headers = {...options.headers, Authorization: "Bearer " + token}
  }
  const res = await fetch(`${apiURL}ubigeos/filter_ubigeos?page=${pageParam}`, options)
  return res.json()
}


