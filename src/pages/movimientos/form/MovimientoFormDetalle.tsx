import { useMovimientos } from "../hooks/useMovimientos"
import { Card, Form, Table } from "react-bootstrap"
import { FormControlElement, type MovimientoFormDetalle } from "../../../app/types"
import { FaTrash } from "react-icons/fa"
import { toast } from "react-toastify"

export default function MovimientoFormDetalle() {
  const { 
    movimientoForm:{
      getValues,
      watch,
      setValue,
    }
  } = useMovimientos()

  const cambiarItem = ((e: React.ChangeEvent<FormControlElement>, item: MovimientoFormDetalle) => {
    let {name, value} = e.target
    if(name === 'cantidad' && parseFloat(value)  > item.stock && getValues().tipo === "salida"){
      toast.warning("stock insuficiente")
      value = item.stock.toString()
    }
    const itemModif = {...item, [name]: value}
    const nuevosItems = getValues().detalle.map(el => {
      return el.tmp_id === itemModif.tmp_id ? itemModif : el
    })
    setValue("detalle", nuevosItems)
  })

  const eliminarItem = (tmp_id: number) => {
    const nuevosItems = getValues().detalle.filter(el=>el.tmp_id != tmp_id)
    setValue("detalle", nuevosItems)
  }

  return (
    <Card>
      <div className="position-relative">
        <div className="table-responsive" style={{ height: "73vh" }}>
          <Table>
            <thead className="sticky-top">
              <tr>
                <th>item</th>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Costo un.</th>
                <th>Observacion</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {watch().detalle?.map((el, idx)=>
                <tr key={el.tmp_id}>
                  <td>{idx+1}</td>
                  <td style={{maxWidth:"450px"}}>
                    <div>
                      {el.producto_descripcion}
                    </div>
                      <small>
                    <div className="text-muted d-flex gap-3">
                        {el.marca && <div>{el.marca}</div>}
                        {el.laboratorio && <div>{el.laboratorio}</div>}
                        <div>Cod: {el.codigo}</div>
                        <div>Stock: {el.stock}</div>
                    </div>
                      </small>
                  </td>
                  <td>
                    <Form.Control
                      name="cantidad"
                      type="number"
                      size="sm"
                      style={{maxWidth:"100px"}}
                      onChange={(e) => cambiarItem(e, el)}
                      value={el.cantidad}
                    />
                  </td>
                    <td>
                    <Form.Control
                      name="precio_costo"
                      type="number"
                      size="sm"
                      style={{maxWidth:"100px"}}
                      onChange={(e) => cambiarItem(e, el)}
                      value={el.precio_costo}
                    />
                  </td>
                  <td>
                    <Form.Control
                      name="observacion"
                      size="sm"
                      onChange={(e) => cambiarItem(e, el)}
                      value={el.observacion}
                    />
                  </td>
                  <td>
                    <a onClick={() => eliminarItem(el.tmp_id)} href="#" title="Eliminar">
                      <FaTrash className="text-danger"/>
                    </a>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>
    </Card>
  )
}
