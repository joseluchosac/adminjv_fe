import { Card, Table } from "react-bootstrap";
import ListaItem from "./ListaItem";
import { TareaT } from "../../core/types";

interface Props {
  tareas: TareaT[];
  eliminarTarea: (id: number) => void;
  toEdit: (id: number) => void;
}
function Lista({ tareas, eliminarTarea, toEdit }: Props) {

  return (
    <Card className="mt-4">
      <Card.Header style={{ backgroundColor: "brown" }}>
        Tabla de tareas
      </Card.Header>
      <Card.Body>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Descripcion</th>
              <th>Encargado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tareas.map(tarea=>(
              <ListaItem 
                key={tarea.id}
                tarea={tarea}
                eliminarTarea={eliminarTarea}
                toEdit={toEdit}
              />
            ))}
          </tbody>
        </Table>
      </Card.Body>
      <Card.Footer className="text-muted">2 days ago</Card.Footer>
    </Card>
  );
}

export default Lista;
