import { FilterParams, ProductoItem } from "../types";
const apiURL = import.meta.env.VITE_API_URL;

type FilterProductosFetch = {
  filterParamsProductos: FilterParams;
  pageParam: number;
  token?: string | null;
  curEstab?: number
  signal?: AbortSignal | null
}

type FilterProductosFetchResp = {
  content: ProductoItem[];
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
  curEstab = 0,
  signal = null,
}: FilterProductosFetch): Promise<FilterProductosFetchResp> => {
  let options: RequestInit  = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "attached-data": JSON.stringify({curEstab}),
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


