import { useEffect } from "react"
import { useNumeraciones } from "../../features/numeraciones/context/NumeracionesContext"
import { useMutationNumeracionesQuery } from "../../api/queries/useNumeracionesQuery"
import { Button, Card, Table } from "react-bootstrap"
import { FaEdit, FaTrash } from "react-icons/fa"
import { toast } from "react-toastify"
import Swal from "sweetalert2"
import useLayoutStore from "../../app/store/useLayoutStore"
import { Numeracion } from "../../app/types"

export default function NumeracionesTbl() {
  const darkMode = useLayoutStore(state => state.layout.darkMode)
  const {
    numeraciones,
    setNumeraciones,
    delNumeracion,
    currentEstablecimientoId,
    setCurrentNumeracionId,
    setShowForm,

  } = useNumeraciones()

  const {
    data: dataGetNumeraciones,
    getNumeraciones
  } = useMutationNumeracionesQuery()

  const {
    data: mutation,
    deleteNumeracion
  } = useMutationNumeracionesQuery()

  const handleNuevo = () => {
    if(currentEstablecimientoId){
      setShowForm(true)
    }else{
      toast.warning("Elija un establecimiento")
    }
  }

  const toEdit = (id: number) => {
    setCurrentNumeracionId(id)
    setShowForm(true)
  }

  const eliminar = (numeracionEstablecimiento: Numeracion) => {
    Swal.fire({
      icon: 'question',
      text: `¿Desea eliminar la numeración ${numeracionEstablecimiento.serie_pre}?`,
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: 'Cancelar',
      customClass: {popup: darkMode ? 'swal-dark' : ''}
    }).then((result) => {
      if (result.isConfirmed) {
        deleteNumeracion(numeracionEstablecimiento.id)
      }
    });
  }

  

  useEffect(() => {
    getNumeraciones()
  }, [])

  useEffect(() => {
    if(!dataGetNumeraciones) return
    if(dataGetNumeraciones.content){
      setNumeraciones(dataGetNumeraciones.content)
    }
  }, [dataGetNumeraciones])


  useEffect(() => {
    if(!mutation) return
    if(mutation?.content){
      delNumeracion(mutation.content)
    }
    toast(mutation.msg, {type: mutation.msgType})
  }, [mutation])

  return (
    <div>
      <div className="d-flex justify-content-between my-2">
        <h5 className="ps-2">Numeraciones</h5>
        <Button
          size="sm"
          onClick={handleNuevo}
        >Agregar numeración</Button>
      </div>
      <Card>
        <Card.Body className="p-0">
          <div className="position-relative">
            <div className="table-responsive" style={{ height: "73vh" }}>
              <Table striped hover className="mb-1">
                <thead className="sticky-top">
                  <tr className="text-nowrap">
                    <th>Descripción</th>
                    <th>Serie</th>
                    <th>Correlativo</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {numeraciones && numeraciones?.filter(el=>el.establecimiento_id === currentEstablecimientoId).map((el) => (
                    <tr key={el.id}>
                      <td>{el.descripcion_doc}</td>
                      <td>{el.serie}</td>
                      <td>{el.correlativo}</td>
                      <td>
                        <div className="d-flex gap-2 justify-content-start">
                          <a 
                            href="#"
                            className="p-1"
                            title="Editar"
                            onClick={(e) => {
                              e.preventDefault()
                              toEdit(el.id)
                            }}
                          >
                            <FaEdit />
                          </a>
                          <a 
                            href="#"
                            className="p-1"
                            title="Eliminar"
                            onClick={(e) => {
                              e.preventDefault()
                              eliminar(el)
                            }}
                          >
                              <FaTrash className="text-danger"/>
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}
