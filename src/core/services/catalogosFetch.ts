const apiURL = import.meta.env.VITE_API_URL

export const getCatalogosFetch = async ({token, signal}: any) => {
  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    signal,
  }
  const res = await fetch(apiURL + "catalogos/get_catalogos", options)
  return res.json()
}
