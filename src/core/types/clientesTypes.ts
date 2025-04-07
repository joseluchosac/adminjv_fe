export type Cliente = {
  id: number;
  tipo_documento: string;
  nro_documento: string;
  nombre_razon_social: string;
  direccion: string;
  departamento: string;
  provincia: string;
  distrito: string;
  email: string;
  telefono: string;
  estado: number;
}

export type ClienteForm = {
  id: number;
  tipo_documento_cod: string;
  nro_documento: string;
  nombre_razon_social: string;
  direccion: string;
  ubigeo_inei: string;
  email: string;
  telefono: string;
}