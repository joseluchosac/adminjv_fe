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
  const res = await fetch(url, options)
  if(!res.ok) throw new Error("Error en la peticion");
  return res.json()
}

