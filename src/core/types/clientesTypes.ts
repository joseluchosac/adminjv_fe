export type Cliente = {
  id: number;
  tipo_documento_cod: string;
  tipo_documento: string;
  nro_documento: string;
  nombre_razon_social: string;
  direccion: string;
  ubigeo_inei: string;
  departamento: string;
  provincia: string;
  distrito: string;
  email: string;
  telefono: string;
  api?: number;
  estado?: number;
}
