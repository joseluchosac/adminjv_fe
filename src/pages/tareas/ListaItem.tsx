import DynaIcon from "../../core/components/DynaComponents";
import { TareaT } from "../../core/types";

interface Props {
  tarea: TareaT;
  eliminarTarea: (id: number) => void;
  toEdit: (id: number) => void;
}

function ListaItem({ tarea, eliminarTarea, toEdit }: Props) {

  const handleEliminarTarea = () => {
    eliminarTarea(tarea.id)
  }

  const handleToEdit = () => {
    toEdit(tarea.id)
  }
  
  return (
    <tr key={tarea.id}>
      <td>{tarea.id}</td>
      <td>{tarea.descripcion}</td>
      <td>{tarea.encargado}</td>
      <td>
        <button
          onClick={handleEliminarTarea}
          className="btn btn-sm"
        >
          <DynaIcon name="FaTrash" className="text-danger" />
        </button>
        <button
          onClick={handleToEdit}
          className="btn btn-sm"
        >
          <DynaIcon name="FaEdit" className="text-info" />
        </button>
      </td>
    </tr>
  );
}

export default ListaItem;
