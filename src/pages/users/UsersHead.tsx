const apiDOCS = import.meta.env.VITE_DOCS_URL;
import { useEffect, useState } from 'react'
import { Badge, Button, Col, Container, Form, Row, Stack } from 'react-bootstrap'
import { LdsBar } from '../../core/components/Loaders'
import { FaFileExcel, FaFilePdf } from 'react-icons/fa'
import DynaIcon from '../../core/components/DynaComponents'
import useUsersStore from '../../core/store/useUsersStore'
import { useFilterUsersQuery } from '../../core/hooks/useUsersQuery'
import { useDebounce } from 'react-use'
import { filterParamsInit } from '../../core/utils/constants'
import { objToUriBase64 } from '../../core/utils/funciones'
import { useUsers } from './context/UsersContext';

export default function UsersHead() {

  const [inputSearch, setInputSearch] = useState("")
  const filterParamsUsers = useUsersStore(state => state.filterParamsUsers)
  const setFilterParamsUsers = useUsersStore(state => state.setFilterParamsUsers)
  const setShowUsersFilterMdl = useUsersStore(state => state.setShowUsersFilterMdl)
  const {filterUsersCurrent, setCurrentUserId, setShowUserForm,} = useUsers()

  const {
    isFetching,
  } = useFilterUsersQuery();
  

  useDebounce(() => { 
    if (inputSearch.toLowerCase().trim() == filterParamsUsers.search.toLowerCase().trim()) return
    setFilterParamsUsers({ ...filterParamsUsers, search: inputSearch.trim() });
  }, 1000, [inputSearch]);


  const handleInputSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputSearch(e.target.value)
  };

  const handleUnequal = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const {fieldname} = e.currentTarget.dataset
    if(fieldname){
      let { equals } = filterParamsUsers;
      equals = equals.filter(el => el.fieldname !== fieldname)
      setFilterParamsUsers({ ...filterParamsUsers, equals: [...equals] });
    }
  };
  
  const handleUnsort = () => {
    setFilterParamsUsers({...filterParamsUsers, orders: filterParamsInit.orders})
  };

  const handleUnbetween = () => {
    setFilterParamsUsers({...filterParamsUsers, between: filterParamsInit.between})
  }

  const handleNuevo = () => {
    setCurrentUserId(0)
    setShowUserForm(true);
  };

  const handleShowFilterMdl = () => {
    setShowUsersFilterMdl(true);
  };

  const getDateRangeInfo = () => {
    const {between} = filterParamsUsers
    if(!between.fieldname) return ""
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
  }, [])


  return (
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
                {(filterUsersCurrent.between.fieldname.length !== 0) &&
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
                      data-fieldname={el.fieldname}
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
      </Container>
  )
}
