import { useEffect, useRef, useState } from "react";
import { Card, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import { Movimiento } from "../../../core/types";
import DynaIcon from "../../../core/components/DynaComponents";
import { useFilterMovimientosQuery } from "../../../core/hooks/useMovimientosQuery";
import { LdsEllipsisCenter } from "../../../core/components/Loaders";
import MovimientosLstRow from "./MovimientosLstRow";
import { useMovimientos } from "../hooks/useMovimientos";
import MovimientosLstHead from "./MovimientosLstHead";
import MovimientosLstFilterMdl from "./MovimientosLstFilterMdl";
import { camposMovimientoInit } from "../../../core/utils/constants";


const MovimientosLst: React.FC = () => {
  const [ camposMovimiento, setCamposMovimiento] = useState(camposMovimientoInit) 
  const {
    setFilterInfoMovimientos,
    filterParamsMovimientosForm,
    setFilterParamsMovimientosForm,
    modo
  } = useMovimientos()
  
  const {
    data,
    fetchNextPage,
    isLoading,
    isFetching,
    isError,
    hasNextPage,
    setFilterParamsMovimientos
  } = useFilterMovimientosQuery();
  
  const tableRef = useRef<HTMLDivElement | null>(null)
  const ldsEllipsisRef = useRef<HTMLDivElement | null>(null)

  const handleSort = (e: React.MouseEvent<HTMLTableCellElement, MouseEvent>) => {
    if (e.currentTarget.dataset.orderable !== "true") return
    let field_name = e.currentTarget.dataset.campo as string;
    let field_label = e.currentTarget.textContent as string;
    const orderIdx = filterParamsMovimientosForm.orders.findIndex(el => el.field_name === field_name)
    if(e.ctrlKey){
      if(orderIdx === -1){
        const newOrder = {field_name, order_dir: "ASC", field_label}
        setFilterParamsMovimientosForm({...filterParamsMovimientosForm, orders: [...filterParamsMovimientosForm.orders, newOrder]})
      }else{
        let newOrders = structuredClone(filterParamsMovimientosForm.orders)
        if(newOrders[orderIdx].order_dir == "ASC"){
          newOrders[orderIdx] = {field_name, order_dir: "DESC", field_label}
          setFilterParamsMovimientosForm({...filterParamsMovimientosForm, orders: newOrders})
        }else{
          newOrders = newOrders.filter(el=>el.field_name !== field_name)
          setFilterParamsMovimientosForm({...filterParamsMovimientosForm, orders: newOrders})
        }
      }
    }else{
      if(orderIdx === -1){
        const newOrder = {field_name, order_dir: "ASC", field_label}
        setFilterParamsMovimientosForm({...filterParamsMovimientosForm, orders: [newOrder]})
      }else{
        let newOrders = structuredClone(filterParamsMovimientosForm.orders)
        if(newOrders[orderIdx].order_dir == "ASC"){
          const newOrder = {field_name, order_dir: "DESC", field_label}
          setFilterParamsMovimientosForm({...filterParamsMovimientosForm, orders: [newOrder]})
        }else{
          setFilterParamsMovimientosForm({...filterParamsMovimientosForm, orders: []})
        }
      }
    }
  };

  const handleNextPage = () => {
    fetchNextPage();
  };

  useEffect(() => {
    setFilterParamsMovimientos(filterParamsMovimientosForm)
  }, [filterParamsMovimientosForm])

  useEffect(()=>{
    if(data?.pages[0].error || isError){
      toast.error("Error al obtener registros")
      return
    }
    if(!isFetching){
      const {search, equals, between, orders} = filterParamsMovimientosForm
      setFilterInfoMovimientos({search, equals, between, orders})
      const newCamposMovimientos = camposMovimiento.map(el=>{
        const order = orders.find(order => order.field_name === el.field_name)
        return order ? {...el, order_dir: order?.order_dir} : {...el, order_dir: ""}
      })
      setCamposMovimiento(newCamposMovimientos)
    }
  },[data, isError, isFetching])


  return (
    <>
      <MovimientosLstHead isFetching={isFetching} />
      <Card className={`overflow-hidden ${modo.vista === "edit" ? "d-none" : ""}`}>
        <div className="position-relative">
          <div className="table-responsive" style={{ height: "73vh" }} ref={tableRef}>
            <Table striped hover className="mb-1">
              <thead className="sticky-top">
                <tr className="text-nowrap">
                  {camposMovimiento && camposMovimiento.filter(el=>el.show).map((el) => {
                    return (
                      <th
                        key={el.field_name}
                        data-orderable={el.orderable}
                        data-campo={el.field_name}
                        role={el.orderable ? "button" : "columnheader"}
                        onClick={handleSort}
                      >
                        <div className="d-flex gap-1">
                          <div>{el.field_label}</div>
                          <div>
                            {el.order_dir == "ASC" 
                              ? (<DynaIcon className="text-warning" name="FaArrowDownAZ" />) 
                              : el.order_dir == "DESC"
                                ? (<DynaIcon className="text-warning" name="FaArrowDownZA" />)
                                : ("")
                            }
                          </div>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {data && data?.pages.flatMap(el => el.filas).map((movimiento: Movimiento) => (
                  <MovimientosLstRow key={movimiento.id} movimiento={movimiento} camposMovimiento={camposMovimiento}/>
                ))}
              </tbody>
            </Table>
            <div className="position-relative">
              {hasNextPage &&
                <div className="m-3">
                  <button onClick={handleNextPage} className="btn btn-success">Cargar mas registros</button>
                </div>
              }
              {(data?.pages[0].num_regs === 0) && <div>No hay registros para mostrar</div>}
            </div>
          </div>
          {isLoading && <LdsEllipsisCenter innerRef={ldsEllipsisRef}/>}
          {isError && <div className="text-danger">Error de conexion</div>}
        </div>
      </Card>
      <MovimientosLstFilterMdl isFetching={isFetching} camposMovimiento={camposMovimiento}  />
    </>
  )
}

export default MovimientosLst
