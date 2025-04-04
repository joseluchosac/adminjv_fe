const beURL = import.meta.env.VITE_BE_URL;

export const obtenerCatalogosFetch = async ({token, signal}: any) => {
  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    signal,
  }
  const res = await fetch(beURL + "api/catalogos/obtener_catalogos", options)
  return res.json()
}
