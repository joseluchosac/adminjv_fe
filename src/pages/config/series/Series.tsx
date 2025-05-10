import { useEffect, useState } from "react"
import { useMutationConfiguracionesQuery } from "../../../core/hooks/useConfiguracionesQuery"
import { Button, Card, Col, Form, InputGroup, ListGroup, Row, Table } from "react-bootstrap"
import { Establecimiento, SerieEstablecimiento } from "../../../core/types/catalogosTypes"
import { FaSave, FaUndo } from "react-icons/fa";

interface DataEstablecimientos {
  data: Establecimiento[] | null;
  getEstablecimientos: () => void
}
interface DataSeriesEstablecimiento {
  data: SerieEstablecimiento[] | null;
  getSeriesEstablecimiento: (x: number) => void
}

export default function Series() {
  const [activeEstablecimiento, setActiveEstablecimiento] = useState(0)
  const [seriesEstablecimientoLst, setSeriesEstablecimientoLst] = useState<SerieEstablecimiento[] | null>(null)
  const [hasEdited, setHasEdited] = useState(false)
  const {
    data: data_getEstablecimientos, 
    getEstablecimientos
  }: DataEstablecimientos  = useMutationConfiguracionesQuery()

  const {
    data: data_getSeriesEstablecimiento, 
    getSeriesEstablecimiento
  }: DataSeriesEstablecimiento = useMutationConfiguracionesQuery()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {idx, prefix} = e.currentTarget.dataset
    const {name, value} = e.currentTarget
    const longitudSerie = Number(prefix?.length) + value.length
    if(longitudSerie > 4 && name === "serie_suffix") return
    if(value.length > 8 && name === "correlativo") return
    if(!seriesEstablecimientoLst) return
    seriesEstablecimientoLst[Number(idx)][name as "serie_suffix" | "correlativo"] = value as string
    setSeriesEstablecimientoLst([...seriesEstablecimientoLst])
    setHasEdited(true)
  }

  const handleReset = () => {
    getSeriesEstablecimiento(activeEstablecimiento)
  }

  const handleGuardar = () => {
    console.log(seriesEstablecimientoLst)
  }

  useEffect(() => {
    getEstablecimientos()
  }, [])
  
  useEffect(() => {
    if(!activeEstablecimiento) return
    getSeriesEstablecimiento(activeEstablecimiento)
  }, [activeEstablecimiento])

  useEffect(() => {
    if(!data_getSeriesEstablecimiento) return
    setSeriesEstablecimientoLst(data_getSeriesEstablecimiento)
    setHasEdited(false)
  }, [data_getSeriesEstablecimiento])


  return (
    <div>
      <Row>
        <Col md={3}>
          <h5>Sucursales</h5>
          <ListGroup>
            {data_getEstablecimientos && data_getEstablecimientos.filter((x)=>x.tipo === "SUCURSAL").map((el) => 
              <ListGroup.Item 
                key={el.id} 
                onClick={() => setActiveEstablecimiento(el.id)}
                action  
                active = {activeEstablecimiento === el.id ? true : false}
              >
                {el.nombre}
              </ListGroup.Item>
            )}
          </ListGroup>
          <div className="d-flex justify-content-center gap-2 mb-2 mt-4">
            <Button 
              variant="secondary" 
              size="sm"
              disabled={!hasEdited}
              onClick={handleReset}
            ><FaUndo /> Reset</Button>
            <Button 
              variant="success" 
              size="sm"
              disabled={!hasEdited}
              onClick={handleGuardar}
            ><FaSave /> Guardar</Button>
          </div>
        </Col>
        <Col md={9}>
          <Card>
            <Card.Body>
              <div className="table-responsive">
                <Table>
                  <thead>
                    <tr>
                      <th>Comprobante</th>
                      <th>Serie</th>
                      <th>Correlativo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {seriesEstablecimientoLst && seriesEstablecimientoLst.map((el, idx)=>(
                      <tr key={el.id}>
                        <td style={{verticalAlign:"middle"}}>{el.descripcion}</td>
                        <td className="text-center text-nowrap">
                          <div style={{width: "105px"}}>
                            <InputGroup>
                              <InputGroup.Text>{el.serie_prefix}</InputGroup.Text>
                              <Form.Control
                                type="number"
                                data-idx={idx}
                                data-prefix={el.serie_prefix}
                                name="serie_suffix"
                                value={el.serie_suffix}
                                onChange={handleChange}
                                disabled={false}
                              />
                            </InputGroup>
                          </div>
                        </td>
                        <td>
                          <div style={{width: "120px"}}>
                            <InputGroup>
                              <Form.Control
                              className="text-center"
                                type="number"
                                data-idx={idx}
                                data-prefix={el.serie_prefix}
                                name="correlativo"
                                value={el.correlativo}
                                onChange={handleChange}
                                disabled={false}
                              />
                            </InputGroup>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
