const apiDOCS = import.meta.env.VITE_DOCS_URL;
import { useEffect, useState } from 'react'
import { Badge, Button, Col, Container, Dropdown, Form, Row, Stack } from 'react-bootstrap'
import { FaFileExcel, FaFilePdf, FaFilter } from 'react-icons/fa'
import { useDebounce } from 'react-use'
import { useProductos } from '../context/ProductosContext';
import { filterParamsInit } from '../../../app/utils/constants';
import { objToUriBase64 } from '../../../app/utils/funciones';
import { LdsBar } from '../../../app/components/Loaders';
import DynaIcon from '../../../app/components/DynaComponents';

type Props = {isFetching: boolean}

export default function ProductosHead({isFetching}: Props) {
  const [inputSearch, setInputSearch] = useState("")
  const {
    filterInfoProductos,
    filterParamsProductosForm,
    setFilterParamsProductosForm,
    setShowProductosFilterMdl,
    modo,
    setModo,
  } = useProductos()

  useDebounce(() => { 
    if (inputSearch.toLowerCase().trim() == filterParamsProductosForm.search.toLowerCase().trim()) return
    setFilterParamsProductosForm({ ...filterParamsProductosForm, search: inputSearch.trim() });
  }, 500, [inputSearch]);

  const handleSetShowProductosFilterMdl = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault()
    setShowProductosFilterMdl(true)
  }
  const handleUnequal = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const {field_name} = e.currentTarget.dataset
    if(field_name){
      let { equals } = filterParamsProductosForm;
      equals = equals.filter(el => el.field_name !== field_name)
      setFilterParamsProductosForm({ ...filterParamsProductosForm, equals: [...equals] });
    }
  };
  
  const handleUnsort = () => {
    setFilterParamsProductosForm({...filterParamsProductosForm, orders: filterParamsInit.orders})
  };

  const handleUnbetween = () => {
    setFilterParamsProductosForm({...filterParamsProductosForm, between: filterParamsInit.between})
  }

  const handleNuevo = () => {
    setModo(prev=>({...prev, vista:"edit", productoId: 0}))
  };

  const getDateRangeInfo = () => {
    const {between} = filterParamsProductosForm
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
    const param = objToUriBase64(filterParamsProductosForm)
    window.open(apiDOCS+"pdf/?action=productos_report&p=" + param)
  }

  useEffect(()=>{
    setInputSearch(filterParamsProductosForm.search)
  }, [])


  return (
      <Container className={`mb-2 pt-2 position-relative ${modo.vista === "edit" ? "d-none" : ""}`}>
          {isFetching && <LdsBar />}
        <Row className="align-items-center">
          <Col sm className="text-center text-sm-start">
            <h5>Lista de Productos</h5>
          </Col>
          <Col sm className="text-center text-sm-start mb-3 mb-sm-0">
            <Form.Control
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
                  <Dropdown.Item href="#" onClick={handleSetShowProductosFilterMdl} className='d-flex gap-2 align-items-center'>
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
                className={`${filterInfoProductos.orders.length ? "" : "d-none"}`}
              >
                <Badge bg="secondary" role="button" onClick={handleUnsort} className="d-flex gap-1">
                  <DynaIcon name="FaCircleXmark"  className="pr-4" />
                    ORDEN:
                    <div className="text-wrap">
                      {filterInfoProductos.orders.map((el) => el.field_label).join(", ")}
                    </div>
                </Badge>
              </Stack>
                {(filterInfoProductos.between.field_name.length !== 0) &&
                  <Stack direction="horizontal" gap={2} className="flex-wrap">
                    <Badge bg="secondary" role="button" onClick={handleUnbetween} className="d-flex gap-1">
                      <DynaIcon name="FaCircleXmark"  className="pr-4" />
                      {`${filterInfoProductos.between.field_label}: `}
                      <div className="text-wrap">{getDateRangeInfo()}</div>
                    </Badge>
                  </Stack>
                }
              <Stack direction="horizontal" gap={2}>
                {filterInfoProductos.equals.map((el, idx) => {
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
