const apiDOCS = import.meta.env.VITE_DOCS_URL;
import { useEffect, useRef, useState } from "react";
import { Badge, Button, Card, Col, Container, Form, Row, Stack } from "react-bootstrap";
import { Bounce, toast } from "react-toastify";
import { useDebounce } from "react-use";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";
import useUsersStore, { usersStoreInit } from "../../core/store/useUsersStore";
import UsersLstFilterMdl from "./UsersLstFilterMdl";
import { useFilterUsersQuery } from "../../core/hooks/useUsersQuery";
import { objToUriBase64 } from "../../core/utils/funciones";
import { LdsBar, LdsEllipsisCenter } from "../../core/components/Loaders";
import UserFormMdl from "./UserFormMdl";
import UsersTbl from "./UsersTbl";
import DynaIcon from "../../core/components/DynaComponents";
import { UserT } from "../../core/types";

export default function Users(){
  const filterParamsUsers = useUsersStore(state => state.filterParamsUsers)
  const setFilterParamsUsers = useUsersStore(state => state.setFilterParamsUsers)
  const filterUsersCurrent = useUsersStore(state => state.filterUsersCurrent)
  const setFilterUsersCurrent = useUsersStore(state => state.setFilterUsersCurrent)
  const setCurrentUserId = useUsersStore(state => state.setCurrentUserId)

  const [inputSearch, setInputSearch] = useState("")
  const [filas, setFilas] = useState<UserT[] | null>(null)

  const {
    data,
    fetchNextPage,
    isLoading,
    isFetching,
    isError,
    hasNextPage,
  } = useFilterUsersQuery();
  
  const setShowUserFormMdl = useUsersStore(state => state.setShowUserFormMdl)
  const setShowUsersFilterMdl = useUsersStore(state => state.setShowUsersFilterMdl)
  const tableRef = useRef<HTMLDivElement | null>(null)
  const ldsEllipsisRef = useRef<HTMLDivElement | null>(null)

  useDebounce(() => { 
    if (inputSearch.toLowerCase().trim() == filterParamsUsers.search.toLowerCase().trim()) return
    setFilterParamsUsers({ ...filterParamsUsers, search: inputSearch.trim() });
  }, 1000, [inputSearch]);

  const handleNextPage = () => {
    fetchNextPage();
  };
  
  const handleInputSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputSearch(e.target.value)
  };

  const handleUnequal = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const {campo_name} = e.currentTarget.dataset
    if(campo_name){
      let { equals } = filterParamsUsers;
      equals = equals.filter(el => el.campo_name !== campo_name)
      setFilterParamsUsers({ ...filterParamsUsers, equals: [...equals] });
    }
  };
  
  const handleUnsort = () => {
    setFilterParamsUsers({...filterParamsUsers, orders: usersStoreInit.filterParamsUsers.orders})
  };

  const handleUnbetween = () => {
    setFilterParamsUsers({...filterParamsUsers, between: usersStoreInit.filterParamsUsers.between})
  }

  const handleNuevo = () => {
    setCurrentUserId(0)
    setShowUserFormMdl(true);
  };

  const handleShowFilterMdl = () => {
    setShowUsersFilterMdl(true);
  };

  const getDateRangeInfo = () => {
    const {between} = filterParamsUsers
    if(!between.campo_name) return ""
    let date_from = between.range.split(",")[0].split(" ")[0]
    let date_to = between.range.split(",")[1].trim().split(" ")[0]
    date_from = date_from.split("-").reverse().join("/")
    date_to = date_to.split("-").reverse().join("/")
    let range = (date_from == date_to)
      ? date_from 
      : `Entre ${date_from} y ${date_to}`
    return range
  }

  const handleTraerTodo = () => {
    const param = objToUriBase64(filterParamsUsers)
    window.open(apiDOCS+"pdf/?action=users_report&p=" + param)
  }

  useEffect(()=>{
    setInputSearch(filterParamsUsers.search)
    // setFilterParamsUsers({...filterParamsUsers, orders: [{campo_name: "created_at", order_dir: "DESC", text: "F Creación"}]})
  }, [])
  
  useEffect(()=>{
    if(data?.pages[0].error || !data?.pages[0].filas) return
    const newFilas = data?.pages.flatMap(el => el.filas) as UserT[];
    setFilas([...newFilas])
  },[data])

  useEffect(()=>{
    if(data?.pages[0].error || isError) return
    if(!isFetching) setFilterUsersCurrent()
  },[data, isFetching])

  useEffect(() => {
    if(data?.pages[0].error || isError){
      toast.error("Error al obtener registros", {
        autoClose: 3000,
        transition: Bounce,
      })
    }
  }, [data, isError])

  return (
    <>
      <Container className="mb-2 pt-2 position-relative">
          {isFetching && <LdsBar />}
        <Row className="align-items-center">
          <Col sm className="text-center text-sm-start">
            <h5>Lista de Usuarios</h5>
          </Col>
          <Col sm className="text-center text-sm-start mb-3 mb-sm-0">
            <Form.Control
              type="search"
              placeholder="Buscar"
              value={inputSearch}
              onChange={handleInputSearch}
              />
          </Col>
          <Col className="text-center flex-sm-grow-0">
            <div className="d-flex justify-content-center align-items-center gap-3">
              <div className="d-flex">
                <div 
                  role="button" 
                  className="d-flex align-items-center px-2 boton-icon"
                  title="Generar archivo xls"
                  onClick={handleTraerTodo}
                >
                  <FaFileExcel className="fs-5 text-success"/>
                </div>
                <div 
                  role="button" 
                  className="d-flex align-items-center px-2 boton-icon" 
                  title="Generar archivo pdf"
                  onClick={handleTraerTodo}
                >
                  <FaFilePdf className="fs-5 text-danger"/>
                </div>
              </div>
              <div
                role="button"
                onClick={handleShowFilterMdl}
                className="px-1"
                title="Filtros"
              >
                <DynaIcon name="FaEllipsisV" />
              </div>
              <Button onClick={handleNuevo} variant="primary">
                Nuevo
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
        <div className="position-relative mb-2 overflow-hidden">
          <Row className="align-items-center">
            <Col className="text-end">
              <div className="d-flex gap-2 flex-wrap">
                <Stack
                  direction="horizontal"
                  gap={2}
                  className={`${filterUsersCurrent.orders.length ? "" : "d-none"}`}
                >
                  <Badge bg="secondary" role="button" onClick={handleUnsort} className="d-flex gap-1">
                    <DynaIcon name="FaCircleXmark"  className="pr-4" />
                      ORDEN:
                      <div className="text-wrap">
                        {filterUsersCurrent.orders.map((el) => el.text).join(", ")}
                      </div>
                  </Badge>
                </Stack>
                  {(filterUsersCurrent.between.campo_name.length !== 0) &&
                    <Stack direction="horizontal" gap={2} className="flex-wrap">
                      <Badge bg="secondary" role="button" onClick={handleUnbetween} className="d-flex gap-1">
                        <DynaIcon name="FaCircleXmark"  className="pr-4" />
                        {`${filterUsersCurrent.between.campo_text}: `}
                        <div className="text-wrap">{getDateRangeInfo()}</div>
                      </Badge>
                    </Stack>
                  }
                <Stack direction="horizontal" gap={2}>
                  {filterUsersCurrent.equals.map((el, idx) => {
                    return (
                      <Badge 
                        bg="secondary" 
                        role="button" 
                        onClick={handleUnequal} 
                        className="d-flex gap-1" 
                        key={idx}
                        data-campo_name={el.campo_name}
                      >
                        <DynaIcon name="FaCircleXmark"  className="pr-4" />
                        <div>{el.campo_text}: {el.text}</div>
                      </Badge>
                    )
                  })}
                </Stack>
              </div>
            </Col>
          </Row>
      </div>
      <Card className="overflow-hidden">
        <div className="position-relative">
          <div className="table-responsive" style={{ height: "73vh" }} ref={tableRef}>
            {filas && <UsersTbl filas={filas} />}
            <div className="position-relative">
              {hasNextPage &&
                <div className="m-3">
                  <button onClick={handleNextPage} className="btn btn-success">Cargar mas registros</button>
                </div>
              }
              {(filas?.length === 0) && <div>No hay registros para mostrar</div>}
            </div>
          </div>
          {isLoading && <LdsEllipsisCenter innerRef={ldsEllipsisRef}/>}
          {isError && <div className="text-danger">Error de conexion</div>}
        </div>
      </Card>
      <UsersLstFilterMdl />
      <UserFormMdl />
    </>
  );
}