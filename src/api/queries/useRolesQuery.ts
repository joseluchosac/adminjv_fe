const apiURL = import.meta.env.VITE_API_URL;
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import useSessionStore from "../../app/store/useSessionStore"
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { FetchOptions, QueryResp, Rol } from "../../app/types";
import { fnFetch } from "../fnFetch";

interface RolesQryRes extends QueryResp {content: Rol[]}
export const useRolesQuery = () => {
  const tknSession = useSessionStore(state => state.tknSession)
  const {data, isFetching} = useQuery<RolesQryRes>({
    queryKey: ['roles'],
    queryFn: () => {
      const options: FetchOptions = {
        url: apiURL + "roles/get_roles",
        authorization: "Bearer " + tknSession
      }
      return fnFetch(options)
    },
    staleTime: 1000 * 60 * 60 * 24
  })

  return {
    roles: data?.content,
    isFetching
  }
}
// ****** MUTATE ROLES ******
export const useMutateRolesQuery = () => {
  const resetSessionStore = useSessionStore(state => state.resetSessionStore)
  const navigate = useNavigate()
  const token = useSessionStore(state => state.tknSession)
  const queryClient = useQueryClient()

  const {mutate, isPending, data} = useMutation({
    mutationFn: fnFetch,
    onSuccess: (resp) => {
      if(resp.msgType !== 'success') return
      queryClient.invalidateQueries({queryKey:["roles"]})
      queryClient.invalidateQueries({queryKey:["modulos_rol"]})
    }
  })

  const updateRol = (param:any) => {
    const options: FetchOptions = {
      method: "PUT",
      url: apiURL + "roles/update_rol",
      body: JSON.stringify(param),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }
  
  const createRol = (param:any) => {
    const options: FetchOptions = {
      method: "POST",
      url: apiURL + "roles/create_rol",
      body: JSON.stringify(param),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }
  
  const deleteRol = (param: any) => {
    const options: FetchOptions = {
      method: "DELETE",
      url: apiURL + "roles/delete_rol",
      body: JSON.stringify(param),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  useEffect(()=>{
    if(data?.errorType === "errorToken"){
      resetSessionStore()
      navigate("/auth")
    }
  },[data])

  return {
    data, 
    updateRol, 
    createRol, 
    deleteRol, 
    isPending
  }
}