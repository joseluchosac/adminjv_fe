import { useEffect, useRef } from "react";
import { Card, Table } from "react-bootstrap";
import { toast } from "react-toastify";
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
    let field_name = e.currentTarget.dataset.campo as string;
    let field_label = e.currentTarget.textContent as string;
    const orderIdx = filterParamsMarcas.orders.findIndex(el => el.field_name === field_name)
    if(e.ctrlKey){
      if(orderIdx === -1){
        const newOrder = {field_name, order_dir: "ASC", field_label}
        setFilterParamsMarcas({...filterParamsMarcas, orders: [...filterParamsMarcas.orders, newOrder]})
      }else{
        let newOrders = structuredClone(filterParamsMarcas.orders)
        if(newOrders[orderIdx].order_dir == "ASC"){
          newOrders[orderIdx] = {field_name, order_dir: "DESC", field_label}
          setFilterParamsMarcas({...filterParamsMarcas, orders: newOrders})
        }else{
          newOrders = newOrders.filter(el=>el.field_name !== field_name)
          setFilterParamsMarcas({...filterParamsMarcas, orders: newOrders})
        }
      }
    }else{
      if(orderIdx === -1){
        const newOrder = {field_name, order_dir: "ASC", field_label}
        setFilterParamsMarcas({...filterParamsMarcas, orders: [newOrder]})
      }else{
        let newOrders = structuredClone(filterParamsMarcas.orders)
        if(newOrders[orderIdx].order_dir == "ASC"){
          const newOrder = {field_name, order_dir: "DESC", field_label}
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
        const order = orders.find(order => order.field_name === el.field_name)
        return order ? {...el, order_dir: order?.order_dir} : {...el, order_dir: ""}
      })
    setCamposMarca(newCamposMarcas)
    }
  },[data, isFetching])

  useEffect(() => {
    if(data?.pages[0].error || isError){
      toast.error("Error al obtener registros")
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
