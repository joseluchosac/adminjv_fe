const apiURL = import.meta.env.VITE_BE_URL + "api/"

export const obtenerCatalogosFetch = async ({token, signal}: any) => {
  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    signal,
  }
  const res = await fetch(apiURL + "catalogos/obtener_catalogos", options)
  return res.json()
}
