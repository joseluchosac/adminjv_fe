import { FilterParams, Movimiento } from "../types";
const apiURL = import.meta.env.VITE_API_URL;

type FilterMovimientosFetch = {
  filterParamsMovimientos: FilterParams;
  pageParam: number;
  token?: string | null;
  signal?: AbortSignal | null
}

type FilterMovimientosFetchResp = {
  content: Movimiento[];
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

export const filterMovimientosFetch = async({
  filterParamsMovimientos, 
  pageParam, 
  token = null,
  signal = null, 
}: FilterMovimientosFetch): Promise<FilterMovimientosFetchResp> => {
  let options: RequestInit  = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(filterParamsMovimientos),
    credentials: "include", // envio de cookies
  }
  if(signal){
    options.signal = signal
  }
  if(token){
    options.headers = {...options.headers, Authorization: "Bearer " + token}
  }
  const res = await fetch(`${apiURL}movimientos/filter_movimientos?page=${pageParam}`, options)
  return res.json()
}


