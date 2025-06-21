import { useEffect } from "react"
import { useSeries } from "./context/SeriesContext"
import { useMutationSeriesQuery } from "../../core/hooks/useSeriesQuery"
import { Button, Card, Table } from "react-bootstrap"
import { SerieSucursal } from "../../core/types/catalogosTypes"
import { FaEdit, FaTrash } from "react-icons/fa"
import { toast } from "react-toastify"
import Swal from "sweetalert2"
import useLayoutStore from "../../core/store/useLayoutStore"

export default function SeriesSucursalTbl() {
  const darkMode = useLayoutStore(state => state.layout.darkMode)
  const {
    currentSucursalId,
    seriesSucursal,
    setSeriesSucursal,
    setCurrentSerieSucursalId,
    setShowForm,
    eliminarSerieSucursal
  } = useSeries()

  const {
    data: dataSeriesSucursal,
    getSeriesSucursal
  } = useMutationSeriesQuery()

  const {
    data: mutation,
    deleteSerieSucursal
  } = useMutationSeriesQuery()

  const handleNuevo = () => {
    if(currentSucursalId){
      setShowForm(true)
    }else{
        toast.warning("Elija una sucursal")
    }
  }

  const toEdit = (id: number) => {
    setCurrentSerieSucursalId(id)
    setShowForm(true)
  }

  const eliminar = (serieSucursal: SerieSucursal) => {
    Swal.fire({
      icon: 'question',
      text: `¿Desea eliminar la serie ${serieSucursal.descripcion}?`,
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: 'Cancelar',
      customClass: {popup: darkMode ? 'swal-dark' : ''}
    }).then((result) => {
      if (result.isConfirmed) {
        deleteSerieSucursal(serieSucursal.id)
      }
    });
  }

  useEffect(()=>{
    if(!currentSucursalId) return
    getSeriesSucursal(currentSucursalId)
  },[currentSucursalId])

  useEffect(() => {
    if(!dataSeriesSucursal) return
    if(dataSeriesSucursal?.content){
      setSeriesSucursal(dataSeriesSucursal.content as SerieSucursal[])
    }else{
      setSeriesSucursal(null)
    }
  }, [dataSeriesSucursal])

  useEffect(() => {
    if(!mutation) return
    if(mutation?.content){
      eliminarSerieSucursal(mutation.content.id)
    }
    toast(mutation.msg, {type: mutation.msgType})
  }, [mutation])

  return (
    <div>
      <div className="d-flex justify-content-between my-2">
        <h5 className="ps-2">Series y correlativos</h5>
        <Button
          size="sm"
          onClick={handleNuevo}
        >Agregar serie</Button>
      </div>
      <Card>
        <Card.Body>
          <div className="position-relative">
            <div className="table-responsive" style={{ height: "73vh" }}>
              <Table striped hover className="mb-1">
                <thead className="sticky-top">
                  <tr className="text-nowrap">
                    <th>Descripcion</th>
                    <th>Serie</th>
                    <th>Correlativo</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {seriesSucursal && seriesSucursal.map((el) => (
                    <tr key={el.id}>
                      <td>{el.descripcion}</td>
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
