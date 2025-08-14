const apiURL = import.meta.env.VITE_API_URL;
import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom";
import { InfiniteData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import useSessionStore from "../../app/store/useSessionStore"
import { 
  FilterQueryResp,
  FetchOptions,
  LoginForm, 
  QueryResp, 
  UserItem, 
  UserSession, 
  UserFormType,
  RegisterFormType,
  ProfileFormType,
} from "../../app/types"
import { useUsers } from "../../pages/users/context/UsersContext";
import { useDebounce } from "react-use";
import { toast } from "react-toastify";
import { fnFetch } from "../fnFetch";

type TypeAction = 
"mutate_user" 
| "mutate_create_user" 
| "mutate_update_user" 
| "mutate_delete_user" 
| "mutate_state_user" 
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
  const token = useSessionStore(state => state.tknSession)
  const queryClient = useQueryClient()

  const {
    stateUsers: {userFilterForm, userFilterParam ,camposUser},
    dispatchUsers
  } = useUsers()

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
        url: `${apiURL}users/filter_users?page=${page}`,
        body: JSON.stringify(userFilterParam),
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
  });

  const resetear = ()=>{
    queryClient.resetQueries({ queryKey: ['users'], exact: true });
  }

  useDebounce(() => {
      if (
        userFilterForm.search.toLowerCase().trim() ==
        userFilterParam.search.toLowerCase().trim()
      ) return;
      dispatchUsers({type: "SET_USER_FILTER_PARAM"})
    }, 500, [userFilterForm.search]
  );

  useEffect(() => {
    return () => {
      resetear()
    }
  },[])
  
  useEffect(() => {
    dispatchUsers({type: "SET_USER_FILTER_PARAM"})
  }, [userFilterForm.order, userFilterForm.equal])

  useEffect(() => {
    dispatchUsers({type: "SET_USER_FILTER_PARAM_BETWEEN"})
  }, [userFilterForm.between])

  useEffect(() => {
    queryClient.invalidateQueries({queryKey:["users"]})
  }, [userFilterParam])

  useEffect(()=>{
    if(data?.pages[0].error || isError){
      toast.error("Error al obtener registros")
      return
    }
    if(!isFetching){
      dispatchUsers({type: 'SET_USER_FILTER_INFO'});
    }
  },[data, isError, isFetching])



  return {
    data,
    isError, 
    isLoading, 
    isFetching, 
    hasNextPage, 
    fetchNextPage,
    dispatchUsers,
    camposUser,
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
    // onMutate: (datoMutate) => {// 1: Manual optimista antes del success
    //   // console.log("onMutate", datoMutate)
    // },
    onSuccess: (resp) => {
      const r = resp as QueryResp
      if(r?.msgType !== 'success') return
      // 2: Haciendo refetch de la lista
      // queryClient.invalidateQueries({queryKey:["users"]})
      // 3: Manual: Actualiza los registros despues de un success
      if(typeActionRef.current === "mutate_create_user") {
        const createdUser = r.content as UserItem
        queryClient.setQueryData(["users"], (oldData: InfiniteData<UsersFilQryRes, unknown> | undefined) => {
          const pages = structuredClone(oldData?.pages)
          if((pages?.length || 0) < 4){ // hacer refetch si se cumple esta condicion
            queryClient.invalidateQueries({queryKey:["users"]})
            return oldData
          }
          if(pages && pages.length > 0){
            pages[0].filas.unshift(createdUser as UserItem) // Agrega el nuevo usuario al inicio de la primera página
            pages[0].num_regs = pages[0].num_regs + 1
          }
          return {...oldData, pages, }
        })
      }else if(typeActionRef.current === "mutate_update_user" || typeActionRef.current === "mutate_state_user") {
        const updatedUser = r.content as UserItem
        queryClient.setQueryData(["users"], (oldData: InfiniteData<UsersFilQryRes, unknown> | undefined) => {
          const pages = structuredClone(oldData?.pages)
          if((pages?.length || 0) < 4){
            queryClient.invalidateQueries({queryKey:["users"]})
            return oldData
          }
          for(let idxPage in pages){
            const idxFila = pages[parseInt(idxPage)].filas.findIndex((el: UserItem)=>el.id === updatedUser.id)
            if(idxFila !== -1){
              pages[parseInt(idxPage)].filas[idxFila] = updatedUser // Actualiza el usuario en la lista
              break
            }
          }
          return {...oldData, pages}
        })
      }else if(typeActionRef.current === "mutate_delete_user") {
        const deletedUserId = r.content as UserItem["id"]
        queryClient.setQueryData(["users"], (oldData: InfiniteData<UsersFilQryRes, unknown> | undefined) => {
          let pages = structuredClone(oldData?.pages)
          if((pages?.length || 0) < 4){
            queryClient.invalidateQueries({queryKey:["users"]})
            return oldData
          }
          for(let idxPage in pages){
            const idxFila = pages[parseInt(idxPage)].filas.findIndex((el: UserItem)=>el.id === deletedUserId)
            if(idxFila !== -1){
              let filasFiltradas = pages[parseInt(idxPage)].filas.filter(el => el.id !== deletedUserId) // Elimina el usuario de la fila
              pages[parseInt(idxPage)].filas = filasFiltradas
              pages[0].num_regs = pages[0].num_regs - 1
              break
            }
          }
          return {...oldData, pages}
        })
      } 
    },
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

  const createUser = (user: UserFormType) => {
    typeActionRef.current = "mutate_create_user"
    const options: FetchOptions = {
      method: "POST",
      url: apiURL + "users/create_user",
      body: JSON.stringify(user),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const updateUser = (user: UserFormType) => {
    typeActionRef.current = "mutate_update_user"
    const options: FetchOptions = {
      method: "PUT",
      url: apiURL + "users/update_user",
      body: JSON.stringify(user),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const setStateUser = (data: {estado: number, id: number}) => {
    typeActionRef.current = "mutate_state_user"
    const options: FetchOptions = {
      method: "PUT",
      url: apiURL + "users/set_state_user",
      body: JSON.stringify(data),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const deleteUser = (id: number) => {
    typeActionRef.current = "mutate_delete_user"
    const options: FetchOptions = {
      method: "DELETE",
      url: apiURL + "users/delete_user",
      body: JSON.stringify({id}),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const getProfile = () => { // Obtener perfil del usuario
    const options: FetchOptions = {
      method: "POST",
      url: apiURL + "users/get_profile",
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const updateProfile = (user: ProfileFormType) => {
    typeActionRef.current = "mutate_profile"
    const options: FetchOptions = {
      method: "PUT",
      url: apiURL + "users/update_profile",
      body: JSON.stringify(user),
      authorization: "Bearer " + token,
    }
    mutate(options)
  }

  const signUp = (registro: RegisterFormType) => { // registrarse
    typeActionRef.current = "sign_up"
    const options: FetchOptions = {
      method: "POST",
      url: apiURL + "users/sign_up",
      body: JSON.stringify(registro),
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

  const checkAuth = () => { // Verificar autenticacion
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


