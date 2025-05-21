const apiURL = import.meta.env.VITE_API_URL;
import { FilterParams, Laboratorio } from "../types";

type FilterFetch = {
  filterParamsLaboratorios: FilterParams;
  pageParam: number;
  token?: string | null;
  signal?: AbortSignal | null 
}

type FilterLaboratoriosFetchResp = {
  filas: Laboratorio[];
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

export const filterLaboratoriosFetch = async ({
    filterParamsLaboratorios, 
    pageParam, 
    token = null,
    signal = null, 
  }: FilterFetch): Promise<FilterLaboratoriosFetchResp> => {
  let options: RequestInit = {
    method: "POST",
    headers: { "Content-Type": "application/json"},
    body: JSON.stringify(filterParamsLaboratorios),
    credentials: "include", // envio de cookies
  }
  if(signal){
    options.signal = signal
  }
  if(token){
    options.headers = {...options.headers, Authorization: "Bearer " + token}
  }
  const res = await fetch(`${apiURL}laboratorios/filter_laboratorios?page=${pageParam}`, options)
  return res.json()
}


