
type MutationFetch = {
  newValues?: any;
  url?: string;
  method?: string;
  headers?: any;
  body?: any
}

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
  const res = await fetch(url, options);
  return res.json()
}

