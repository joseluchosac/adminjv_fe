import { useMemo, useRef, } from "react";
import { Card, Table } from "react-bootstrap";
import { useUsersFilterQuery } from "../../../api/queries/useUsersQuery";
import DynaIcon from "../../../app/components/DynaComponents";
import { UserItem } from "../../../app/types";
import { LdsBar, LdsEllipsisCenter } from "../../../app/components/Loaders";
import UsersHead from "./UsersHead";
import UsersLstItem from "./UsersLstItem";
import { UsersFilter } from "./UsersFilter";


export default function UsersLst() {
  const tableRef = useRef<HTMLDivElement | null>(null)
  const ldsEllipsisRef = useRef<HTMLDivElement | null>(null)

  const {
    data,
    fetchNextPage,
    isLoading,
    isFetching,
    isError,
    hasNextPage,
    dispatchUsers,
    camposUser
  } = useUsersFilterQuery();
  
  const info = useMemo(() => {
    let mostrando  = data?.pages.reduce((acum, curVal)=>{
      return acum + curVal.filas.length
    },0)
    const total = data?.pages[0]?.num_regs || 0
    return total ? `${mostrando} de ${total} reg` : ' '
  }, [data?.pages])

  const sort = (field_name:string, field_label: string, ctrlKey: boolean) => {
    dispatchUsers({
      type: 'SET_USER_FILTER_FORM_SORT_TABLE',
      payload: {field_name, field_label, ctrlKey}
    })
  };

  if(!data && !isFetching){
    return <div>Error al obtener lista</div>
  }

  return (
    <div className="position-relative">
      {isFetching && <LdsBar />}
      <UsersHead info={info}/>
      <UsersFilter isFetching={isFetching} />
      <Card className="overflow-hidden">
        <div className="position-relative">
          <div className="table-responsive" style={{ height: "73vh" }} ref={tableRef}>
            <Table striped hover className="mb-1">
              <thead className="sticky-top">
                <tr className="text-nowrap">
                  {camposUser && camposUser.filter(el=>el.show).map((el) => {
                    return (
                      <th
                        key={el.field_name}
                        onClick={(e) => {
                          if(!el.orderable) return
                          sort(el.field_name, el.field_label, e.ctrlKey)
                        }}
                        role={el.orderable ? "button" : "columnheader"}
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
                {data && data?.pages.flatMap(el => el.filas).map((user: UserItem) => (
                  <UsersLstItem key={user.id} user={user}/>
                ))}
              </tbody>
            </Table>
            <div className="position-relative">
              {hasNextPage &&
                <div className="m-3">
                  <button 
                    onClick={() => fetchNextPage()} 
                    className="btn btn-success"
                  >Cargar mas registros</button>
                </div>
              }
              {(data?.pages[0].num_regs === 0) && <div>No hay registros para mostrar</div>}
            </div>
          </div>
          {isLoading && <LdsEllipsisCenter innerRef={ldsEllipsisRef}/>}
          {isError && <div className="text-danger">Error de conexion</div>}
        </div>
      </Card>
    </div>
  )
}
