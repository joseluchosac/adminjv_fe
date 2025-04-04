import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import { TareaT } from "../../core/types";

interface Props {
  tareaForm: TareaT;
  setTareaForm: (tarea: TareaT) => void;
  guardarTarea: () => void;
  resetearFormulario: () => void;
}

function Formulario({ tareaForm, setTareaForm, guardarTarea, resetearFormulario}: Props) {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTareaForm({...tareaForm, [e.target.name]:e.target.value})
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    guardarTarea()
    const element = e.target as HTMLFormElement
    element.descripcion.focus()
    resetearFormulario()
  }

  return (
    <Card>
      <Card.Header style={{ backgroundColor: "brown" }}>
        Formulario de tareas
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Form.Group as={Col} sm={8}>
              <Form.Label>Descripcion</Form.Label>
              <Form.Control
                name="descripcion"
                value={tareaForm.descripcion}
                onChange={handleChange}
                placeholder="Pasear al perro"
                />
            </Form.Group>
            <Form.Group as={Col} sm={4}>
              <Form.Label>Encargado</Form.Label>
              <Form.Control
                name="encargado"
                value={tareaForm.encargado}
                onChange={handleChange}
                placeholder="Jose"
              />
            </Form.Group>
          </Row>
          <Button variant="primary" type="submit" style={{marginRight: '8px'}}>
            Guardar
          </Button>
          <Button onClick={resetearFormulario} variant="primary" type="button">
            Reset
          </Button>
        </Form>
      </Card.Body>
      <Card.Footer className="text-muted">2 days ago</Card.Footer>
    </Card>
  );
}

export default Formulario;
