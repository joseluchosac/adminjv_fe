const apiURL = import.meta.env.VITE_API_URL;
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import useSessionStore from "../store/useSessionStore"
import { FilterUsersResp, LoginForm, MutationFetch, RegisterForm, ResponseQuery, User } from "../types"
import { mutationFetch } from "../services/mutationFecth"
import { filterFetch } from "../services/filterFetch";
import { filterParamsInit } from "../utils/constants";

type TypeAction = 
"filter_full" 
| "mutate_user" 
| "mutate_profile" 
| "sign_up"
| "login"
| "check_auth"
| "check_password"
| "send_code_restoration"
| "restore_password"

// ****** FILTRAR ******
export const useFilterUsersQuery = () => {
  const [filterParamsUsers, setFilterParamsUsers] = useState(filterParamsInit)
  const token = useSessionStore(state => state.tknSession)
  const queryClient = useQueryClient()

  const {
    data,
    isError,
    isLoading,
    isFetching,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery<FilterUsersResp, Error>({
    queryKey: ['users'],
    queryFn: ({pageParam = 1, signal}) => {
      const page = pageParam as number
      return filterFetch({
        filterParams: filterParamsUsers,
        url: `${apiURL}users/filter_users?page=${page}`,
        signal,
        token
      })
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.next != 0 ? lastPage.next : undefined
    },
    getPreviousPageParam: (lastPage) => lastPage.previous ?? undefined,
    staleTime: 1000 * 60 * 5 
  })
  const resetear = ()=>{
    queryClient.resetQueries({ queryKey: ['users'], exact: true });
    setFilterParamsUsers(filterParamsInit)
  }

  useEffect(() => {
    return () => {
      resetear()
    }
  },[])
  
  useEffect(() => {
    queryClient.invalidateQueries({queryKey:["users"]})
  }, [filterParamsUsers])

  // useEffect(()=>{
  //   if(data?.pages[data?.pages.length-1].errorType === "errorToken"){
  //     // resetSessionStore()
  //     navigate("/auth")
  //   }
  // },[data])

  return {
    data,
    isError, 
    isLoading, 
    isFetching, 
    hasNextPage, 
    fetchNextPage,
    setFilterParamsUsers
  }
}

// ****** MUTATION ******
export const useMutationUsersQuery = <T>() => {
  const resetSessionStore = useSessionStore(state => state.resetSessionStore)
  const navigate = useNavigate()
  const tknSession = useSessionStore(state => state.tknSession)
  const Authorization = "Bearer " + tknSession
  const queryClient = useQueryClient()
  const typeActionRef = useRef<TypeAction | "">("")

  const {data, isPending, isError, mutate, } = useMutation<T, Error, MutationFetch, unknown>({
    mutationFn: mutationFetch,
    // onMutate: async ({param}) => {
      // 1: Optimista
      // await queryClient.cancelQueries({ queryKey: ['users'], exact: true })
      // queryClient.setQueryData(["users"], (oldData: InfiniteData<any, unknown> | undefined) => {
      //   let newData = structuredClone(oldData)
      //   oldData?.pages.forEach((page, idxPage) => { 
      //     const idxUser = page.content.findIndex((el: User)=>el.id === param.id)
      //     if(idxUser !== -1 && newData){
      //       newData.pages[idxPage].content[idxUser] = param
      //     }
      //   })
      //   return {...newData, pages: newData?.pages}
      // })
    // },
    onSuccess: (resp) => {
      const r = resp as ResponseQuery
      if(r?.msgType !== 'success') return
      queryClient.invalidateQueries({queryKey:["users"]})

      // 1: Actualizando la lista manualmente
      // queryClient.setQueryData(["users"], (oldData: InfiniteData<any, unknown> | undefined) => {
      //   let newData = structuredClone(oldData)
      //   oldData?.pages.forEach((page, idxPage) => { 
      //     const idxUser = page.content.findIndex((el: User)=>el.id === resp.registro.id)
      //     if(idxUser !== -1 && newData){
      //       newData.pages[idxPage].content[idxUser] = resp.registro
      //     }
      //   })
      //   return {...newData, pages: newData?.pages}
      // })

      // 2: Haciendo refetch de la lista
    }
  })

  // const filterUserFull = () => {// Sin Paginacion
  //   typeActionRef.current = "filter_full"
  //   const params = {
  //     url: apiURL + "users/filter_users_full",
  //     method: "POST",
  //     headers:{ 
  //       Authorization,
  //     },
  //     body: JSON.stringify(filterParamsUsers),
  //   }
  //   mutate(params)
  // }

  const getUser = (id: number) => {
    const params = {
      url: apiURL + "users/get_user",
      method: "POST",
      headers:{ 
        Authorization,
      },
      body: JSON.stringify({id}),
    }
    mutate(params)
  }

  const getProfile = (id: number) => {
    const params = {
      url: apiURL + "users/get_profile",
      method: "POST",
      headers:{ 
        Authorization,
      },
      body: JSON.stringify({id}),
    }
    mutate(params)
  }

  const createUser = (user: User) => {
    typeActionRef.current = "mutate_user"
    const params = {
      url: apiURL + "users/create_user",
      method: "POST",
      headers:{ 
        Authorization,
      },
      body: JSON.stringify(user),
    }
    mutate(params)
  }

  const signUp = (registro: RegisterForm) => { // registrarse
    typeActionRef.current = "sign_up"
    const params = {
      url: apiURL + "users/sign_up",
      method: "POST",
      body: JSON.stringify(registro),
    }
    mutate(params)
  }

  const updateUser = (user: User) => {
    typeActionRef.current = "mutate_user"
    const params = {
      url: apiURL + "users/update_user",
      method: "PUT",
      headers:{ 
        Authorization,
      },
      body: JSON.stringify(user),
    }
    mutate(params)
  }

  const setStateUser = (estado: number) => {
    typeActionRef.current = "mutate_user"
    const params = {
      url: apiURL + "users/set_state_user",
      method: "PUT",
      headers:{ 
        Authorization,
      },
      body: JSON.stringify({estado}),
    }
    mutate(params)
  }

  const updateProfile = (user: User) => {
    typeActionRef.current = "mutate_profile"
    const params = {
      url: apiURL + "users/update_profile",
      method: "PUT",
      headers:{ 
        Authorization,
      },
      body: JSON.stringify(user),
    }
    mutate(params)
  }

  const deleteUser = (id: number) => {
    typeActionRef.current = "mutate_user"
    const params = {
      url: apiURL + "users/delete_user",
      method: "DELETE",
      headers:{ 
        Authorization,
      },
      body: JSON.stringify({id}),
    }
    mutate(params)
  }

  const signIn = (param: LoginForm) => { // iniciar sesion
    typeActionRef.current = "login"
    const params = {
      url: apiURL + "users/sign_in",
      method: "POST",
      body: JSON.stringify(param),
    }
    mutate(params)
  }

  const checkAuth = () => {
    typeActionRef.current = "check_auth"
    const params = {
      url: apiURL + "users/check_auth",
      method: "POST",
      headers:{ 
        Authorization,
      },
    }
    mutate(params)
  }

  const checkPassword = (password: string) => { // En modal confirmacion con password
    typeActionRef.current = "check_password"
    const params = {
      url: apiURL + "users/check_password",
      method: "POST",
      headers:{ 
        Authorization,
      },
      body: JSON.stringify({password}),
    }
    mutate(params)
  }

  const getEmailByUsername = (username: string) => {
    const params = {
      url: apiURL + "users/get_email_by_username",
      method: "POST",
      body: JSON.stringify({username}),
    }
    mutate(params)
  }

  const sendCodeRestoration = (param: {email: string, username: string}) => {
    typeActionRef.current = "send_code_restoration"
    const params = {
      url: apiURL + "users/send_code_restoration",
      method: "POST",
      body: JSON.stringify(param),
    }
    mutate(params)
  }
  
  const restorePassword = (param: any) => {
    typeActionRef.current = "restore_password"
    const params = {
      url: apiURL + "users/restore_password",
      method: "POST",
      body: JSON.stringify(param),
    }
    mutate(params)
  }

  useEffect(()=>{
    const r = data as ResponseQuery
    if(r?.errorType === "errorToken"){
      resetSessionStore()
      navigate("/auth")
    }
  },[data])

  return {
    data, 
    isPending, 
    isError,
    getUser,
    getProfile,
    createUser,
    signUp,
    updateUser,
    setStateUser,
    updateProfile,
    deleteUser,
    signIn,
    checkAuth,
    checkPassword,
    getEmailByUsername,
    sendCodeRestoration,
    restorePassword,
  }
}


