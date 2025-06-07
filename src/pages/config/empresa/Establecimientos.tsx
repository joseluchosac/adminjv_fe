import { useEffect, useState } from "react"
import { useMutationConfigQuery } from "../../../core/hooks/useConfigQuery"
import { Button, Table } from "react-bootstrap"
import { FaEdit, FaTrash } from "react-icons/fa"
import EstablecimientoForm from "./EstablecimientoForm"
import { Establecimiento } from "../../../core/types/catalogosTypes"
import { toast } from "react-toastify"
import Swal from "sweetalert2"
import useLayoutStore from "../../../core/store/useLayoutStore"

export default function Locales() {
  const [showEstablecimientoForm, setShowEstablecimientoForm] = useState(false)
  const [currentEstablecimientoId, setCurrentEstablecimientoId] = useState(0)
  const darkMode = useLayoutStore(state => state.layout.darkMode)
  
  const {
    data: establecimientos, 
    getEstablecimientos
  }:{data: Establecimiento[], getEstablecimientos: ()=>void} = useMutationConfigQuery()

  const {
    data: mutation,
    deleteEstablecimiento,
    updateEstablecimiento,
    updateEstadoEstablecimiento
  } = useMutationConfigQuery()

  const toEdit = (id: number) => {
    setCurrentEstablecimientoId(id)
    setShowEstablecimientoForm(true)
  }

  const eliminar = (establecimiento: Establecimiento) => {
    Swal.fire({
      icon: 'question',
      text: `¿Está seguro de eliminar ${establecimiento.nombre}?`,
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: 'Cancelar',
      customClass: {popup: darkMode ? 'swal-dark' : ''}
    }).then((result) => {
      if (result.isConfirmed) {
        deleteEstablecimiento(establecimiento.id)
      }
    });
  }

  const cambiarTipo = ({tipo, establecimiento}:{tipo: string; establecimiento: Establecimiento}) =>{
    const newEstablecimiento = {...establecimiento, [tipo]: !establecimiento[tipo as keyof Establecimiento]}
    updateEstablecimiento(newEstablecimiento)
  }

  useEffect(() => {
    getEstablecimientos()
  }, [])

  useEffect(()=>{
    if(!mutation) return
    toast(mutation.msg, {type: mutation.msgType})
    getEstablecimientos()
  },[mutation])

  return (
    <div>
      <Button 
        className="mb-2"
        onClick={()=>setShowEstablecimientoForm(prev=>!prev)}
      >Nuevo establecimiento</Button>
      <div className="table-responsive">
        <Table>
          <thead>
            <tr>
              <th>Acciones</th>
              <th>Nombre</th>
              <th>Dirección</th>
              <th>Distrito</th>
              <th>Sucursal</th>
              <th>Almacen</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {establecimientos && establecimientos.map((el)=>(
              <tr key={el.id}>
                <td>
                  <a 
                    href="#" 
                    className="p-1" 
                    title="Editar"
                    onClick={(e)=>{
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
                    onClick={(e)=>{
                      e.preventDefault()
                      eliminar(el)
                    }}
                  >
                    <FaTrash className="text-danger mb-1"/>
                  </a>
                </td>
                <td>{el.nombre}</td>
                <td>{el.direccion}</td>
                <td>{el.dis_prov_dep}</td>
                <td>
                  <div
                    role="button"
                    className="text-primary text-center"
                    onClick={()=>
                      cambiarTipo({tipo:"sucursal", establecimiento: el})
                    }
                  >
                    {el.sucursal ? 'Si' : 'No'}
                  </div>
                </td>
                <td>
                  <div
                    role="button"
                    className="text-primary text-center"
                    onClick={()=>
                      cambiarTipo({tipo:"almacen", establecimiento: el})
                    }
                  >
                    {el.almacen ? 'Si' : 'No'}
                  </div>
                </td>
                <td
                  role="button"
                  className="text-primary text-center"
                  onClick={()=>{
                    updateEstadoEstablecimiento({
                      id: el.id,
                      estado: el.estado ? 0 : 1
                    })
                  }}
                >
                  {el.estado ? "Activo" : "Inactivo" }
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <EstablecimientoForm
        showForm={showEstablecimientoForm}
        setShowForm={setShowEstablecimientoForm}
        currentId={currentEstablecimientoId}
        setCurrentId={setCurrentEstablecimientoId}
        getEstablecimientos={getEstablecimientos}
      />
    </div>
  )
}
