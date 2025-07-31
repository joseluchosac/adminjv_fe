const apiDOCS = import.meta.env.VITE_DOCS_URL;
import { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Col,
  Container,
  Dropdown,
  Form,
  Row,
  Stack,
} from "react-bootstrap";
import { LdsBar } from "../../../core/components/Loaders";
import { FaFileExcel, FaFilePdf, FaFilter } from "react-icons/fa";
import DynaIcon from "../../../core/components/DynaComponents";
import { useDebounce } from "react-use";
import { objToUriBase64 } from "../../../core/utils/funciones";
import { useUsers } from "../context/UsersContext";

type Props = { isFetching: boolean };

export default function UsersHead({ isFetching }: Props) {
  const [inputSearch, setInputSearch] = useState("");

  const {
    setShowUserForm,
    setCurrentUserId,
    infoFilterUsers: { equal, between, order },
    filterParamsUsersForm,
    setFilterParamsUsersForm,
    setShowUsersFilterMdl,
  } = useUsers();

  useDebounce(
    () => {
      if (
        inputSearch.toLowerCase().trim() ==
        filterParamsUsersForm.search.toLowerCase().trim()
      )
        return;
      setFilterParamsUsersForm({
        ...filterParamsUsersForm,
        search: inputSearch.trim(),
      });
    },
    500,
    [inputSearch]
  );

  const handleSetShowUsersFilterMdl = (
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    e.preventDefault();
    setShowUsersFilterMdl(true);
  };

  const resetEqual = (field_name: string) => {
    if (field_name) {
      let { equal } = filterParamsUsersForm;
      equal = equal.filter((el) => el.field_name !== field_name);
      setFilterParamsUsersForm({ ...filterParamsUsersForm, equal: [...equal] });
    }
  };
  const resetBetween = (field_name: string) => {
    let { between } = filterParamsUsersForm;
    between = between.filter((el) => el.field_name !== field_name);
    setFilterParamsUsersForm({
      ...filterParamsUsersForm,
      between: [...between],
    });
  };
  const resetSort = () => {
    setFilterParamsUsersForm({ ...filterParamsUsersForm, order: [] });
  };

  const handleNuevo = () => {
    setCurrentUserId(0);
    setShowUserForm(true);
  };

  const handleTraerTodo = () => {
    const param = objToUriBase64(filterParamsUsersForm);
    window.open(apiDOCS + "pdf/?action=users_report&p=" + param);
  };

  useEffect(() => {
    setInputSearch(filterParamsUsersForm.search);
  }, []);

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
            onChange={(e) => setInputSearch(e.target.value)}
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
                <FaFileExcel className="fs-5 text-success" />
              </div>
              <div
                role="button"
                className="d-flex align-items-center px-2 boton-icon"
                title="Generar archivo pdf"
                onClick={handleTraerTodo}
              >
                <FaFilePdf className="fs-5 text-danger" />
              </div>
            </div>
            <Dropdown style={{ zIndex: "1030" }}>
              <Dropdown.Toggle split variant="outline-secondary" />
              <Dropdown.Menu>
                <Dropdown.Item
                  href="#"
                  onClick={handleSetShowUsersFilterMdl}
                  className="d-flex gap-2 align-items-center"
                >
                  <FaFilter />
                  <div>Mostrar filtros</div>
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
            {Boolean(equal.length) && (
              <Stack direction="horizontal" gap={2} className="flex-wrap">
                {equal.map((el, idx) => (
                  <Badge
                    bg="secondary"
                    role="button"
                    onClick={() => resetEqual(el.field_name)}
                    className="d-flex gap-1"
                    key={idx}
                  >
                    <DynaIcon name="FaCircleXmark" className="pr-4" />
                    <div>
                      {el.field_label}: {el.field_value}
                    </div>
                  </Badge>
                ))}
              </Stack>
            )}
            {Boolean(between.length) && (
              <Stack direction="horizontal" gap={2} className="flex-wrap">
                {between.map((el, idx) => (
                  <Badge
                    bg="secondary"
                    role="button"
                    onClick={() => resetBetween(el.field_name)}
                    className="d-flex gap-1"
                    key={idx}
                  >
                    <DynaIcon name="FaCircleXmark" className="pr-4" />
                    <div>
                      {`${el.field_label}: de ${el.from.split(" ")[0]} a ${
                        el.to.split(" ")[0]
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
                  ORDEN:
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
  );
}
