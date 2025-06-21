import { useEffect, useRef } from "react";
import { Card, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import { useSucursales } from "./context/SucursalesContext";
import useSucursalesStore from "../../../core/store/useSucursalesStore";
import { useFilterSucursalesQuery } from "../../../core/hooks/useSucursalesQuery";
import { Sucursal } from "../../../core/types/catalogosTypes";
import DynaIcon from "../../../core/components/DynaComponents";
import SucursalesTblRow from "./SucursalesTblRow";
import { LdsEllipsisCenter } from "../../../core/components/Loaders";

const SucursalesTbl: React.FC = () => {
  const {sucursales, setSucursales, setFilterSucursalesCurrent} = useSucursales()
  const camposSucursal = useSucursalesStore(state => state.camposSucursal)
  const setCamposSucursal = useSucursalesStore(state => state.setCamposSucursal)
  const filterParamsSucursales = useSucursalesStore(state => state.filterParamsSucursales)
  const setFilterParamsSucursales = useSucursalesStore(state => state.setFilterParamsSucursales)
  const tableRef = useRef<HTMLDivElement | null>(null)
  const ldsEllipsisRef = useRef<HTMLDivElement | null>(null)

  const {
    data,
    fetchNextPage,
    isLoading,
    isFetching,
    isError,
    hasNextPage,
  } = useFilterSucursalesQuery();

  const handleSort = (e: React.MouseEvent<HTMLTableCellElement, MouseEvent>) => {
    let field_name = e.currentTarget.dataset.campo as string;
    let field_label = e.currentTarget.textContent as string;
    const orderIdx = filterParamsSucursales.orders.findIndex(el => el.field_name === field_name)
    if(e.ctrlKey){
      if(orderIdx === -1){
        const newOrder = {field_name, order_dir: "ASC", field_label}
        setFilterParamsSucursales({...filterParamsSucursales, orders: [...filterParamsSucursales.orders, newOrder]})
      }else{
        let newOrders = structuredClone(filterParamsSucursales.orders)
        if(newOrders[orderIdx].order_dir == "ASC"){
          newOrders[orderIdx] = {field_name, order_dir: "DESC", field_label}
          setFilterParamsSucursales({...filterParamsSucursales, orders: newOrders})
        }else{
          newOrders = newOrders.filter(el=>el.field_name !== field_name)
          setFilterParamsSucursales({...filterParamsSucursales, orders: newOrders})
        }
      }
    }else{
      if(orderIdx === -1){
        const newOrder = {field_name, order_dir: "ASC", field_label}
        setFilterParamsSucursales({...filterParamsSucursales, orders: [newOrder]})
      }else{
        let newOrders = structuredClone(filterParamsSucursales.orders)
        if(newOrders[orderIdx].order_dir == "ASC"){
          const newOrder = {field_name, order_dir: "DESC", field_label}
          setFilterParamsSucursales({...filterParamsSucursales, orders: [newOrder]})
        }else{
          setFilterParamsSucursales({...filterParamsSucursales, orders: []})
        }
      }

    }
  };
 
  useEffect(()=>{
    if(data?.pages[0].error || !data?.pages[0].filas) return
    const newFilas = data?.pages.flatMap(el => el.filas) as Sucursal[];
    setSucursales([...newFilas])
  },[data])

  useEffect(()=>{
    if(data?.pages[0].error || isError) return
    if(!isFetching) {
      const {equals, between, orders} = filterParamsSucursales
      setFilterSucursalesCurrent({equals, between, orders})
      const newCamposSucursales = camposSucursal.map(el=>{
        const order = orders.find(order => order.field_name === el.field_name)
        return order ? {...el, order_dir: order?.order_dir} : {...el, order_dir: ""}
      })
    setCamposSucursal(newCamposSucursales)
    }
  },[data, isFetching])

  useEffect(() => {
    if(data?.pages[0].error || isError){
      toast.error("Error al obtener registros")
    }
  }, [data, isError])

  return (
    <Card className="overflow-hidden mx-auto">
      <div className="position-relative">
        <div className="table-responsive" style={{ height: "73vh" }} ref={tableRef}>
          {sucursales && 
            <Table striped hover className="mb-1">
              <thead className="sticky-top">
                <tr className="text-nowrap">
                  {camposSucursal && camposSucursal.map((el) => {
                    return ( el.show && (
                      <th
                        key={el.field_name}
                        onClick={handleSort}
                        data-campo={el.field_name}
                        role="button"
                        style={el.field_name=="acciones" ? {position: "sticky", left: 0} : {}}
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
                    ));
                  })}
                </tr>
              </thead>
              <tbody>
                {sucursales && sucursales.map((sucursal) => (
                  <SucursalesTblRow key={sucursal.id} sucursal={sucursal} camposSucursal={camposSucursal}/>
                ))}
              </tbody>
            </Table>
          }
          <div className="position-relative">
            {hasNextPage &&
              <div className="m-3">
                <button onClick={()=>fetchNextPage()} className="btn btn-success">Cargar mas registros</button>
              </div>
            }
            {(sucursales?.length === 0) && <div>No hay registros para mostrar</div>}
          </div>
        </div>
        {isLoading && <LdsEllipsisCenter innerRef={ldsEllipsisRef}/>}
        {isError && <div className="text-danger">Error de conexion</div>}
      </div>
    </Card>
  )
}

export default SucursalesTbl
