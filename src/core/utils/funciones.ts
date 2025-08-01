// Genera arbol a partir de un arreglo de objetos

import { Modulo } from "../types";



export function getModulosTree(data: Modulo[]): Modulo[] {
  const mapa = new Map();
  const raiz: Modulo[] = [];
  // Crear un mapa de los elementos
  data.forEach(item => {
    mapa.set(item.id, { ...item, children: [] });
  });
  // Construir el árbol
  data.forEach(item => {
    if (item.padre_id === 0) {
      raiz.push(mapa.get(item.id));
    } else {
      const padre = mapa.get(item.padre_id);
      if (padre) {
        padre.children.push(mapa.get(item.id));
      }
    }
  });
  return raiz;
}

// ✅ UTILIDADES PARA GENERAR ARBOL DE UN ARREGLO JERARQUIZABLE

interface ArregloBase {
  id: number;
  nombre: string;
  descripcion: string;
  padre_id: number;
  [key: string]: any; // Permite propiedades adicionales
}
interface ArregloJerarquico extends ArregloBase {
  children: ArregloJerarquico[];
}

export function generateTree<T extends ArregloBase>(arreglo: T[]): ArregloJerarquico[] {
  const mapa: Record<number, ArregloJerarquico> = {};
  const tree: ArregloJerarquico[] = [];
  // Primero creamos un mapa por id
  arreglo.forEach(cat => {
    // Copiamos todas las propiedades y añadimos el array children
    mapa[cat.id] = { ...cat, children: [] };
  });
  // Luego construimos la jerarquía
  arreglo.forEach(cat => {
    if (cat.padre_id === 0) {
      tree.push(mapa[cat.id]);
    } else {
      if (mapa[cat.padre_id]) {
        mapa[cat.padre_id].children.push(mapa[cat.id]);
      }
    }
  });
  return tree;
}
// ✅ FUNCION PARA APLANAR UN ARBOL DE UN ARREGLO JERARQUIZADO
interface ArregloJerarquizado {
  id: number;
  descripcion: string;
  padre_id: number;
  children?: ArregloJerarquizado[];
  [key: string]: any; // Propiedades adicionales
}

export function flattenTree(tree: ArregloJerarquizado[], padreId: number = 0, nivel: number = 0): ArregloJerarquizado[] {
  let resultado: ArregloJerarquizado[] = [];
  tree.forEach(nodo => {
    // Extraer children y crear copia del nodo sin la propiedad children
    const { children, ...nodoPlano } = nodo;
    // Crear el nodo plano con el padre_id correcto
    const nodoAplanado = { ...nodoPlano, padre_id: padreId, nivel };
    resultado.push(nodoAplanado);
    
    // Procesar children recursivamente
    if (children && children.length > 0) {
      const childrenAplanados = flattenTree(children, nodo.id, nivel+1);
      resultado = resultado.concat(childrenAplanados);
    }
  });
  return resultado;
}


// ✅ FUNCION RECURSIVA QUE DEVUELVE UN NUEVO ARREGLO DE LOS ANCESTROS DE UN
// ELEMENTO A PARTIR DE UN ARREGLO DE ELEMENTOS
// del areglo: [elemento1, elemento2, elemento3, ...]
// devielve: [..., elementoAbuelo, elementoPadre, ElementoActual]
type elemento = {
  id: number;
  descripcion: string;
  padre_id: number
}
export function getBranch(id: number, arreglo: elemento[], branch: elemento[]=[]){
  const elemento = arreglo.find((el)=>el.id === id) as elemento
    branch.unshift(elemento)
  if(elemento?.padre_id){
    return getBranch(elemento.padre_id, arreglo, branch)
  }else{
    return branch
  }
}
// ✅ UTILIDADES PARA CAMBIAR EL TEXTO A ARREGLO Y VICEVERSA DEL CAMPO categoria_ids DE LA TABLA productos
// const texto = ",7,2,13,4,"
// console.log(texto.split(",").filter(el=>el).map(el=>parseInt(el)));

// const arreglo = [ 7, 2, 13, 4 ]
// console.log(`,${arreglo.join(",")},`)

// ✅ DEBOUNCE QUE NO RETORNA VALOR
// Ejemplo de uso debounce
// const miFuncion = () => console.log("Ejecutado!");
// const debouncedFunction = debounce(miFuncion, 1000);
// debouncedFunction(); // Se ejecutará después de 1 segundo si no se vuelve a llamar antes
export function debounce<T extends (...args: any[]) => void>(
  func: T, 
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return function(...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// ✅ DEBOUNCE QUE RETORNA VALOR
// Ejemplo de uso debounceReturn
// const sumar = (a: number, b: number): number => a + b;
// const debouncedSumar = debounce(sumar, 1000);
// debouncedSumar(3, 5).then(resultado => console.log(`Resultado: ${resultado}`)); // Se ejecutará después de 1 segundo si no se vuelve a llamar antes

export function debounceReturn<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>): Promise<ReturnType<T>> => {
    return new Promise((resolve) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => resolve(func(...args)), wait);
    });
  };
}



//  GENERAR COOKIE
//--> ***********************************************
// Ejemplo de uso:
// setCookie("user", "John Doe", 30);
export function setCookie(nombre: string, valor: string, dias: number): void {
  const fecha: Date = new Date();
  fecha.setTime(fecha.getTime() + (dias * 24 * 60 * 60 * 1000));
  const expira: string = "expires=" + fecha.toUTCString();
  document.cookie = `${nombre}=${valor};${expira};path=/`;
}


// ✅ OBTENER EL VALOR DE LA COOKIE POR EL NOMBRE
// Ejemplo de uso:
// const user: string | null = getCookie("user");
// console.log(user); // Imprimirá "John Doe" si la cookie existe
export function getCookie(nombre: string): string | null {
  const nombreEQ: string = nombre + "=";
  const partes: string[] = document.cookie.split(';');
  for (let i: number = 0; i < partes.length; i++) {
    let parte: string = partes[i].trim();
    if (parte.indexOf(nombreEQ) === 0) {
      return parte.substring(nombreEQ.length, parte.length);
    }
  }
  return null;
}

// ✅ RETORNA UN OBJETO A BASE64
export function objToUriBase64(par:any){
  const param = JSON.stringify(par)
  return btoa(encodeURIComponent(param))
}
// ✅ RETORNA UNA CADENA BASE64 A OBJETO
export function uriBase64ToObj(par: string){
  const param = atob(par)
  return JSON.parse(decodeURIComponent(param))
}

// ✅ FUNCION ASINCRONA RECIBE PARAMETRO DE RESTRASO
export async function delay(ms: number){
  return new Promise(resolve => setTimeout(resolve,ms))
}

// ✅ FUNCION QUE DEVUELVE UN SLUG A PARTIR DE UN STRING
// const titulo = "Este es un Título con Espacios y Caracteres Especiales";
// const slug = generarSlug(titulo);
// console.log(slug); // Output: este-es-un-titulo-con-espacios-y-caracteres-especiales
export function generarSlug(texto: string) {
  texto = texto.trim();  // Eliminar espacios al principio y al final
  texto = texto.toLowerCase();  // Convertir a minúsculas
  texto = texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');  // Reemplazar caracteres especiales y acentos
  texto = texto.replace(/\s+/g, '-');  // Reemplazar espacios por guiones
  texto = texto.replace(/[^a-z0-9-]/g, '');  // Eliminar caracteres no alfanuméricos ni guiones
  texto = texto.replace(/-+/g, '-');  // Eliminar guiones duplicados
  texto = texto.replace(/^-+|-+$/g, '');  // Eliminar guiones al principio y al final
  return texto;
}

// ✅ FUNCION QUE GENERA UNA CADENA ALFANUMERICA ALEATORIA
// Ejemplo de uso:
// const cadena = generarCadenaAlfanumerica(10);
// console.log(cadena);
export function cadena(longitud: number): string {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let resultado = '';
  for (let i = 0; i < longitud; i++) {
    resultado += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return resultado;
}

// ✅ FUNCION QUE RECORTA UNA CADENA DE TEXTO AUMENTANDO '...'
export function cropText(texto: string, limite = 20) {
  return texto.length > limite ? texto.slice(0, limite) + '...' : texto;
}