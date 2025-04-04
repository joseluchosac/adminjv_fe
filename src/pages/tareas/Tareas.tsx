import { useReducer, useState } from "react";
import Formulario from "./Formulario";
import Lista from "./Lista";
import { tareasInit, tareasReducer } from "./tareasReducer";
// import { TareaT } from "../../core/types";


const tareaFormInit = {id:0, descripcion:'', encargado:''}

function Tareas() {
  const [tareaForm, setTareaForm] = useState(tareaFormInit)
  
  const [tareas, dispatch] = useReducer(tareasReducer, tareasInit)

  const guardarTarea = () => {
    if(tareaForm.id){
      dispatch({
        type: "modificar_tarea",
        payload: {tarea: tareaForm}
      })
    }else{
      dispatch({
        type: "agregar_tarea",
        payload: {tarea: tareaForm}
      })
    }
    resetearFormulario()
  }
  
  const eliminarTarea = (id: number) => {
    dispatch({
      type: "eliminar_tarea",
      payload: {id}
    })
  }
  
  const resetearFormulario = () => {
    setTareaForm(tareaFormInit)
  }
  
  const toEdit = (id: number) => {
    const tareaToEdit = tareas.find(tarea => tarea.id === id)
    if(tareaToEdit){
      setTareaForm(tareaToEdit)
    }
  }

  return (
    <>
      <Formulario 
        tareaForm={tareaForm} 
        setTareaForm={setTareaForm}
        guardarTarea={guardarTarea}
        resetearFormulario={resetearFormulario}
      />
      <Lista 
        tareas={tareas}
        eliminarTarea={eliminarTarea}
        toEdit={toEdit}
      />
    </>
  );
}

export default Tareas;
