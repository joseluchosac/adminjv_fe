import { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { FormControlElement } from "../../core/types";
import { Sucursal } from "../../core/types/catalogosTypes";
import useSessionStore from "../../core/store/useSessionStore";
import { useMutationConfigQuery } from "../../core/hooks/useConfigQuery";
import useCatalogosStore from "../../core/store/useCatalogosStore";

const esteTerminalFormInit = {
  establecimiento_id: 0,
  nombre: "",
  descripcion: ""
}

export default function Terminales() {
  const [esteTerminalForm, setEsteTerminalForm] = useState(esteTerminalFormInit)
  const thisTerm = useSessionStore(state => state.thisTerm)
  const setThisTerm = useSessionStore(state => state.setThisTerm)
  const establecimientos = useCatalogosStore(state => state.catalogos?.establecimientos)

  const {
    data: mutation,
    registerTerminal
  } = useMutationConfigQuery()

  const handleChange = (e: React.ChangeEvent<FormControlElement>) => {
    let {name, value}:{name: string, value: string | number} = e.target
    value = name === "establecimiento_id" ? parseInt(value) : value
    setEsteTerminalForm({...esteTerminalForm, [name]:value})
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if(!esteTerminalForm.descripcion){
      console.log('ingrese la descripcion')
      return false
    }
 
    registerTerminal(esteTerminalForm)
  }

  useEffect(() => {
    if(!mutation) return
    if(mutation?.content){
      console.log(mutation.content)
      setThisTerm(mutation.content)
    }
  }, [mutation])

  useEffect(() => {
    if(thisTerm){
      setEsteTerminalForm(thisTerm)
    }
  }, [thisTerm])

  return (
    <div>
      {/* {(isPendingEmailConfig || isPendingMutation) && <LdsBar />} */}
      <Form className='mx-4' onSubmit={handleSubmit} data-form="formCpeFact">
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="3">Nombre</Form.Label>
          <Col sm="9">
            <Form.Control 
              name="nombre"
              value={esteTerminalForm.nombre}
              readOnly
              disabled
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="3">Descripción</Form.Label>
          <Col sm="9">
            <Form.Control 
              name="descripcion"
              value={esteTerminalForm.descripcion}
              onChange={handleChange}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="3">Establecimiento</Form.Label>
          <Col sm="9">
            <Form.Select
              name="establecimiento_id"
              value={esteTerminalForm.establecimiento_id}
              onChange={handleChange}
            >
              <option value=""></option>
              {establecimientos && establecimientos.filter(el=>el.tipo == "sucursal").map((el: Sucursal) => {
                return <option key={el.id} value={el.id}>{el.descripcion}</option>
              })}
            </Form.Select>
          </Col>
        </Form.Group>   
        <Form.Group as={Row} className="mb-3 px-5">
          <Button type='submit'>Guardar</Button>
        </Form.Group>
      </Form>
    </div>
  )
}
