import { FetchOptions } from "../types"

export const fnFetch = async({
  method = "GET",
  url,
  body = null,
  includeCredentials = false,
  signal = null,
  head_contentType = "",
  authorization = "",
  attachedData = null,
}: FetchOptions) => {
  let options: RequestInit  = {
    method,
  }
  if(body) {options.body = body}
  if(includeCredentials) {options.credentials = "include"}
  if(signal) {options.signal = signal}
  if(head_contentType) {
    options.headers = {...options.headers, "Content-Type": head_contentType}} 
  if(authorization){
    options.headers = {...options.headers, Authorization: authorization}
  }
  if(attachedData){
    options.headers = {...options.headers, "attached-data": attachedData}
  }
  try {
    const res = await fetch(url, options)
    if(!res.ok) throw new Error("Error en la solicitud");
    return res.json()
  } catch (error) {
    if (error instanceof Error) {
      if(error.name === "AbortError") return;
      return {
        error: true,
        msg: error.message,
        msgType: "error"
      }
    } else {
      console.log("Ocurrió un error desconocido:", error);
    }

  }
}

