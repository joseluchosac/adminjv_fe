const apiURL = import.meta.env.VITE_API_URL;
import { useQuery } from "@tanstack/react-query";
import useSessionStore from "../store/useSessionStore";
import { useEffect } from "react";
import { Rol } from "../types/catalogosTypes";
import { fnFetch } from "../services/fnFetch";
import { FnFetchOptions } from "../types";

type DataRoles = {
  content: Rol[]
}
export default function useTablas() {
  const tknSession = useSessionStore(state => state.tknSession)
  const {data, isFetching} = useQuery<DataRoles>({
    queryKey: ['roles'],
    queryFn: () => {
      const options: FnFetchOptions = {
        url: apiURL + "roles/get_roles",
        authorization: "Bearer " + tknSession
      }
      return fnFetch(options)
    },
    staleTime: 1000 * 60
  })
  
  useEffect(()=>{
    console.log(data)
  },[data])

  return {
    rols: data?.content,
    isFetching
  }
}
