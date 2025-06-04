import { useEffect, useState } from "react"
import { useMutationConfigQuery } from "../../../core/hooks/useConfigQuery"
import { Table } from "react-bootstrap"
import { FaEdit, FaTrash } from "react-icons/fa"
import EstablecimientoForm from "./EstablecimientoForm"
import { Establecimiento } from "../../../core/types/catalogosTypes"

export default function Locales() {
  const [showEstablecimientoForm, setShowEstablecimientoForm] = useState(false)
  const [currentEstablecimientoId, setCurrentEstablecimientoId] = useState(0)
  const {
    data: establecimientos, 
    getEstablecimientos
  }:{data: Establecimiento[], getEstablecimientos: ()=>void} = useMutationConfigQuery()

  const toEdit = (id: number) => {
    setCurrentEstablecimientoId(id)
    setShowEstablecimientoForm(true)
  }

  const handleDelete = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
  }

  useEffect(() => {
    getEstablecimientos()
  }, [])

  return (
    <div>
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
                  <a onClick={handleDelete} href="#" className="p-1" title="Eliminar">
                    <FaTrash className="text-danger mb-1"/>
                  </a>
                </td>
                <td>{el.nombre}</td>
                <td>{el.direccion}</td>
                <td>{el.distrito}</td>
                <td>
                  <div
                    role="button"
                    className="text-primary text-center"
                    onClick={()=>console.log(el)}
                    >
                    {el.sucursal ? 'Si' : 'No'}
                  </div>
                </td>
                <td>
                  <div
                    role="button"
                    className="text-primary text-center"
                    onClick={()=>console.log(el)}
                  >
                    {el.almacen ? 'Si' : 'No'}
                  </div>
                </td>
                <td>{el.estado}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <button onClick={()=>setShowEstablecimientoForm(prev=>!prev)}>precionar</button>
      <EstablecimientoForm
        showForm={showEstablecimientoForm}
        setShowForm={setShowEstablecimientoForm}
        currentId={currentEstablecimientoId}
        setCurrentId={setCurrentEstablecimientoId}
      />
    </div>
  )
}
