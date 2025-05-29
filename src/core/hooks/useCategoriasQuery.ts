const apiURL = import.meta.env.VITE_API_URL;
import { useMutation, useQueryClient } from "@tanstack/react-query"
import useSessionStore from "../store/useSessionStore"
import { mutationFetch } from "../services/mutationFecth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Categoria } from "../types/catalogosTypes";

// ****** MUTATION ******
export const useMutateCategoriasQuery = () => {
  const resetSessionStore = useSessionStore(state => state.resetSessionStore)
  const navigate = useNavigate()
  const tknSession = useSessionStore(state => state.tknSession)
  const nombreModulo = useSessionStore(state => state.moduloActual?.nombre)
  const Authorization = "Bearer " + tknSession
  const queryClient = useQueryClient()

  const {mutate, isPending, data} = useMutation({
    mutationFn: mutationFetch,
    onSuccess: () => {
      queryClient.fetchQuery({queryKey:["categorias"]});
    }
  })

  const getCategorias = () => {
    const params = {
      url: apiURL + "categorias/get_categorias",
      method: "POST",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
    }
    mutate(params)
  }
  const getCategoriasTree = () => {
    const params = {
      url: apiURL + "categorias/get_categorias_tree",
      method: "POST",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
    }
    mutate(params)
  }

  const sortCategorias = (orderedItems: Categoria[]) => {
    const params = {
      url: apiURL + "categorias/sort_categorias",
      method: "PUT",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify(orderedItems)
    }
    mutate(params)
  }

  const createCategoria = (categoria:  Categoria) => {
    const params = {
      url: apiURL + "categorias/create_categoria",
      method: "POST",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify(categoria),
    }
    mutate(params)
  }

  const updateCategoria = (categoria: Categoria) => {
    const params = {
      url: apiURL + "categorias/update_categoria",
      method: "PUT",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify(categoria),
    }
    mutate(params)
  }

  const deleteCategoria = (id: number) => {
    const params = {
      url: apiURL + "categorias/delete_categoria",
      method: "DELETE",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify({id}),
    }
    mutate(params)
  }


  useEffect(()=>{
    if(data?.msgType === "errorToken"){
      resetSessionStore()
      navigate("/auth")
    }
  },[data])

  return {
    data, 
    isPending, 
    getCategorias,
    getCategoriasTree,
    sortCategorias,
    createCategoria, 
    updateCategoria, 
    deleteCategoria,
  }
}

