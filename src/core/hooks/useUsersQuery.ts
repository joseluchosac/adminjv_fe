const apiURL = import.meta.env.VITE_API_URL;
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import useSessionStore from "../store/useSessionStore"
import useUsersStore, { usersStoreInit } from "../store/useUsersStore"
import { useEffect, useState } from "react"
import { filterUsersFetch } from "../services/usersFetch"
import { LoginForm, RegisterForm, UserForm } from "../types"
import { mutationFetch } from "../services/mutationFecth"
import { useNavigate } from "react-router-dom";
// ****** FILTRAR USUARIOS ******
export const useFilterUsersQuery = () => {
  const resetSessionStore = useSessionStore(state => state.resetSessionStore)
  const navigate = useNavigate()
  const [isEnabledQuery, setIsEnabledQuery] = useState(false)
  const tknSession = useSessionStore(state => state.tknSession)
  const filterParamsUsers = useUsersStore(state => state.filterParamsUsers)
  const queryClient = useQueryClient()
  const setFilterParamsUsers = useUsersStore(state => state.setFilterParamsUsers)


  const {fetchNextPage, data, refetch, isError, isLoading, isFetching, hasNextPage,  } = useInfiniteQuery({
    queryKey: ['users'],
    queryFn: ({pageParam = 1, signal}) => {
      return filterUsersFetch({filterParamsUsers, pageParam, signal, token: tknSession})
    },
    initialPageParam: 1,
    enabled: isEnabledQuery,
    getNextPageParam: (lastPage) => {
      return lastPage.next != 0 ? lastPage.next : undefined
    },
    getPreviousPageParam: (lastPage) => lastPage.previous ?? undefined,
    staleTime: 1000 * 60 * 5 
  })

  useEffect(() => {
    queryClient.resetQueries({ queryKey: ['users'], exact: true });
    return () => {
      queryClient.setQueryData(['users'], () => null)
      setFilterParamsUsers(usersStoreInit.filterParamsUsers)
    }
  },[])
  
  useEffect(() => {
    if(!isEnabledQuery){
      setIsEnabledQuery(true)
    }else{
      refetch()
    }
  }, [filterParamsUsers])

  useEffect(()=>{
    if(data?.pages[data?.pages.length-1].msgType === "errorToken"){
      resetSessionStore()
      navigate("/auth")
    }
  },[data])

  return {
    data,
    fetchNextPage, 
    isError, 
    isLoading, 
    isFetching, 
    hasNextPage, 
  }
}

// ****** MUTATION USUARIOS ******
export const useMutationUsersQuery = () => {
  const resetSessionStore = useSessionStore(state => state.resetSessionStore)
  const navigate = useNavigate()
  const tknSession = useSessionStore(state => state.tknSession)
  const nombreModulo = useSessionStore(state => state.moduloActual?.nombre)
  const Authorization = "Bearer " + tknSession
  const filterParamsUsers = useUsersStore(state => state.filterParamsUsers)

  const queryClient = useQueryClient()

  const {data, isPending, isError, mutate, } = useMutation({
    mutationFn: mutationFetch,
    // onMutate: async ({param}) => {
      // 1: Optimista
      // await queryClient.cancelQueries({ queryKey: ['users'], exact: true })
      // queryClient.setQueryData(["users"], (oldData: InfiniteData<any, unknown> | undefined) => {
      //   let newData = structuredClone(oldData)
      //   oldData?.pages.forEach((page, idxPage) => { 
      //     const idxUser = page.filas.findIndex((el: User)=>el.id === param.id)
      //     if(idxUser !== -1 && newData){
      //       newData.pages[idxPage].filas[idxUser] = param
      //     }
      //   })
      //   return {...newData, pages: newData?.pages}
      // })
    // },
    onSuccess: (resp) => {
      if(resp.msgType !== 'success') return

      // 1: Actualizando la lista manualmente
      // queryClient.setQueryData(["users"], (oldData: InfiniteData<any, unknown> | undefined) => {
      //   let newData = structuredClone(oldData)
      //   oldData?.pages.forEach((page, idxPage) => { 
      //     const idxUser = page.filas.findIndex((el: User)=>el.id === resp.registro.id)
      //     if(idxUser !== -1 && newData){
      //       newData.pages[idxPage].filas[idxUser] = resp.registro
      //     }
      //   })
      //   return {...newData, pages: newData?.pages}
      // })

      // 2: Haciendo refetch de la lista
      queryClient.invalidateQueries({queryKey:["users"]})
    }
  })

  const filterUserFull = () => {// Sin Paginacion
    const params = {
      url: apiURL + "users/filter_users_full",
      method: "POST",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify(filterParamsUsers),
    }
    mutate(params)
  }

  const getUser = (id: number) => {
    const params = {
      url: apiURL + "users/get_user",
      method: "POST",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify({id}),
    }
    mutate(params)
  }

  const getUserSession = (id: number) => {
    const params = {
      url: apiURL + "users/get_user_session",
      method: "POST",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify({id}),
    }
    mutate(params)
  }

  const createUser = (param: UserForm) => {
    const params = {
      url: apiURL + "users/create_user",
      method: "POST",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify(param),
    }
    mutate(params)
  }

  const signUp = (param: RegisterForm) => { // registrarse
    const params = {
      url: apiURL + "users/sign_up",
      method: "POST",
      // contentType: "application/json",
      body: JSON.stringify(param),
    }
    mutate(params)
  }

  const updateUser = (user: UserForm) => {
    const params = {
      url: apiURL + "users/update_user",
      method: "PUT",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify(user),
    }
    mutate(params)
  }

  const updateUserSession = (user: UserForm) => {
    const params = {
      url: apiURL + "users/update_user_session",
      method: "PUT",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify(user),
    }
    mutate(params)
  }

  const deleteUser = (id: number) => {
    const params = {
      url: apiURL + "users/delete_user",
      method: "DELETE",
      headers:{ 
        Authorization,
        'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify({id}),
    }
    mutate(params)
  }

  const signIn = (param: LoginForm) => { // iniciar sesion
    const params = {
      url: apiURL + "users/sign_in",
      method: "POST",
      // contentType: "application/json",
      body: JSON.stringify(param),
    }
    mutate(params)
  }

  const checkAuth = () => {
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
    const params = {
      url: apiURL + "users/check_password",
      method: "POST",
      headers:{ 
        Authorization,
        // 'nombre-modulo': nombreModulo,
      },
      body: JSON.stringify({password}),
    }
    mutate(params)
  }

  const getEmailByUsername = (username: string) => {
    const params = {
      url: apiURL + "users/get_email_by_username",
      method: "POST",
      // contentType: "application/json",
      body: JSON.stringify({username}),
    }
    mutate(params)
  }

  const sendCodeRestoration = (param: {email: string, username: string}) => {
    const params = {
      url: apiURL + "users/send_code_restoration",
      method: "POST",
      // contentType: "application/json",
      body: JSON.stringify(param),
    }
    mutate(params)
  }
  
  const restorePassword = (param: any) => {
    const params = {
      url: apiURL + "users/restore_password",
      method: "POST",
      // contentType: "application/json",
      body: JSON.stringify(param),
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
    isError,
    filterUserFull,
    getUser,
    getUserSession,
    createUser,
    signUp,
    updateUser,
    updateUserSession,
    deleteUser,
    signIn,
    checkAuth,
    checkPassword,
    getEmailByUsername,
    sendCodeRestoration,
    restorePassword,
  }
}


