import { FilterParams, Producto, ThisTerm } from "../types";
const apiURL = import.meta.env.VITE_API_URL;

type FilterProductosFetch = {
  filterParamsProductos: FilterParams;
  pageParam: number;
  token?: string | null;
  thisTerm?: ThisTerm | null
  signal?: AbortSignal | null
}

type FilterProductosFetchResp = {
  content: Producto[];
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

export const filterProductosFetch = async({
  filterParamsProductos, 
  pageParam, 
  token = null,
  thisTerm = null,
  signal = null,
}: FilterProductosFetch): Promise<FilterProductosFetchResp> => {
  let options: RequestInit  = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "attached-data": JSON.stringify({thisTerm}),
    },
    body: JSON.stringify(filterParamsProductos),
    credentials: "include", // envio de cookies
  }
  if(signal){
    options.signal = signal
  }
  if(token){
    options.headers = {...options.headers, Authorization: "Bearer " + token}
  }
  const res = await fetch(`${apiURL}productos/filter_productos?page=${pageParam}`, options)
  return res.json()
}


