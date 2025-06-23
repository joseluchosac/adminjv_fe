import { useEffect, useRef } from "react";
import { Button, Card, Table } from "react-bootstrap";
import { useEstablecimientos } from "./context/EstablecimientosContext";
import { useMutationEstablecimientosQuery } from "../../../core/hooks/useEstablecimientosQuery";
import useCatalogosStore from "../../../core/store/useCatalogosStore";
import { FaEdit, FaToggleOff, FaToggleOn, FaTrash } from "react-icons/fa";
import { Establecimiento } from "../../../core/types/catalogosTypes";
import { LdsBar } from "../../../core/components/Loaders";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import useLayoutStore from "../../../core/store/useLayoutStore";

const EstablecimientosTbl: React.FC = () => {
  const establecimientos = useCatalogosStore(state => state.catalogos?.establecimientos)
  const setEstablecimientos = useCatalogosStore(state => state.setEstablecimientos)
  const setEstablecimiento = useCatalogosStore(state => state.setEstablecimiento)
  const delEstablecimiento = useCatalogosStore(state => state.delEstablecimiento)
  const { setShowEstablecimientoForm, setCurrentEstablecimientoId} = useEstablecimientos()
  const darkMode = useLayoutStore(state => state.layout.darkMode)
  
  const tableRef = useRef<HTMLDivElement | null>(null)


  const {
    data,
    isPending,
    getEstablecimientos
  } = useMutationEstablecimientosQuery()

  const {
    data: mutation,
    isPending: isPendingMutation,
    updateEstablecimiento,
    deleteEstablecimiento,
    typeAction
  } = useMutationEstablecimientosQuery()

  const toEdit = (id: number) => {
    setCurrentEstablecimientoId(id)
    setShowEstablecimientoForm(true)
  }

  const handleNuevo = () => {
    setCurrentEstablecimientoId(0)
    setShowEstablecimientoForm(true);
  };

  const toggleEstado = (establecimiento: Establecimiento) => {
    updateEstablecimiento({...establecimiento, estado: establecimiento.estado ? 0 : 1})
  }

  const eliminar = (establecimiento: Establecimiento) => {
    Swal.fire({
      icon: 'question',
      text: `¿Desea eliminar la establecimiento: ${establecimiento.descripcion}?`,
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: 'Cancelar',
      customClass: { 
        popup: darkMode ? 'swal-dark' : ''
      }
    }).then((result) => {
      if (result.isConfirmed) {
        deleteEstablecimiento(establecimiento.id)
      }
    });
  }

  useEffect(() => {
    getEstablecimientos()
  }, [])

  useEffect(() => {
    if(!data) return
    if(data.content){
      setEstablecimientos([...data.content as Establecimiento[]])
    }
  }, [data])

  useEffect(() => {
    if(!mutation) return
    toast(mutation.msg, {type: mutation.msgType})
    if(mutation.content){
      if(typeAction === "mutate_establecimiento"){
        setEstablecimiento(mutation.content as Establecimiento)
      }else if(typeAction === "delete_establecimiento"){
        delEstablecimiento(mutation.content)
      }
    }
  }, [mutation])

  return (
    <Card className="overflow-hidden mx-auto">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <div><h4>Lista de establecimientos</h4></div>
        <Button onClick={handleNuevo}>Nuevo</Button>
      </Card.Header>
      <Card.Body className="p-0">
        {(isPending || isPendingMutation) && <LdsBar />}
      <div className="position-relative">
        <div className="table-responsive" style={{ height: "73vh" }} ref={tableRef}>
          {establecimientos && 
            <Table striped hover className="mb-1">
              <thead className="sticky-top">
                <tr className="text-nowrap">
                  <th>Acciones</th>
                  <th>Código</th>
                  <th>Tipo</th>
                  <th>Descripción</th>
                  <th>Dirección</th>
                </tr>
              </thead>
              <tbody>
                {establecimientos.map((el) => (
                  <tr key={el.id}>
                    <td>
                      <div className="d-flex gap-2 justify-content-start align-items-center">
                        <a onClick={(e)=>{
                            e.preventDefault()
                            toEdit(el.id)
                          }}
                          href="#"
                          className="p-1"
                          title="Editar"
                        >
                          <FaEdit />
                        </a>
                        <a 
                          onClick={(e) => {
                            e.preventDefault()
                            eliminar(el)
                          }}
                          href="#"
                          className="p-1" 
                          title="Eliminar">
                          <FaTrash className="text-danger"/>
                        </a>
                          {el.estado == 0
                            ? <div role="button" onClick={()=>toggleEstado(el)} title="Habilitar" data-estado="0">
                                <FaToggleOff className="text-muted" size={"1.3rem"} />
                              </div>
                            : <div role="button" onClick={()=>toggleEstado(el)} title="Deshabilitar" data-estado="1">
                                <FaToggleOn className="text-primary" size={"1.3rem"} />
                              </div>
                          }
                      </div>
                    </td>
                    <td>{el.codigo}</td>
                    <td>{el.tipo}</td>
                    <td>{el.descripcion}</td>
                    <td>
                      <div>{el.direccion}</div>
                      <div>{el.dis_prov_dep}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          }
        </div>
      </div>
      </Card.Body>
    </Card>
  )
}

export default EstablecimientosTbl
