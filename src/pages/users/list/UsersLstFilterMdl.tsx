import Modal from "react-bootstrap/Modal";
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
// import { filterParamsInit } from "../../../core/utils/constants";
import { useUsers } from "../context/UsersContext";
import { CampoTable, EqualItem, OrderItem } from "../../../core/types";
import { LdsBar } from "../../../core/components/Loaders";
import { useCajasQuery } from "../../../core/hooks/useCatalogosQuery";
import { useRolesQuery } from "../../../core/hooks/useRolesQuery";

const dateRangeInit = { field_name: "", field_label: "", from: "", to: "" };
const equalFormInit = { rol: "", caja: "", estado: ""}

type Props = {
  isFetching: boolean;
  camposUser: CampoTable[]
}
const UsersLstFilterMdl: React.FC<Props> = ({isFetching, camposUser}) => {
  const [tabName, setTabName] = useState("order")
  const [dateRange, setDateRange] = useState(dateRangeInit);
  const [rangeName, setRangeName] = useState("")
  const [equalForm, setEqualForm] = useState(equalFormInit)
  const {roles} = useRolesQuery()
  const {cajas} = useCajasQuery()

  const {
    filterParamsUsersForm,
    setFilterParamsUsersForm,
    showUsersFilterMdl,
    setShowUsersFilterMdl
  } = useUsers()



  const handleChangeOrder = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const field_name = e.target.value
    const field_label = e.currentTarget.options[e.currentTarget.selectedIndex].textContent || ""
    const newOrders: OrderItem[] = field_name ? [{field_name, order_dir: "ASC", field_label}] : []
    setFilterParamsUsersForm({...filterParamsUsersForm, order: newOrders})
  }

  const handleChangeOrderDir = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const order_dir = e.target.value as "ASC" | "DESC"
    const newOrders: OrderItem[] = [{...filterParamsUsersForm.order[0], order_dir}]
    setFilterParamsUsersForm({...filterParamsUsersForm, order: newOrders})
  }

  const filterEqual = ({field_name, field_value, field_label}: EqualItem) => {
    setEqualForm({...equalForm, [field_name]: field_value})
    let equalClone = structuredClone(filterParamsUsersForm.equal);
    if(!field_value){
      equalClone = equalClone.filter(el => el.field_name !== field_name)
    }else{
      const idx = equalClone.findIndex(el => el.field_name === field_name)
      if(idx === -1){
        equalClone = [ ...equalClone, {field_name, field_value, field_label} ]
      }else{
        equalClone[idx] = {field_name, field_value, field_label}
      }
    }
    setFilterParamsUsersForm({ ...filterParamsUsersForm, equal: equalClone });
  }

  const handleSelectCampoRange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const field_name = e.currentTarget.value;
    const field_label = e.currentTarget.options[e.currentTarget.selectedIndex].textContent || ""
    if (!field_name) {
      setDateRange(dateRangeInit);
      setRangeName("")
    } else {
      setDateRange({ ...dateRange, field_name, field_label });
    }
  };

  const handleChangeDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    if (name === "from") {
      setDateRange({ ...dateRange, [name]: value, to: value });
    } else if (name === "to") {
      if (value === "") {
        setDateRange({ ...dateRange, [name]: dateRange.from });
      } else {
        setDateRange({ ...dateRange, [name]: value });
      }
    }
    setRangeName("")
  };

  const handleRangePred = (e: React.MouseEvent<HTMLElement>) => {
    const { range_name } = e.currentTarget.dataset;
    if (!dateRange.field_name) return;
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
    setDateRange({ ...dateRange, from: startFormatDate, to: endFormatDate });
    if(range_name){
      setRangeName(range_name)
    }
  };

  const handleFilterBetween = () => {
    if(!dateRange.field_name || !dateRange.from || !dateRange.to) return
    const newBetween = {
      field_name: dateRange.field_name,
      field_label: dateRange.field_label,
      from: dateRange.from ? dateRange.from + " 00:00:00" : "",
      to: dateRange.to ? dateRange.to + " 23:59:59" : "",
    };
    setFilterParamsUsersForm({ ...filterParamsUsersForm, between: [newBetween] });
  };

  const handleUnbetween = () => {
    setDateRange(dateRangeInit);
    setRangeName("")
    if(!filterParamsUsersForm.between.length) return
    setFilterParamsUsersForm({...filterParamsUsersForm, between: []})
  }

  
  useEffect(() => {
    // if(showUsersFilterMdl){
    //   if(!filterParamsUsersForm.between.field_name){
    //     handleUnbetween()
    //   }
    //   const {range, field_name, field_label} = filterParamsUsersForm.between
    //   const from = range ? range.split(", ")[0].split(" ")[0] : ""
    //   const to = range ? range.split(", ")[1].split(" ")[0] : ""
    //   setDateRange({field_name, field_label, from, to})
    //   const newEqualForm = structuredClone(equalFormInit)
    //   for (const el of filterParamsUsersForm.equal) {
    //     const field_name = el.field_name as keyof typeof equalFormInit
    //     newEqualForm[field_name] = el.field_value
    //   }
    //   setEqualForm(newEqualForm)
    // }
  },[showUsersFilterMdl])
  
  return (
    <Modal 
      show={showUsersFilterMdl} 
      onHide={()=>setShowUsersFilterMdl(false)}
    >
      <Modal.Body>
        {isFetching && <LdsBar />}
        <Tabs
          activeKey={tabName}
          onSelect={(k) => setTabName(k as string)}
          className="mb-3"
        >
          <Tab eventKey="order" title="Ordenar">
            <Row>
              <Form.Group as={Col} sm={8} className="mb-3">
                <Form.Label htmlFor="f_order">Ordenar por</Form.Label>
                <Form.Select
                  id="f_order"
                  name="order"
                  value={filterParamsUsersForm.order.length ? filterParamsUsersForm.order[0].field_name : ""}
                  onChange={handleChangeOrder}
                >
                  <option value="">Ninguno</option>
                  {camposUser && camposUser.filter(el=>el.orderable).map(el=>{
                    return <option key={el.field_name} value={el.field_name}>{el.field_label}</option>
                  })}
                </Form.Select>
              </Form.Group>
              <Form.Group as={Col} sm={4} className="mb-3">
                <Form.Label htmlFor="f_order_dir">Dir</Form.Label>
                <Form.Select
                  id="f_order_dir"
                  name="order_dir"
                  value={filterParamsUsersForm.order.length ? filterParamsUsersForm.order[0].order_dir : "ASC"}
                  onChange={handleChangeOrderDir}
                >
                  <option value="ASC">Ascendente</option>
                  <option value="DESC">Descendente</option>
                </Form.Select>
              </Form.Group>

            </Row>
          </Tab>
          <Tab eventKey="equal" title="Igual a">
            <Form>
              <Form.Group as={Col} className="mb-3">
                <Form.Label htmlFor="f_rol">Rol</Form.Label>
                <Form.Select
                  id="f_rol"
                  value={equalForm.rol}
                  onChange={(e)=>{
                    filterEqual({
                      field_name:'rol',
                      field_value: e.target.value,
                      field_label: "Rol"
                    })
                  }}
                >
                  <option value="">Todos</option>
                  {roles?.map((el) => (
                    <option key={el.id} value={el.rol}>
                      {el.rol}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group as={Col} className="mb-3">
                <Form.Label htmlFor="f_caja">Caja</Form.Label>
                <Form.Select
                  id="f_caja"
                  value={equalForm.caja}
                  onChange={(e)=>{
                    filterEqual({
                      field_name:'caja',
                      field_value: e.target.value,
                      field_label: "Caja"
                    })
                  }}
                >
                  <option value="">Todos</option>
                  {cajas?.map((el) => (
                    <option key={el.id} value={el.descripcion}>
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
                  onChange={(e)=>{
                    filterEqual({
                      field_name:'estado',
                      field_value: e.target.value,
                      field_label: "Estado"
                    })
                  }}
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
                name="field_name"
                value={dateRange.field_name}
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
                  disabled={!Boolean(dateRange.field_name)}
                  type="date"
                  name="from"
                  value={dateRange.from}
                  onChange={handleChangeDate}
                />
              </Col>
              <Form.Label column sm="1">
                Al
              </Form.Label>
              <Col sm="5">
                <Form.Control
                  disabled={!Boolean(dateRange.from)}
                  type="date"
                  name="to"
                  value={dateRange.to}
                  onChange={handleChangeDate}
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
