import { Badge, Button, Col, Container, Form, InputGroup, Row, Stack } from "react-bootstrap";
import { BsFiletypePdf, BsFiletypeXlsx } from "react-icons/bs";
import DynaIcon from "../../../app/components/DynaComponents";
import useClientesStore from "../../../app/store/useClientesStore";
// import { objToUriBase64 } from "../../../app/utils/funciones";
import { FaFilter } from "react-icons/fa";

type Props = { info:string };

export default function ClientesHead({info}: Props) {
  const {equal, between, order} = useClientesStore(state => state.clienteFilterInfo)
  const clienteFilterForm = useClientesStore(state => state.clienteFilterForm)
  // const clienteFilterParam = useClientesStore(state => state.clienteFilterParam)
  const setShowClienteFilter = useClientesStore(state => state.setShowClienteFilter)
  const setClienteFilterForm = useClientesStore(state => state.setClienteFilterForm)
  const setShowClienteForm = useClientesStore(state => state.setShowClienteForm)
  const setClienteFilterFormResetEqualItem = useClientesStore(state => state.setClienteFilterFormResetEqualItem)

  const handleSetShowClientesFilterMdl = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();
    setShowClienteFilter(true)
  };

  const resetBetweenItem = (field_name: string) => {
    let { between } = clienteFilterForm;
    between = between.filter((el) => el.field_name !== field_name);
    setClienteFilterForm({ ...clienteFilterForm, between: [...between] })
  };

  const resetSort = () => {
    setClienteFilterForm({ ...clienteFilterForm, order: [] })
  };

  const handleNuevo = () => {
    setShowClienteForm({showClienteForm: true, currentClienteId: 0})
  };

  const handleTraerTodo = () => {
    // const param = objToUriBase64(clienteFilterParam);
    // window.open(apiDOCS + "pdf/?action=clientes_report&p=" + param);
  };

  return (
    <Container className="mb-2 pt-2 position-relative">
      <Row className="align-items-center mb-2">
        <Col sm className="text-center text-sm-start">
          <h5>Lista de Clientes</h5>
        </Col>
        <Col sm className="text-center text-sm-start mb-3 mb-sm-0">
          <InputGroup>
            <Form.Control
              name="search"
              type="search"
              placeholder="Buscar"
              value={clienteFilterForm.search}
              onChange={(e) => {
                setClienteFilterForm({ ...clienteFilterForm, search: e.target.value })
              }}
            />
            <Button
              variant="outline-secondary" 
              className="px-2 py-1"
              title="Mostrar filtros"
              onClick={handleSetShowClientesFilterMdl}
            >
              <FaFilter />
            </Button>
          </InputGroup>
        </Col>
        <Col className="text-center flex-sm-grow-0">
          <div className="d-flex justify-content-center align-items-center gap-3">
            <div className="d-flex">
              <Button variant="outline-success" className="border-0"
                title="Generar archivo excel"
                onClick={handleTraerTodo}
              >
                <BsFiletypeXlsx className="fs-5" />
              </Button>
              <Button variant="outline-danger" className="border-0"
                title="Generar archivo pdf"
                onClick={handleTraerTodo}
              >
                <BsFiletypePdf className="fs-5" />
              </Button>
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
            <div>{info}</div>
            {Boolean(equal.length) && (
              <Stack direction="horizontal" gap={2} className="flex-wrap">
                {equal.map((el, idx) => {
                  const value = el.field_label === "Estado" ? el.field_value === "1" ? "Habilitado" : "Deshabilitado" : el.field_value;
                  return (<Badge
                    bg="secondary"
                    role="button"
                    onClick={() => {
                      setClienteFilterFormResetEqualItem({field_name: el.field_name})
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
