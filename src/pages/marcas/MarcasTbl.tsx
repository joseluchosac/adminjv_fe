import { useEffect, useRef } from "react";
import { Card, Table } from "react-bootstrap";
import { Bounce, toast } from "react-toastify";
import DynaIcon from "../../core/components/DynaComponents";
import useMarcasStore from "../../core/store/useMarcasStore";
import MarcasTblRow from "./MarcasTblRow";
import { useMarcas } from "./context/MarcasContext";
import { useFilterMarcasQuery } from "../../core/hooks/useMarcasQuery";
import { Marca } from "../../core/types";
import { LdsEllipsisCenter } from "../../core/components/Loaders";

const MarcasTbl: React.FC = () => {
  const {marcas, setMarcas, setFilterMarcasCurrent} = useMarcas()
  const camposMarca = useMarcasStore(state => state.camposMarca)
  const setCamposMarca = useMarcasStore(state => state.setCamposMarca)
  const filterParamsMarcas = useMarcasStore(state => state.filterParamsMarcas)
  const setFilterParamsMarcas = useMarcasStore(state => state.setFilterParamsMarcas)
  const tableRef = useRef<HTMLDivElement | null>(null)
  const ldsEllipsisRef = useRef<HTMLDivElement | null>(null)

  const {
    data,
    fetchNextPage,
    isLoading,
    isFetching,
    isError,
    hasNextPage,
  } = useFilterMarcasQuery();

  const handleSort = (e: React.MouseEvent<HTMLTableCellElement, MouseEvent>) => {
    let fieldname = e.currentTarget.dataset.campo as string;
    let text = e.currentTarget.textContent as string;
    const orderIdx = filterParamsMarcas.orders.findIndex(el => el.fieldname === fieldname)
    if(e.ctrlKey){
      if(orderIdx === -1){
        const newOrder = {fieldname, order_dir: "ASC", text}
        setFilterParamsMarcas({...filterParamsMarcas, orders: [...filterParamsMarcas.orders, newOrder]})
      }else{
        let newOrders = structuredClone(filterParamsMarcas.orders)
        if(newOrders[orderIdx].order_dir == "ASC"){
          newOrders[orderIdx] = {fieldname, order_dir: "DESC", text}
          setFilterParamsMarcas({...filterParamsMarcas, orders: newOrders})
        }else{
          newOrders = newOrders.filter(el=>el.fieldname !== fieldname)
          setFilterParamsMarcas({...filterParamsMarcas, orders: newOrders})
        }
      }
    }else{
      if(orderIdx === -1){
        const newOrder = {fieldname, order_dir: "ASC", text}
        setFilterParamsMarcas({...filterParamsMarcas, orders: [newOrder]})
      }else{
        let newOrders = structuredClone(filterParamsMarcas.orders)
        if(newOrders[orderIdx].order_dir == "ASC"){
          const newOrder = {fieldname, order_dir: "DESC", text}
          setFilterParamsMarcas({...filterParamsMarcas, orders: [newOrder]})
        }else{
          setFilterParamsMarcas({...filterParamsMarcas, orders: []})
        }
      }

    }
  };
 
  useEffect(()=>{
    if(data?.pages[0].error || !data?.pages[0].filas) return
    const newFilas = data?.pages.flatMap(el => el.filas) as Marca[];
    setMarcas([...newFilas])
  },[data])

  useEffect(()=>{
    if(data?.pages[0].error || isError) return
    if(!isFetching) {
      const {equals, between, orders} = filterParamsMarcas
      setFilterMarcasCurrent({equals, between, orders})
      const newCamposMarcas = camposMarca.map(el=>{
        const order = orders.find(order => order.fieldname === el.fieldname)
        return order ? {...el, order_dir: order?.order_dir} : {...el, order_dir: ""}
      })
    setCamposMarca(newCamposMarcas)
    }
  },[data, isFetching])

  useEffect(() => {
    if(data?.pages[0].error || isError){
      toast.error("Error al obtener registros", {
        autoClose: 3000, transition: Bounce,
      })
    }
  }, [data, isError])

  return (
      <Card className="overflow-hidden mx-auto" style={{maxWidth: "767.98px"}}>
        <div className="position-relative">
          <div className="table-responsive" style={{ height: "73vh" }} ref={tableRef}>
            {marcas && 
              <Table striped hover className="mb-1">
                <thead className="sticky-top">
                  <tr className="text-nowrap">
                    {camposMarca && camposMarca.map((el) => {
                      return ( el.show && (
                        <th
                          key={el.fieldname}
                          onClick={handleSort}
                          data-campo={el.fieldname}
                          role="button"
                          style={el.fieldname=="acciones" ? {position: "sticky", left: 0} : {}}
                        >
                          <div className="d-flex gap-1">
                            <div>{el.label}</div>
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
                  {marcas && marcas.map((marca) => (
                    <MarcasTblRow key={marca.id} marca={marca} camposMarca={camposMarca}/>
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
              {(marcas?.length === 0) && <div>No hay registros para mostrar</div>}
            </div>
          </div>
          {isLoading && <LdsEllipsisCenter innerRef={ldsEllipsisRef}/>}
          {isError && <div className="text-danger">Error de conexion</div>}
        </div>
      </Card>
  )
}

export default MarcasTbl
