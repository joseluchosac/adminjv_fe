import { useRef } from 'react';
import { Card, Col, Form, Row } from 'react-bootstrap';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { CommonPeriod} from '../../../app/types';
import { commonPeriods } from '../../../app/utils/constants';
import { LdsBar } from '../../../app/components/Loaders';
import useMovimientosStore from '../../../app/store/useMovimientosStore';

type Props = {isFetching: boolean;}

export function MovimientosFilter({isFetching}: Props) {
  const movimientoFilterForm = useMovimientosStore(state => state.movimientoFilterForm)
  const showMovimientosFilter = useMovimientosStore(state => state.showMovimientosFilter)
  const camposMovimiento = useMovimientosStore(state => state.camposMovimiento)
  const setMovimientoFilterFormSort = useMovimientosStore(state => state.setMovimientoFilterFormSort)
  const setMovimientoFilterFormBetweenField = useMovimientosStore(state => state.setMovimientoFilterFormBetweenField)
  const setMovimientoFilterFormBetweenPeriod = useMovimientosStore(state => state.setMovimientoFilterFormBetweenPeriod)
  const setMovimientoFilterFormBetweenDate = useMovimientosStore(state => state.setMovimientoFilterFormBetweenDate)
  const setShowMovimientoFilter = useMovimientosStore(state => state.setShowMovimientoFilter)
  const orderRef = useRef<HTMLSelectElement | null>(null)
  const orderDirRef = useRef<HTMLSelectElement | null>(null)
  


  const sort = () => {
    const field_name = orderRef.current?.value || ""
    const field_label = orderRef.current?.options[orderRef.current?.selectedIndex].textContent || ""
    const order_dir = orderDirRef.current?.value as "ASC" | "DESC"
    setMovimientoFilterFormSort({field_name, field_label, order_dir})
  }


  const handleFilterBetweenField = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const field_name = e.currentTarget.value;
    const field_label = e.currentTarget.options[e.currentTarget.selectedIndex].textContent || ""
    setMovimientoFilterFormBetweenField({ field_name, field_label })
  };

  const filterBetweenPeriod = (periodKey: CommonPeriod["key"]) => {
    setMovimientoFilterFormBetweenPeriod({ periodKey })
  }

  const handleFilterBetweenDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setMovimientoFilterFormBetweenDate({ name, value })
  };

  const handleOnHide = () => {
    setShowMovimientoFilter(false)
  }

  return (
    <Offcanvas show={showMovimientosFilter} placement='end' onHide={handleOnHide}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Filtros de usuarios</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {isFetching && <LdsBar />}
        <Card className="mb-4">
          <Card.Header>
            Orden
          </Card.Header>
          <Card.Body>
            <Row>
              <Form.Group as={Col} sm={8} className="mb-3">
                <Form.Label htmlFor="f_order">Ordenar por</Form.Label>
                <Form.Select
                  ref={orderRef}
                  id="f_order"
                  name="order"
                  value={movimientoFilterForm.order.length ? movimientoFilterForm.order[0].field_name : ""}
                  onChange={()=> sort()}
                >
                  <option value="">Ninguno</option>
                  {camposMovimiento && camposMovimiento.filter(el=>el.orderable).map(el=>{
                    return <option key={el.field_name} value={el.field_name}>{el.field_label}</option>
                  })}
                </Form.Select>
              </Form.Group>
              <Form.Group as={Col} sm={4} className="mb-3">
                <Form.Label htmlFor="f_order_dir">Dir</Form.Label>
                <Form.Select
                  ref={orderDirRef}
                  disabled={!Boolean(movimientoFilterForm.order.length)}
                  id="f_order_dir"
                  name="order_dir"
                  value={movimientoFilterForm.order.length ? movimientoFilterForm.order[0].order_dir : "ASC"}
                  onChange={()=> sort()}
                >
                  <option value="ASC">Ascendente</option>
                  <option value="DESC">Descendente</option>
                </Form.Select>
              </Form.Group>
            </Row>
          </Card.Body>
        </Card>
        <Card className="mb-4">
          <Card.Header>Rango</Card.Header>
          <Card.Body>
            <Form.Group as={Row} className="mb-3">
              <Col sm={6} className="mb-3">
                <Form.Label htmlFor="f_entre">Campo</Form.Label>
                <Form.Select
                  id="f_entre"
                  name="field_name"
                  value={movimientoFilterForm.between[0]?.field_name || ""}
                  onChange={handleFilterBetweenField}
                >
                  <option value="">Ninguno</option>
                  <option value="created_at">F. Creación</option>
                  <option value="updated_at">F. Actualización</option>
                </Form.Select>
              </Col>
              <Col sm={6} className="mb-3">
                <Form.Label htmlFor="periodos">Periodos</Form.Label>
                <Form.Select
                  id="periodos"
                  name="periodos"
                  disabled={!Boolean(movimientoFilterForm.between[0]?.field_name)}
                  value={movimientoFilterForm.between[0]?.betweenName || ""}
                  onChange={(e) => {
                    filterBetweenPeriod(e.target.value as CommonPeriod["key"])                    
                  }}
                >
                  <option value="">Personalizado</option>
                  {commonPeriods.map(el=>(
                    <option key={el.key} value={el.key}>{el.text}</option>
                  ))}
                </Form.Select>
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Col sm="6">
                <Form.Label htmlFor="from">
                  Del
                </Form.Label>
                <Form.Control
                  disabled={!Boolean(movimientoFilterForm.between[0]?.field_name) || Boolean(movimientoFilterForm.between[0]?.betweenName)}
                  type="date"
                  name="from"
                  id="from"
                  value={movimientoFilterForm.between[0]?.from.split(" ")[0] || ""}
                  onChange={handleFilterBetweenDate}
                />
              </Col>
              <Col sm="6">
                <Form.Label htmlFor="to">
                  Al
                </Form.Label>
                <Form.Control
                  disabled={!Boolean(movimientoFilterForm.between[0]?.field_name) || Boolean(movimientoFilterForm.between[0]?.betweenName)}
                  type="date"
                  name="to"
                  id="to"
                  value={movimientoFilterForm.between[0]?.to.split(" ")[0] || ""}
                  onChange={handleFilterBetweenDate}
                />
              </Col>
            </Form.Group>
          </Card.Body>
        </Card>
      </Offcanvas.Body>
    </Offcanvas>
  );
}