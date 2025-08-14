import { Badge, Button, Col, Form, InputGroup, Row, Stack } from "react-bootstrap";
import { BsSearch } from "react-icons/bs";
import { useDebounce } from "react-use";
import DynaIcon from "../../../app/components/DynaComponents";
import { filterParamsInit } from "../../../app/utils/constants";
import useClientesStore from "../../../app/store/useClientesStore";

export default function ClientesHead() {
  const setShowClienteForm = useClientesStore(state => state.setShowClienteForm)
  const setCurrentClienteId = useClientesStore(state => state.setCurrentClienteId)
  const filterInfoClientes = useClientesStore(state => state.filterInfoClientes)
  const filterParamsClientesForm = useClientesStore(state => state.filterParamsClientesForm)
  const setFilterParamsClientesForm = useClientesStore(state => state.setFilterParamsClientesForm)
  const inputSearch = useClientesStore(state => state.inputSearch)
  const setInputSearch = useClientesStore(state => state.setInputSearch)

  useDebounce(() => { 
    if (inputSearch.toLowerCase().trim() == filterParamsClientesForm.search.toLowerCase().trim()) return
    setFilterParamsClientesForm({ ...filterParamsClientesForm, search: inputSearch.trim() });
    console.log("hola")
  }, 500, [inputSearch]);

  const handleUnsort = () => {
    setFilterParamsClientesForm({...filterParamsClientesForm, orders: filterParamsInit.orders})
  };

  const handleNuevo = () => {
    setCurrentClienteId(0)
    setShowClienteForm(true);
  };

  return (
    <div className="mb-2 pt-2">
      <Row className="align-items-center mb-2">
        <Col sm className="text-center text-sm-start">
          <h5>Lista de Clientes</h5>
        </Col>
        <Col sm className="text-center text-sm-start mb-3 mb-sm-0">
          <InputGroup>
            <Form.Control
              size="sm"
              name="search"
              type="search"
              value={inputSearch}
              onChange={(e) => {
                setInputSearch(e.target.value)
              }}
            />
            <Button variant="outline-secondary" className="px-2 py-1">
              <BsSearch />
            </Button>
          </InputGroup>
        </Col>
        <Col className="text-center flex-sm-grow-0">
          <div className="d-flex justify-content-center align-items-center gap-3">
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
              className={`${filterInfoClientes.orders.length ? "" : "d-none"}`}
            >
              <Badge bg="secondary" role="button" onClick={handleUnsort} className="d-flex gap-1">
                <DynaIcon name="FaCircleXmark"  className="pr-4" />
                  ORDEN:
                  <div className="text-wrap">
                    {filterInfoClientes.orders.map((el) => el.field_label).join(", ")}
                  </div>
              </Badge>
            </Stack>
          </div>
        </Col>
      </Row>
    </div>
  )
}
