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