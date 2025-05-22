import { useEffect } from "react"
import { useMutationConfigQuery } from "../../../core/hooks/useConfigQuery"
import { Table } from "react-bootstrap"

export default function Locales() {
  const {
    data: establecimientos, 
    getEstablecimientos
  } = useMutationConfigQuery()

  useEffect(() => {
    getEstablecimientos()
  }, [])

  return (
    <Table>
      <thead>
        <tr>
          <th>tipo</th>
          <th>nombre</th>
          <th>direccion</th>
          <th>distrito</th>
          <th>acciones</th>
        </tr>
      </thead>
      <tbody>
        {establecimientos && establecimientos.map((el: any)=>(
          <tr key={el.id}>
            <td>{el.tipo}</td>
            <td>{el.nombre}</td>
            <td>
              {el.direccion_sucursal == el.direccion_almacen
                ? <div>{`${el.direccion_sucursal} (Suc-Alm)`}</div>
                : <div>
                    <div>{el.direccion_sucursal ? `${el.direccion_sucursal} (Suc)` : ""}</div>
                    <div>{el.direccion_almacen ? `${el.direccion_almacen} (Alm)` : ""}</div>
                  </div>
              }
            </td>
            <td>{el.ubigeo_inei}</td>
            <td></td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}
