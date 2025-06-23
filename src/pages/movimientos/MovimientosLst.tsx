import { useEffect, useRef } from "react";
import { Card, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import { Movimiento } from "../../core/types";
import useMovimientosStore from "../../core/store/useMovimientosStore";
import DynaIcon from "../../core/components/DynaComponents";
import { useFilterMovimientosQuery } from "../../core/hooks/useMovimientosQuery";
import { LdsEllipsisCenter } from "../../core/components/Loaders";
import MovimientosLstRow from "./MovimientosLstRow";
import { useMovimientos } from "./hooks/useMovimientos";


const MovimientosLst: React.FC = () => {
  const camposMovimiento = useMovimientosStore(state => state.camposMovimiento)
  const setCamposMovimiento = useMovimientosStore(state => state.setCamposMovimiento)
  const filterParamsMovimientos = useMovimientosStore(state => state.filterParamsMovimientos)
  const setFilterParamsMovimientos = useMovimientosStore(state => state.setFilterParamsMovimientos)
  const {movimientos, setMovimientos, setFilterMovimientosCurrent, modo} = useMovimientos()
  
  const {
    data,
    fetchNextPage,
    isLoading,
    isFetching,
    isError,
    hasNextPage,
  } = useFilterMovimientosQuery();
  
  const tableRef = useRef<HTMLDivElement | null>(null)
  const ldsEllipsisRef = useRef<HTMLDivElement | null>(null)

  const handleSort = (e: React.MouseEvent<HTMLTableCellElement, MouseEvent>) => {
    if (e.currentTarget.dataset.orderable !== "true") return
    let field_name = e.currentTarget.dataset.campo as string;
    let field_label = e.currentTarget.textContent as string;
    const orderIdx = filterParamsMovimientos.orders.findIndex(el => el.field_name === field_name)
    if(e.ctrlKey){
      if(orderIdx === -1){
        const newOrder = {field_name, order_dir: "ASC", field_label}
        setFilterParamsMovimientos({...filterParamsMovimientos, orders: [...filterParamsMovimientos.orders, newOrder]})
      }else{
        let newOrders = structuredClone(filterParamsMovimientos.orders)
        if(newOrders[orderIdx].order_dir == "ASC"){
          newOrders[orderIdx] = {field_name, order_dir: "DESC", field_label}
          setFilterParamsMovimientos({...filterParamsMovimientos, orders: newOrders})
        }else{
          newOrders = newOrders.filter(el=>el.field_name !== field_name)
          setFilterParamsMovimientos({...filterParamsMovimientos, orders: newOrders})
        }
      }
    }else{
      if(orderIdx === -1){
        const newOrder = {field_name, order_dir: "ASC", field_label}
        setFilterParamsMovimientos({...filterParamsMovimientos, orders: [newOrder]})
      }else{
        let newOrders = structuredClone(filterParamsMovimientos.orders)
        if(newOrders[orderIdx].order_dir == "ASC"){
          const newOrder = {field_name, order_dir: "DESC", field_label}
          setFilterParamsMovimientos({...filterParamsMovimientos, orders: [newOrder]})
        }else{
          setFilterParamsMovimientos({...filterParamsMovimientos, orders: []})
        }
      }
    }
  };

  const handleNextPage = () => {
    fetchNextPage();
  };


  useEffect(()=>{
    if(data?.pages[0].error || !data?.pages[0].content) return
    const newMovimientos = data?.pages.flatMap(el => el.content) as Movimiento[];
    setMovimientos([...newMovimientos])
  },[data])

  useEffect(()=>{
    if(data?.pages[0].error || isError) return
    if(!isFetching) {
      const {equals, between, orders} = filterParamsMovimientos
      setFilterMovimientosCurrent({equals, between, orders})
      const newCamposMarcas = camposMovimiento.map(el=>{
        const order = orders.find(order => order.field_name === el.field_name)
        return order ? {...el, order_dir: order?.order_dir} : {...el, order_dir: ""}
      })
      setCamposMovimiento(newCamposMarcas)
    }
  },[data, isFetching])

  useEffect(() => {
    if(data?.pages[0].error || isError){
      toast.error("Error al obtener registros")
    }
  }, [data, isError])

  return (
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
              {movimientos && movimientos.map((movimiento: Movimiento) => (
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
            {(movimientos?.length === 0) && <div>No hay registros para mostrar</div>}
          </div>
        </div>
        {isLoading && <LdsEllipsisCenter innerRef={ldsEllipsisRef}/>}
        {isError && <div className="text-danger">Error de conexion</div>}
      </div>
    </Card>
  )
}

export default MovimientosLst
