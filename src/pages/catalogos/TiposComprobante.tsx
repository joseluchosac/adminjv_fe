import { useEffect, useState } from "react"
import useCatalogosStore from "../../core/store/useCatalogosStore"
import { Button, Card, Col, Form, Row, Table } from "react-bootstrap"
import { FaEdit, FaRegTrashAlt, FaToggleOff, FaToggleOn } from "react-icons/fa"
import { toast } from "react-toastify"
import Swal from "sweetalert2"
import useLayoutStore from "../../core/store/useLayoutStore"
import { useMutationCatalogosQuery } from "../../core/hooks/useCatalogosQuery"
import { TipoComprobante } from "../../core/types/catalogosTypes"

const formInit = {
  id: 0,
  codigo: "",
  descripcion: "",
  estado: 1
}
export default function TiposComprobante() {
  const [form, setForm] = useState(formInit)
  const tipos_comprobante = useCatalogosStore(state => state.catalogos?.tipos_comprobante)
  const darkMode = useLayoutStore(state => state.layout.darkMode)
  const {
    data, 
    createTipoComprobante,
    updateTipoComprobante,
    deleteTipoComprobante,
  } = useMutationCatalogosQuery()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target
    setForm({...form, [name]:value})
  }

  const handleToEdit = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    const {id} = e.currentTarget.dataset
    const toEdit = tipos_comprobante?.find(el=>el.id === Number(id))
    if(toEdit) setForm(toEdit)
  }

  const handleToggleEstado = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    const id = e.currentTarget.dataset.id
    const new_tipo_comprobante = tipos_comprobante?.find(el => el.id === Number(id)) as TipoComprobante
    new_tipo_comprobante.estado = (new_tipo_comprobante?.estado === 1) ? 0 : 1
    updateTipoComprobante(new_tipo_comprobante)
  }

  const handleDelete = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    const id = e.currentTarget.dataset.id
    const tipo_comprobante = tipos_comprobante?.find(el => el.id === Number(id))
    Swal.fire({
      icon: 'question',
      text: `¿Desea eliminar permanentemente a ${tipo_comprobante?.descripcion}?`,
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: 'Cancelar',
      // target: document.getElementById('form_users'),
      customClass: { 
        popup: darkMode ? 'swal-dark' : ''
      }
    }).then((result) => {
      if (result.isConfirmed) {
        deleteTipoComprobante(Number(id))
      }
    });
  }

  const handleReset = () => {
    setForm(formInit)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if(!form.codigo) return toast("Código requerido", { type: "warning"})
    if(!form.descripcion) return toast("Descripción requerida", { type: "warning"})
    Swal.fire({
      icon: 'question',
      text: form.id
        ? `¿Desea guardar los cambios de ${form.descripcion}?`
        : `¿Desea registrar a ${form.descripcion}?`,
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: 'Cancelar',
      // target: document.getElementById('form_users'),
      customClass: { 
        popup: darkMode ? 'swal-dark' : ''
      }
    }).then((result) => {
      if (result.isConfirmed) {
        if (form.id){
          updateTipoComprobante(form)
        }else{
          createTipoComprobante(form)
        }
      }
    });
  }

  useEffect(() => {
    if(!tipos_comprobante) return
    // console.log(tipos_comprobante)
  }, [tipos_comprobante])

  useEffect(() => {
    if(!data) return
    toast(data.msg, { type: data.msgType})
    handleReset()
  }, [data])


  return (
    <Row>
      <Col md={4} className="mb-3">
        <Card>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col className="text-center"><h5>{form.id ? "Edición" : "Nuevo"}</h5></Col>
              </Row>
              <Row className="mb-2">
                <Form.Group as={Col} md={12} className="mb-2">
                  <Form.Label>Código</Form.Label>
                  <Form.Control
                    name="codigo"
                    value={form.codigo}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group as={Col} md={12} className="mb-2">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control
                    name="descripcion"
                    value={form.descripcion}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Row>
              <Row>
                <Col className="text-end">
                  <Button 
                    variant="secundary" 
                    type="button"
                    onClick={handleReset}
                  >
                    Reset
                  </Button>
                  <Button 
                    variant="primary" 
                    type="submit"
                  >
                    Guardar
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>
      </Col>
      <Col md={8}>
        <Card>
          <Card.Body>
            <div className="table-responsive">
              <Table>
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Descripción</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    tipos_comprobante?.map(el => {
                      return (
                        <tr key={el.id}>
                          <td>{el.codigo}</td>
                          <td>{el.descripcion}</td>
                          <td>
                            <a 
                              onClick={handleToggleEstado}
                              data-id={el.id}
                              className="p-1" 
                              href="#"
                              title={el.estado === 1 ? "Deshabilitar" : "Habilitar"}
                            >{el.estado === 1
                                ? <FaToggleOn className="text-primary" style={{pointerEvents: "none"}}/>
                                : <FaToggleOff className="text-secondary" style={{pointerEvents: "none"}}/>
                              }
                            </a>
                          </td>
                          <td>
                            <div>
                              <a 
                                onClick={handleToEdit}
                                data-id={el.id}
                                href="#" 
                                className="p-1" 
                                title="Editar"
                                >
                                <FaEdit style={{pointerEvents: "none"}}/>
                              </a>
                              <a 
                                onClick={handleDelete}
                                data-id={el.id}
                                href="#" 
                                className="p-1 text-danger" 
                                title="Eliminar"
                              >
                                <FaRegTrashAlt style={{pointerEvents: "none"}}/>
                              </a>
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  }
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}
