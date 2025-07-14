const apiURL = import.meta.env.VITE_API_URL;
import { useMutation, useQueryClient } from "@tanstack/react-query"
import useSessionStore from "../store/useSessionStore"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Categoria } from "../types/catalogosTypes";
import { fnFetch } from "../services/fnFetch";
import { FnFetchOptions } from "../types";

// ****** MUTATION ******
export const useMutateCategoriasQuery = () => {
  const resetSessionStore = useSessionStore(state => state.resetSessionStore)
  const navigate = useNavigate()
  const token = useSessionStore(state => state.tknSession)
  const queryClient = useQueryClient()

  const {mutate, isPending, data} = useMutation({
    mutationFn: fnFetch,
    onSuccess: () => {
      queryClient.fetchQuery({queryKey:["categorias"]});
    }
  })

  const sortCategorias = (orderedItems: Categoria[]) => {
    const options: FnFetchOptions = {
      method: "PUT",
      url: apiURL + "categorias/sort_categorias",
      body: JSON.stringify(orderedItems),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const createCategoria = (categoria:  Categoria) => {
    const options: FnFetchOptions = {
      method: "POST",
      url: apiURL + "categorias/create_categoria",
      body: JSON.stringify(categoria),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const updateCategoria = (categoria: Categoria) => {
    const options: FnFetchOptions = {
      method: "PUT",
      url: apiURL + "categorias/update_categoria",
      body: JSON.stringify(categoria),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const deleteCategoria = (id: number) => {
    const options: FnFetchOptions = {
      method: "DELETE",
      url: apiURL + "categorias/delete_categoria",
      body: JSON.stringify({id}),
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
    isPending, 
    sortCategorias,
    createCategoria, 
    updateCategoria, 
    deleteCategoria,
  }
}

