import { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { FormControlElement } from "../../core/types";
import { Establecimiento } from "../../core/types/catalogosTypes";
import useSessionStore from "../../core/store/useSessionStore";
import { useMutationConfigQuery } from "../../core/hooks/useConfigQuery";
import useCatalogosStore from "../../core/store/useCatalogosStore";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import useLayoutStore from "../../core/store/useLayoutStore";

const esteTerminalFormInit = {
  establecimiento_id: 0,
  nombre: "",
  descripcion: ""
}

export default function Terminales() {
  const [esteTerminalForm, setEsteTerminalForm] = useState(esteTerminalFormInit)
  const thisTerm = useSessionStore(state => state.thisTerm)
  const setThisTerm = useSessionStore(state => state.setThisTerm)
  const darkMode = useLayoutStore(state=>state.layout.darkMode)
  const establecimientos = useCatalogosStore(state => state.catalogos?.establecimientos)

  const {
    data: mutation,
    linkThisTerminal,
    unlinkThisTerminal
  } = useMutationConfigQuery()

  const handleChange = (e: React.ChangeEvent<FormControlElement>) => {
    let {name, value}:{name: string, value: string | number} = e.target
    value = name === "establecimiento_id" ? parseInt(value) : value
    setEsteTerminalForm({...esteTerminalForm, [name]:value})
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // console.log(esteTerminalForm)
    // return
    if(!esteTerminalForm.descripcion){
      toast.warning('Ingrese la descripcion')
      return false
    }
     if(!esteTerminalForm.establecimiento_id){
      toast.warning('Elija el establecimiento')
      return false
    }
    Swal.fire({
      icon: 'question',
      text: esteTerminalForm.nombre ? '¿Desea guardar los cambios?':'¿Desea registrar este terminal?',
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: 'Cancelar',
      customClass: { 
        popup: darkMode ? 'swal-dark' : ''
      }
    }).then((result) => {
      if (result.isConfirmed) {
        linkThisTerminal(esteTerminalForm)
      }
    });
  }

  useEffect(() => {
    if(!mutation) return
    toast(mutation.msg, {type: mutation.msgType})
    setThisTerm(mutation.content)
    console.log(mutation)
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
              {establecimientos && establecimientos.map((el: Establecimiento) => {
                return <option key={el.id} value={el.id}>{el.descripcion}</option>
              })}
            </Form.Select>
          </Col>
        </Form.Group>   
        <Form.Group as={Row} className="mb-3">
          <div className="d-flex justify-content-end gap-3">
            {thisTerm && 
              <Button
                type='button'
                variant="danger"
                onClick={()=>{
                  unlinkThisTerminal(thisTerm.nombre)
                }}
              >
                Desvincular
              </Button>
            }
            <Button type='submit'>Guardar vínculo</Button>
          </div>
        </Form.Group>
      </Form>
    </div>
  )
}
