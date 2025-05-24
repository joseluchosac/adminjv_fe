import { FilterParams, User } from "../types";
const apiURL = import.meta.env.VITE_API_URL;

type FilterUsersFetch = {
  filterParamsUsers: FilterParams;
  pageParam: number;
  token?: string | null;
  signal?: AbortSignal | null
}
type FilterUsersFetchResp = {
  content: User[];
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
export const filterUsersFetch = async({
  filterParamsUsers, 
  pageParam, 
  token = null,
  signal = null, 
}: FilterUsersFetch): Promise<FilterUsersFetchResp> => {
  let options: RequestInit  = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(filterParamsUsers),
    credentials: "include", // envio de cookies
  }
  if(signal){
    options.signal = signal
  }
  if(token){
    options.headers = {...options.headers, Authorization: "Bearer " + token}
  }
  const res = await fetch(`${apiURL}users/filter_users?page=${pageParam}`, options)
  return res.json()
}


