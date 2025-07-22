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
import { CampoTable } from "../../../core/types";
import { useProductos } from "../context/ProductosContext";
import { filterParamsInit } from "../../../core/utils/constants";
import { LdsBar } from "../../../core/components/Loaders";
import { useCajasQuery } from "../../../core/hooks/useCatalogosQuery";
import { useRolesQuery } from "../../../core/hooks/useRolesQuery";


const dateRangeInit = { field_name: "", field_label: "", date_from: "", date_to: "" };
const equalFormInit = { rol_id: "", caja_id: "", estado: ""}
type Props = {
  isFetching: boolean;
  camposProducto: CampoTable[]
}

const ProductosLstFilterMdl: React.FC<Props> = ({isFetching, camposProducto}) => {
  const [tabName, setTabName] = useState("order")
  const [dateRange, setDateRange] = useState(dateRangeInit);
  const [rangeName, setRangeName] = useState("")
  const [equalForm, setEqualForm] = useState(equalFormInit)

  const {
    filterParamsProductosForm,
    setFilterParamsProductosForm,
    showProductosFilterMdl,
    setShowProductosFilterMdl
  } = useProductos()

  const {roles} = useRolesQuery()
  const {cajas} = useCajasQuery()
  
  const handleChangeOrder = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const field_name = e.target.value
    const field_label = e.currentTarget.options[e.currentTarget.selectedIndex].textContent || ""
    const newOrders = field_name ? [{field_name, order_dir: "ASC", field_label}] : []
    setFilterParamsProductosForm({...filterParamsProductosForm, orders: newOrders})
  }

  const handleChangeOrderDir = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const order_dir = e.target.value
    const newOrders = [{...filterParamsProductosForm.orders[0], order_dir}]
    setFilterParamsProductosForm({...filterParamsProductosForm, orders: newOrders})
  }

  const handleChangeEqual = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const label_name = e.currentTarget.previousElementSibling?.textContent || ""
    const { name: field_name, value: field_value } = e.currentTarget;
    const label_value = e.currentTarget.options[e.currentTarget.selectedIndex].textContent || ""
    setEqualForm({...equalForm, [field_name]:field_value})
    let { equals } = filterParamsProductosForm;
    const idx = equals.findIndex(el => el.field_name === field_name)
    if(!field_value){
      equals = equals.filter(el => el.field_name !== field_name)
    }else{
      if(idx === -1){
        equals = [ ...equals, {field_name, field_value, label_name, label_value} ]
      }else{
        equals[idx] = {field_name, field_value, label_name, label_value}
      }
    }
    setFilterParamsProductosForm({ ...filterParamsProductosForm, equals: [...equals] });
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
    setDateRange({ ...dateRange, date_from: startFormatDate, date_to: endFormatDate });
    if(range_name){
      setRangeName(range_name)
    }
  };

  const handleFilterBetween = () => {
    if(!dateRange.field_name || !dateRange.date_from || !dateRange.date_to) return
    const newBetween = {
      field_name: dateRange.field_name,
      field_label: dateRange.field_label,
      range:
        (dateRange.date_from ? dateRange.date_from + " 00:00:00, " : "") +
        (dateRange.date_to ? dateRange.date_to + " 23:59:59" : ""),
    };
    if (
      filterParamsProductosForm.between.field_name == newBetween.field_name &&
      filterParamsProductosForm.between.range == newBetween.range
    ) return;
    setFilterParamsProductosForm({ ...filterParamsProductosForm, between: newBetween });
  };

  const handleUnbetween = () => {
    setDateRange(dateRangeInit);
    setRangeName("")
    if(!filterParamsProductosForm.between.field_name) return
    setFilterParamsProductosForm({...filterParamsProductosForm, between: filterParamsInit.between})
    
  }

  
  useEffect(() => {
    if(showProductosFilterMdl){
      if(!filterParamsProductosForm.between.field_name){
        handleUnbetween()
      }
      const {range, field_name, field_label} = filterParamsProductosForm.between
      const date_from = range ? range.split(", ")[0].split(" ")[0] : ""
      const date_to = range ? range.split(", ")[1].split(" ")[0] : ""
      setDateRange({field_name, field_label, date_from, date_to})
      const newEqualForm = structuredClone(equalFormInit)
      for (const el of filterParamsProductosForm.equals) {
        const field_name = el.field_name as keyof typeof equalFormInit
        newEqualForm[field_name] = el.field_value
      }
      setEqualForm(newEqualForm)
    }
  },[showProductosFilterMdl])
  
  return (
    <Modal 
      show={showProductosFilterMdl} 
      onHide={()=>setShowProductosFilterMdl(false)}
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
                  value={filterParamsProductosForm.orders.length ? filterParamsProductosForm.orders[0].field_name : ""}
                  onChange={handleChangeOrder}
                >
                  <option value="">Ninguno</option>
                  {camposProducto && camposProducto.filter(el=>el.orderable).map(el=>{
                    return <option key={el.field_name} value={el.field_name}>{el.field_label}</option>
                  })}
                </Form.Select>
              </Form.Group>
              <Form.Group as={Col} sm={4} className="mb-3">
                <Form.Label htmlFor="f_order_dir">Dir</Form.Label>
                <Form.Select
                  id="f_order_dir"
                  name="order_dir"
                  value={filterParamsProductosForm.orders.length ? filterParamsProductosForm.orders[0].order_dir : "ASC"}
                  onChange={handleChangeOrderDir}
                >
                  <option value="ASC">Ascendente</option>
                  <option value="DESC">Descendente</option>
                </Form.Select>
              </Form.Group>

            </Row>
          </Tab>
          <Tab eventKey="equals" title="Igual a">
            <Form>
              <Form.Group as={Col} className="mb-3">
                <Form.Label htmlFor="f_rol_id">Rol</Form.Label>
                <Form.Select
                  id="f_rol_id"
                  name="rol_id"
                  value={equalForm.rol_id}
                  onChange={handleChangeEqual}
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
                  onChange={handleChangeEqual}
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
                  onChange={handleChangeEqual}
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
                  name="date_from"
                  value={dateRange.date_from}
                  onChange={handleChangeDate}
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

export default ProductosLstFilterMdl;
