import Modal from "react-bootstrap/Modal";
import useUsersStore, { usersStoreInit } from "../../core/store/useUsersStore";
import { Badge, Button, Col, Form, Row, Tab, Tabs } from "react-bootstrap";
import { useEffect, useState } from "react";
import {
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
  subMonths,
  subWeeks,
} from "date-fns";
// import { useFilterUsersQuery } from "../../core/hooks/useUsersQuery";
import useCatalogosStore from "../../core/store/useCatalogosStore";
// import { setDate } from "date-fns/fp";

const dateRangeInit = { fieldname: "", campo_text: "", date_from: "", date_to: "" };
const equalFormInit = { rol_id: "", caja_id: "", estado: ""}

const UsersLstFilterMdl: React.FC = () => {
  const [tabName, setTabName] = useState("equals")
  const [dateRange, setDateRange] = useState(dateRangeInit);
  const [rangeName, setRangeName] = useState("")
  const [equalForm, setEqualForm] = useState(equalFormInit)
  const roles = useCatalogosStore(state => state.catalogos?.roles)
  const cajas = useCatalogosStore(state => state.catalogos?.cajas)
  const showUsersFilterMdl = useUsersStore(
    (state) => state.showUsersFilterMdl
  );
  const setShowUsersFilterMdl = useUsersStore(
    (state) => state.setShowUsersFilterMdl
  );
  const filterParamsUsers = useUsersStore((state) => state.filterParamsUsers);
  const setFilterParamsUsers = useUsersStore(state => state.setFilterParamsUsers)

  const handleClose = () => {
    setShowUsersFilterMdl(false);
  };


  const handleEqual = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const campo_text = e.currentTarget.previousElementSibling?.textContent || ""
    const { name: fieldname, value } = e.currentTarget;
    const text = e.currentTarget.options[e.currentTarget.selectedIndex].textContent || ""
    setEqualForm({...equalForm, [fieldname]:value})
    // equal({fieldname, value, text, campo_text})
    let { equals } = filterParamsUsers;
    const idx = equals.findIndex(el => el.fieldname === fieldname)
    if(!value){
      equals = equals.filter(el => el.fieldname !== fieldname)
    }else{
      if(idx === -1){
        equals = [ ...equals, {fieldname: fieldname, value: value, text, campo_text} ]
      }else{
        equals[idx] = {fieldname: fieldname, value: value, text, campo_text}
      }
    }
    setFilterParamsUsers({ ...filterParamsUsers, equals: [...equals] });
  }

  const handleSelectCampoRange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const fieldname = e.currentTarget.value;
    const campo_text = e.currentTarget.options[e.currentTarget.selectedIndex].textContent || ""
    if (!fieldname) {
      setDateRange(dateRangeInit);
      setRangeName("")
    } else {
      setDateRange({ ...dateRange, fieldname, campo_text });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    if (name === "date_from") {
      setDateRange({ ...dateRange, [name]: value, date_to: value });
    } else if (name === "date_to") {
      if (value === "") {
        setDateRange({ ...dateRange, [name]: dateRange.date_from });
      } else {
        setDateRange({ ...dateRange, [name]: value });
      }
    }
    setRangeName("")
  };

  const handleRangePred = (e: React.MouseEvent<HTMLElement>) => {
    const { range_name } = e.currentTarget.dataset;
    if (!dateRange.fieldname) return;
    let startDate = new Date();
    let endDate = new Date();
    if (range_name === "lastWeek") {
      startDate = startOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 0 });
      endDate = endOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 0 });
    } else if (range_name === "thisWeek") {
      startDate = startOfWeek(new Date(), { weekStartsOn: 0 });
      endDate = endOfWeek(new Date(), { weekStartsOn: 0 });
    } else if (range_name === "lastMonth") {
      startDate = startOfMonth(subMonths(new Date(), 1));
      endDate = endOfMonth(subMonths(new Date(), 1));
    } else if (range_name === "thisMonth") {
      startDate = startOfMonth(new Date());
      endDate = endOfMonth(new Date());
    }
    const startFormatDate = format(startDate, "yyyy-MM-dd");
    const endFormatDate = format(endDate, "yyyy-MM-dd");
    setDateRange({ ...dateRange, date_from: startFormatDate, date_to: endFormatDate });
    if(range_name){
      setRangeName(range_name)
    }
  };

  const handleFilterBetween = () => {
    if(!dateRange.fieldname || !dateRange.date_from || !dateRange.date_to) return
    const newBetween = {
      fieldname: dateRange.fieldname,
      campo_text: dateRange.campo_text,
      range:
        (dateRange.date_from ? dateRange.date_from + " 00:00:00, " : "") +
        (dateRange.date_to ? dateRange.date_to + " 23:59:59" : ""),
    };
    if (
      filterParamsUsers.between.fieldname == newBetween.fieldname &&
      filterParamsUsers.between.range == newBetween.range
    ) return;
    // between(newBetween)
    // const newBetween = {fieldname, campo_text, range}
    setFilterParamsUsers({ ...filterParamsUsers, between: newBetween });
  };

  const handleUnbetween = () => {
    setDateRange(dateRangeInit);
    setRangeName("")
    if(!filterParamsUsers.between.fieldname) return
    // unbetween()
    setFilterParamsUsers({...filterParamsUsers, between: usersStoreInit.filterParamsUsers.between})
    
  }
  useEffect(() => {

  },[filterParamsUsers])

  useEffect(() => {
    if(showUsersFilterMdl){
      if(!filterParamsUsers.between.fieldname){
        handleUnbetween()
      }
      const {range, fieldname, campo_text} = filterParamsUsers.between
      const date_from = range ? range.split(", ")[0].split(" ")[0] : ""
      const date_to = range ? range.split(", ")[1].split(" ")[0] : ""
      setDateRange({fieldname, campo_text, date_from, date_to})
      const newEqualForm = structuredClone(equalFormInit)
      for (const el of filterParamsUsers.equals) {
        const fieldname = el.fieldname as keyof typeof equalFormInit
        newEqualForm[fieldname] = el.value
      }
      setEqualForm(newEqualForm)
    }
  },[showUsersFilterMdl])

  return (
    <Modal 
      show={showUsersFilterMdl} 
      onHide={handleClose}
    >
      <Modal.Body>
        <Tabs
          activeKey={tabName}
          onSelect={(k) => setTabName(k as string)}
          className="mb-3"
        >
          <Tab eventKey="equals" title="Igual a">
            <Form>
              <Form.Group as={Col} className="mb-3">
                <Form.Label htmlFor="f_rol_id">Rol</Form.Label>
                <Form.Select
                  id="f_rol_id"
                  name="rol_id"
                  value={equalForm.rol_id}
                  onChange={handleEqual}
                >
                  <option value="">Todos</option>
                  {roles?.map((el) => (
                    <option key={el.id} value={el.id}>
                      {el.rol}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group as={Col} className="mb-3">
                <Form.Label htmlFor="f_caja_id">Caja</Form.Label>
                <Form.Select
                  id="f_caja_id"
                  name="caja_id"
                  value={equalForm.caja_id}
                  onChange={handleEqual}
                >
                  <option value="">Todos</option>
                  {cajas?.map((el) => (
                    <option key={el.id} value={el.id}>
                      {el.descripcion}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group as={Col} className="mb-3">
                <Form.Label htmlFor="f_estado">Estado</Form.Label>
                <Form.Select
                  id="f_estado"
                  name="estado"
                  value={equalForm.estado}
                  onChange={handleEqual}
                >
                  <option value="">Todos</option>
                  <option value="1">Habilidato</option>
                  <option value="0">Deshabilitado</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </Tab>
          <Tab eventKey="between" title="Rango">
            <Form.Group as={Col} className="mb-3">
              <Form.Label htmlFor="f_entre">Rango de fechas</Form.Label>
              <Form.Select
                id="f_entre"
                name="fieldname"
                value={dateRange.fieldname}
                onChange={handleSelectCampoRange}
              >
                <option value="">Ninguno</option>
                <option value="created_at">Fecha de creación</option>
                <option value="updated_at">Fecha de actualización</option>
              </Form.Select>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="1">
                Del
              </Form.Label>
              <Col sm="5">
                <Form.Control
                  disabled={!Boolean(dateRange.fieldname)}
                  type="date"
                  name="date_from"
                  value={dateRange.date_from}
                  onChange={handleChange}
                />
              </Col>
              <Form.Label column sm="1">
                Al
              </Form.Label>
              <Col sm="5">
                <Form.Control
                  disabled={!Boolean(dateRange.date_from)}
                  type="date"
                  name="date_to"
                  value={dateRange.date_to}
                  onChange={handleChange}
                />
              </Col>
            </Form.Group>
              <div className="d-flex gap-3 my-3 flex-wrap">
                <Badge
                  bg={rangeName === "lastMonth" ? "success" : ""}
                  role="button"
                  onClick={handleRangePred}
                  data-range_name="lastMonth"
                  >
                  Mes pasado
                </Badge>
                <Badge
                  bg={rangeName === "lastWeek" ? "success" : ""}
                  role="button"
                  onClick={handleRangePred}
                  data-range_name="lastWeek"
                  >
                  Semana pasada
                </Badge>
                <Badge 
                  bg={rangeName === "today" ? "success" : ""}
                  role="button" 
                  onClick={handleRangePred} 
                  data-range_name="today"
                  >
                  Hoy
                </Badge>
                <Badge
                  bg={rangeName === "thisWeek" ? "success" : ""}
                  role="button"
                  onClick={handleRangePred}
                  data-range_name="thisWeek"
                  >
                  Esta semana
                </Badge>
                <Badge
                  bg={rangeName === "thisMonth" ? "success" : ""}
                  role="button"
                  onClick={handleRangePred}
                  data-range_name="thisMonth"
                >
                  Este mes
                </Badge>
              </div>
            <Form.Group className="mt-4">
              <Col className="text-end">
                <Button onClick={handleUnbetween} variant="secondary" className="mx-3">Eliminar rango</Button>
                <Button onClick={handleFilterBetween}>Filtrar</Button>
              </Col>
            </Form.Group>
          </Tab>
        </Tabs>
      </Modal.Body>
    </Modal>
  );
}

export default UsersLstFilterMdl;
