// Genera arbol a partir de un arreglo de objetos

import { Categoria, Modulo } from "../types";


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

// Ejemplo de uso getModulosTree
// const modulos = [
//   { id: 1, padre_id: null, descripcion: 'Raíz' },
//   { id: 2, padre_id: 1, descripcion: 'Hijo 1' },
//   { id: 3, padre_id: 1, descripcion: 'Hijo 2' },
//   { id: 4, padre_id: 2, descripcion: 'Nieto 1' },
//   { id: 5, padre_id: 2, descripcion: 'Nieto 2' }
// ];

// const arbol = getModulosTree(datos);

export function getCategoriasTree(data: Categoria[]): Categoria[] {
  const mapa = new Map();
  const raiz: Categoria[] = [];
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
// Ejemplo de uso debounce
// const miFuncion = () => console.log("Ejecutado!");
// const debouncedFunction = debounce(miFuncion, 1000);

// debouncedFunction(); // Se ejecutará después de 1 segundo si no se vuelve a llamar antes

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

// Ejemplo de uso debounceReturn
// const sumar = (a: number, b: number): number => a + b;
// const debouncedSumar = debounce(sumar, 1000);
// debouncedSumar(3, 5).then(resultado => console.log(`Resultado: ${resultado}`)); // Se ejecutará después de 1 segundo si no se vuelve a llamar antes


//--> GENERAR COOKIE
//--> ***********************************************
export function setCookie(nombre: string, valor: string, dias: number): void {
  const fecha: Date = new Date();
  fecha.setTime(fecha.getTime() + (dias * 24 * 60 * 60 * 1000));
  const expira: string = "expires=" + fecha.toUTCString();
  document.cookie = `${nombre}=${valor};${expira};path=/`;
}
// Ejemplo de uso:
// setCookie("user", "John Doe", 30);

//--> OBTENER EL VALOR DE LA COOKIE POR EL NOMBRE
//--> ***********************************************
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
// Ejemplo de uso:
// const user: string | null = getCookie("user");
// console.log(user); // Imprimirá "John Doe" si la cookie existe

export function objToUriBase64(par:any){
  const param = JSON.stringify(par)
  return btoa(encodeURIComponent(param))
}

export async function delay(ms: number){
  return new Promise(resolve => setTimeout(resolve,ms))
}

// ✅ FUNCION RECURSIVA QUE DEVUELVE UN NUEVO ARREGLO DE LOS ANCESTROS DE UN
// ELEMENTO A PARTIR DE UN ARREGLO DE ELEMENTOS
// [..., elementoAbuelo, elementoPadre, ElementoHijo]
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
// utilidades
// const texto = "-2,-13,-8,"
// console.log(texto.split(",").filter(el=>el).map(el=>parseInt(el.slice(1))));

// const arreglo = [ 2, 13, 8 ]
// console.log(arreglo.map(el=>"-"+el+",").join(''))

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
