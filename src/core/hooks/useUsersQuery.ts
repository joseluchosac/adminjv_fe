const apiURL = import.meta.env.VITE_API_URL;
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import useSessionStore from "../store/useSessionStore"
import { FilterQueryResp, FetchOptions, LoginForm, RegisterForm, QueryResp, User, UserItem, UserSession } from "../types"
import { filterParamInit } from "../utils/constants";
import { fnFetch } from "../services/fnFetch";

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

interface UserSessionqryRes extends QueryResp {content: UserSession}
export const useUserSessionQuery = () => {
  const tknSession = useSessionStore(state => state.tknSession)
  const {data, isFetching} = useQuery<UserSessionqryRes>({
    queryKey: ['user_session'],
    queryFn: () => {
      const options: FetchOptions = {
        method:"POST",
        url: apiURL + "users/get_user_session",
        authorization: "Bearer " + tknSession
      }
      return fnFetch(options)
    },
    staleTime: 1000 * 60 * 60 * 24
  })

  return {
    userSession: data?.content,
    isFetching
  }
}

// ****** FILTRAR ******
interface UsersFilQryRes extends FilterQueryResp {
  filas: UserItem[];
}
export const useFilterUsersQuery = () => {
  const [filterParamsUsers, setFilterParamsUsers] = useState(filterParamInit)
  const token = useSessionStore(state => state.tknSession)
  const queryClient = useQueryClient()
  const {
    data,
    isError,
    isLoading,
    isFetching,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery<UsersFilQryRes, Error>({
    queryKey: ['users'],
    queryFn: ({pageParam = 1, signal}) => {
      const page = pageParam as number
      const options: FetchOptions = {
        method: "POST",
        url: `${apiURL}users/filter_users2?page=${page}`,
        body: JSON.stringify(filterParamsUsers),
        authorization: "Bearer " + token,
        signal
      }
      return fnFetch(options)
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
    setFilterParamsUsers(filterParamInit)
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
  const token = useSessionStore(state => state.tknSession)
  const queryClient = useQueryClient()
  const typeActionRef = useRef<TypeAction | "">("")

  const {data, isPending, isError, mutate, } = useMutation<T, Error, FetchOptions, unknown>({
    mutationKey: ['mutation_users'],
    mutationFn: fnFetch,
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
      const r = resp as QueryResp
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

  const getUser = (id: number) => {
    const options: FetchOptions = {
      method: "POST",
      url: apiURL + "users/get_user",
      body: JSON.stringify({id}),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const getProfile = () => {
    const options: FetchOptions = {
      method: "POST",
      url: apiURL + "users/get_profile",
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const createUser = (user: User) => {
    typeActionRef.current = "mutate_user"
    const options: FetchOptions = {
      method: "POST",
      url: apiURL + "users/create_user",
      body: JSON.stringify(user),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const signUp = (registro: RegisterForm) => { // registrarse
    typeActionRef.current = "sign_up"
    const options: FetchOptions = {
      method: "POST",
      url: apiURL + "users/sign_up",
      body: JSON.stringify(registro),
    }
    mutate(options)
  }

  const updateUser = (user: User) => {
    typeActionRef.current = "mutate_user"
    const options: FetchOptions = {
      method: "PUT",
      url: apiURL + "users/update_user",
      body: JSON.stringify(user),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const setStateUser = (data: {estado: number, id: number}) => {
    typeActionRef.current = "mutate_user"
    const options: FetchOptions = {
      method: "PUT",
      url: apiURL + "users/set_state_user",
      body: JSON.stringify(data),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const updateProfile = (user: User) => {
    typeActionRef.current = "mutate_profile"
    const options: FetchOptions = {
      method: "PUT",
      url: apiURL + "users/update_profile",
      body: JSON.stringify(user),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const deleteUser = (id: number) => {
    typeActionRef.current = "mutate_user"
    const options: FetchOptions = {
      method: "DELETE",
      url: apiURL + "users/delete_user",
      body: JSON.stringify({id}),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const signIn = (param: LoginForm) => { // iniciar sesion
    typeActionRef.current = "login"
    const options: FetchOptions = {
      method: "POST",
      url: apiURL + "users/sign_in",
      body: JSON.stringify(param),
    }
    mutate(options)
  }

  const checkAuth = () => {
    typeActionRef.current = "check_auth"
    const options: FetchOptions = {
      method: "POST",
      url: apiURL + "users/check_auth",
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const checkPassword = (password: string) => { // En modal confirmacion con password
    typeActionRef.current = "check_password"
    const options: FetchOptions = {
      method: "POST",
      url: apiURL + "users/check_password",
      body: JSON.stringify({password}),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const getEmailByUsername = (username: string) => {
    const options: FetchOptions = {
      method: "POST",
      url: apiURL + "users/get_email_by_username",
      body: JSON.stringify({username}),
    }
    mutate(options)
  }

  const sendCodeRestoration = (param: {email: string, username: string}) => {
    typeActionRef.current = "send_code_restoration"
    const options: FetchOptions = {
      method: "POST",
      url: apiURL + "users/send_code_restoration",
      body: JSON.stringify(param),
    }
    mutate(options)
  }
  
  const restorePassword = (param: any) => {
    typeActionRef.current = "restore_password"
    const options: FetchOptions = {
      method: "POST",
      url: apiURL + "users/restore_password",
      body: JSON.stringify(param),
    }
    mutate(options)
  }

  useEffect(()=>{
    const r = data as QueryResp
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


