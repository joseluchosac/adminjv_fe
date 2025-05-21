const apiURL = import.meta.env.VITE_API_URL;
import { FilterParams } from "../types";

type FilterFetch = {
  pageParam: number;
  token: string | null;
  filterParamsProveedores: FilterParams;
  signal: AbortSignal
}

export const filterProveedoresFetch = async({filterParamsProveedores, pageParam, signal, token = null}: FilterFetch) => {
  let options: RequestInit  = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(filterParamsProveedores),
    credentials: "include", // envio de cookies
    signal,
  }
  if(token){
    options.headers = {...options.headers, Authorization: "Bearer " + token}
  }
  const res = await fetch(`${apiURL}proveedores/filter_proveedores?page=${pageParam}`, options)
  return res.json()
}


