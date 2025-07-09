import { MutationFetch } from "../types"

export const mutationFetch = async ({
  newValues=null, // objeto que actualizara la data de la mutacion sin realizar el fetch
  url = "", 
  method = "GET",
  headers = null,
  body = null,
}: MutationFetch) => {
  if(newValues){ return newValues }
  let options: RequestInit = {
    method, 
    credentials: "include" // envio de cookies
  }
  if(headers){ options.headers = headers }
  if(body){ options.body = body }
  const response = await fetch(url, options);
  if(!response.ok) throw new Error("Hubo un error en la respuesta");
  return response.json()
}

