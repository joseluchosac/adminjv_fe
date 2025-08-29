const apiURL = import.meta.env.VITE_API_URL;
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import useSessionStore from "../../app/store/useSessionStore"
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { CategoriaTree, FetchOptions } from "../../app/types";
import { fnFetch } from "../fnFetch";
import { CategoriasResponseSchema } from "../../app/schemas/categorias-schema";


// ****** CATEGORIAS Y CATEGORIAS TREE ******
export const useCategoriasQuery = () => {
  const tknSession = useSessionStore((state) => state.tknSession);
  const { data, isFetching } = useQuery({
    queryKey: ["categorias"],
    queryFn: () => {
      const options: FetchOptions = {
        url: apiURL + "catalogos/get_categorias",
        authorization: "Bearer " + tknSession,
      };
      return fnFetch(options);
    },
    staleTime: 1000 * 60 * 60 * 24,
  });
 
  const categorias = useMemo(() => {
    const result = CategoriasResponseSchema.safeParse(data);
    return result.success ? result.data : {list: [], tree: []};
  }, [data]);

  return {
    categorias,
    isFetching,
  };
};

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

  const sortCategorias = (orderedItems: CategoriaTree[]) => {
    const options: FetchOptions = {
      method: "PUT",
      url: apiURL + "categorias/sort_categorias",
      body: JSON.stringify(orderedItems),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const createCategoria = (categoria:  CategoriaTree) => {
    const options: FetchOptions = {
      method: "POST",
      url: apiURL + "categorias/create_categoria",
      body: JSON.stringify(categoria),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const updateCategoria = (categoria: CategoriaTree) => {
    const options: FetchOptions = {
      method: "PUT",
      url: apiURL + "categorias/update_categoria",
      body: JSON.stringify(categoria),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const deleteCategoria = (id: number) => {
    const options: FetchOptions = {
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

