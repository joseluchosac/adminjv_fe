const beURL = import.meta.env.VITE_BE_URL;
import { useMutation, useQueryClient } from "@tanstack/react-query"
import useSessionStore from "../store/useSessionStore"
import { Categoria } from "../types"
import { mutationFetch } from "../services/mutationFecth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
      url: beURL + "api/categorias/get_categorias",
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
      url: beURL + "api/categorias/sort_categorias",
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
      url: beURL + "api/categorias/create_categoria",
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
      url: beURL + "api/categorias/update_categoria",
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
      url: beURL + "api/categorias/delete_categoria",
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
    sortCategorias,
    createCategoria, 
    updateCategoria, 
    deleteCategoria,
  }
}

