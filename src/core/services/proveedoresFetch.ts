import { FilterParams } from "../types";
const beURL = import.meta.env.VITE_BE_URL;

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
  const res = await fetch(`${beURL}api/proveedores/filtrar_proveedores?page=${pageParam}`, options)
  return res.json()
}


