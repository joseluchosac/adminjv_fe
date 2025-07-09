import { FilterFetchParam } from "../types";

export const filterFetch = async({
  filterParams,
  signal,
  token = null,
  curEstab = 0,
  url
}: FilterFetchParam) => {
  let options: RequestInit  = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(filterParams),
    credentials: "include", // envio de cookies
    signal,
  }
  if(token){
    options.headers = {...options.headers, Authorization: "Bearer " + token}
  }
  if(curEstab){
    options.headers = {...options.headers, "attached-data": JSON.stringify({curEstab})}
  }
  const res = await fetch(url, options)
  if(!res.ok) throw new Error("Error al obtener los filtros");
  return res.json()
}


