import { TareaT } from "../../core/types";

export const tareasInit: TareaT[] = []

type TareaReducerAction =
  { type: "agregar_tarea"; payload: { tarea: TareaT };} | 
  { type: "modificar_tarea"; payload: { tarea: TareaT };} | 
  { type: "eliminar_tarea"; payload: { id: number }; }

const tareasReducer = (state: TareaT[], action: TareaReducerAction) => {
  switch (action.type) {
    case "agregar_tarea": {
      const { tarea } = action.payload;
      return [...state, { ...tarea, id: Date.now() }];
    }
    case "modificar_tarea": {
      const { payload } = action;
      const idx = state.findIndex((tarea) => tarea.id === payload.tarea.id);
      state[idx] = payload.tarea;
      return [...state];
    }
    case "eliminar_tarea": {
      const { payload } = action;
      const newState = state.filter((tarea) => tarea.id !== payload.id);
      return [...newState];
    }
    default:
      return state;
  }
};

export { tareasReducer };
