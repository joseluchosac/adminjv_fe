import { FilterParams } from "../types";
const apiURL = import.meta.env.VITE_API_URL;

type FilterUsersFetch = {
  pageParam: number;
  token: string | null;
  filterParamsUsers: FilterParams;
  signal: AbortSignal
}

export const filterUsersFetch = async({filterParamsUsers, pageParam, signal, token = null}: FilterUsersFetch) => {
  let options: RequestInit  = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(filterParamsUsers),
    credentials: "include", // envio de cookies
    signal,
  }
  if(token){
    options.headers = {...options.headers, Authorization: "Bearer " + token}
  }
  const res = await fetch(`${apiURL}users/filter_users?page=${pageParam}`, options)
  return res.json()
}


