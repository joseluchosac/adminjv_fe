const apiDOCS = import.meta.env.VITE_DOCS_URL;
import { useEffect, useState } from 'react'
import { Badge, Button, Col, Container, Dropdown, Form, Row, Stack } from 'react-bootstrap'
import { LdsBar } from '../../../app/components/Loaders'
import { FaFileExcel, FaFilePdf, FaFilter } from 'react-icons/fa'
import DynaIcon from '../../../app/components/DynaComponents'
import { useDebounce } from 'react-use'
import { filterParamsInit } from '../../../app/utils/constants'
import { objToUriBase64 } from '../../../app/utils/funciones'
import { useMovimientos } from '../hooks/useMovimientos';

type Props = {isFetching: boolean}

export default function MovimientosLstHead({isFetching}: Props) {
  const [inputSearch, setInputSearch] = useState("")

  const {
    filterInfoMovimientos,
    filterParamsMovimientosForm,
    setFilterParamsMovimientosForm,
    setShowMovimientosFilterMdl,
    modo,
    setModo,
  } = useMovimientos()

  useDebounce(() => { 
    if (inputSearch.toLowerCase().trim() == filterParamsMovimientosForm.search.toLowerCase().trim()) return
    setFilterParamsMovimientosForm({ ...filterParamsMovimientosForm, search: inputSearch.trim() });
  }, 500, [inputSearch]);
  const handleSetShowMovimientosFilterMdl = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault()
    setShowMovimientosFilterMdl(true)
  }
  const handleUnequal = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const {field_name} = e.currentTarget.dataset
    if(field_name){
      let { equals } = filterParamsMovimientosForm;
      equals = equals.filter(el => el.field_name !== field_name)
      setFilterParamsMovimientosForm({ ...filterParamsMovimientosForm, equals: [...equals] });
    }
  };
  
  const handleUnsort = () => {
    setFilterParamsMovimientosForm({...filterParamsMovimientosForm, orders: filterParamsInit.orders})
  };

  const handleUnbetween = () => {
    setFilterParamsMovimientosForm({...filterParamsMovimientosForm, between: filterParamsInit.between})
  }

  const handleNuevo = () => {
    setModo(prev=>({...prev, vista:"edit", movimientoId: 0}))
  };

  const getDateRangeInfo = () => {
    const {between} = filterParamsMovimientosForm
    if(!between.field_name) return ""
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
    const param = objToUriBase64(filterParamsMovimientosForm)
    window.open(apiDOCS+"pdf/?action=movimientos_report&p=" + param)
  }

  useEffect(()=>{
    setInputSearch(filterParamsMovimientosForm.search)
  }, [])


  return (
      <Container className={`mb-2 pt-2 position-relative ${modo.vista === "edit" ? "d-none" : ""}`}>
          {isFetching && <LdsBar />}
        <Row className="align-items-center">
          <Col sm className="text-center text-sm-start">
            <h5>Lista de Movimientos</h5>
          </Col>
          <Col sm className="text-center text-sm-start mb-3 mb-sm-0">
            <Form.Control
              name="buscar"
              type="search"
              placeholder="Buscar"
              value={inputSearch}
              onChange={(e)=>setInputSearch(e.target.value)}
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
              <Dropdown style={{zIndex:"1030"}}>
                <Dropdown.Toggle split  variant="outline-secondary" />
                <Dropdown.Menu>
                  <Dropdown.Item href="#" onClick={handleSetShowMovimientosFilterMdl} className='d-flex gap-2 align-items-center'>
                    <FaFilter/><div>Mostrar filtros</div>
                  </Dropdown.Item>
                </Dropdown.Menu>                
              </Dropdown>
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
                className={`${filterInfoMovimientos.orders.length ? "" : "d-none"}`}
              >
                <Badge bg="secondary" role="button" onClick={handleUnsort} className="d-flex gap-1">
                  <DynaIcon name="FaCircleXmark"  className="pr-4" />
                    ORDEN:
                    <div className="text-wrap">
                      {filterInfoMovimientos.orders.map((el) => el.field_label).join(", ")}
                    </div>
                </Badge>
              </Stack>
                {(filterInfoMovimientos.between.field_name.length !== 0) &&
                  <Stack direction="horizontal" gap={2} className="flex-wrap">
                    <Badge bg="secondary" role="button" onClick={handleUnbetween} className="d-flex gap-1">
                      <DynaIcon name="FaCircleXmark"  className="pr-4" />
                      {`${filterInfoMovimientos.between.field_label}: `}
                      <div className="text-wrap">{getDateRangeInfo()}</div>
                    </Badge>
                  </Stack>
                }
              <Stack direction="horizontal" gap={2}>
                {filterInfoMovimientos.equals.map((el, idx) => {
                  return (
                    <Badge 
                      bg="secondary" 
                      role="button" 
                      onClick={handleUnequal} 
                      className="d-flex gap-1" 
                      key={idx}
                      data-field_name={el.field_name}
                    >
                      <DynaIcon name="FaCircleXmark"  className="pr-4" />
                      <div>{el.label_name}: {el.label_value}</div>
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
