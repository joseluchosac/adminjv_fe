import { Badge, Button, Col, Container, Form, InputGroup, Row, Stack } from "react-bootstrap";
import DynaIcon from "../../../app/components/DynaComponents";
import useMarcasStore from "../../../app/store/useMarcasStore";
import { FaFilter } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

type Props = { info:string };

export default function MarcasHead({info}: Props) {
  const navigate = useNavigate()
  const {equal, between, order} = useMarcasStore(state => state.marcaFilterInfo)
  const marcaFilterForm = useMarcasStore(state => state.marcaFilterForm)
  const setShowMarcaFilter = useMarcasStore(state => state.setShowMarcaFilter)
  const setMarcaFilterForm = useMarcasStore(state => state.setMarcaFilterForm)
  const setMarcaFilterFormResetEqualItem = useMarcasStore(state => state.setMarcaFilterFormResetEqualItem)

  const handleSetShowMarcasFilterMdl = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();
    setShowMarcaFilter(true)
  };

  const resetBetweenItem = (field_name: string) => {
    let { between } = marcaFilterForm;
    between = between.filter((el) => el.field_name !== field_name);
    setMarcaFilterForm({ ...marcaFilterForm, between: [...between] })
  };

  const resetSort = () => {
    setMarcaFilterForm({ ...marcaFilterForm, order: [] })
  };


  return (
    <Container className="mb-2 pt-2 position-relative">
      <Row className="align-items-center mb-2">
        <Col sm className="text-center text-sm-start">
          <h5>Lista de Marcas</h5>
        </Col>
        <Col sm className="text-center text-sm-start mb-3 mb-sm-0">
          <InputGroup>
            <Form.Control
              name="search"
              type="search"
              placeholder="Buscar"
              value={marcaFilterForm.search}
              onChange={(e) => {
                setMarcaFilterForm({ ...marcaFilterForm, search: e.target.value })
              }}
            />
            <Button
              variant="outline-secondary" 
              className="px-2 py-1"
              title="Mostrar filtros"
              onClick={handleSetShowMarcasFilterMdl}
            >
              <FaFilter />
            </Button>
          </InputGroup>
        </Col>
        <Col className="text-center flex-sm-grow-0">
          <div className="d-flex justify-content-center align-items-center gap-3">
            <div className="d-flex">

            </div>
            <Button 
              onClick={() => navigate(`${location.pathname}?edit=0`)}
              variant="primary"
            >
              Nuevo
            </Button>
          </div>
        </Col>
      </Row>
      <Row className="align-items-center">
        <Col className="text-end">
          <div className="d-flex gap-2 flex-wrap">
            <div>{info}</div>
            {Boolean(equal.length) && (
              <Stack direction="horizontal" gap={2} className="flex-wrap">
                {equal.map((el, idx) => {
                  const value = el.field_label === "Estado" ? el.field_value === "1" ? "Habilitado" : "Deshabilitado" : el.field_value;
                  return (<Badge
                    bg="secondary"
                    role="button"
                    onClick={() => {
                      setMarcaFilterFormResetEqualItem({field_name: el.field_name})
                    }}
                    className="d-flex gap-1"
                    key={idx}
                  >
                    <DynaIcon name="FaCircleXmark" className="pr-4" />
                    <div>
                      {el.field_label}: {value}
                    </div>
                  </Badge>)
                })}
              </Stack>
            )}
            {Boolean(between.length && between[0].from && between[0].to) && (
              <Stack direction="horizontal" gap={2} className="flex-wrap">
                {between.map((el, idx) => (
                  <Badge
                    bg="secondary"
                    role="button"
                    onClick={() => resetBetweenItem(el.field_name)}
                    className="d-flex gap-1"
                    key={idx}
                  >
                    <DynaIcon name="FaCircleXmark" className="pr-4" />
                    <div>
                      {(el.from.split(" ")[0] === el.to.split(" ")[0])
                        ? `${el.field_label}: ${el.from.split(" ")[0]}`
                        : `${el.field_label}: de ${el.from.split(" ")[0]} a ${el.to.split(" ")[0]
                      }`}
                    </div>
                  </Badge>
                ))}
              </Stack>
            )}
            {Boolean(order.length) && (
              <Stack direction="horizontal" gap={2} className="flex-wrap">
                <Badge
                  bg="secondary"
                  role="button"
                  className="d-flex gap-1"
                  title="Quitar orden"
                  onClick={resetSort}
                >
                  <DynaIcon name="FaCircleXmark" className="pr-4" />
                  Orden:
                  <div className="text-wrap">
                    {order.map((el) => el.field_label).join(", ")}
                  </div>
                </Badge>
              </Stack>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  )
}
