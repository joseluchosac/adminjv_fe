import { useEffect, useRef, useState } from 'react'
import { Button, Col, Form, Modal, Row } from 'react-bootstrap'
import SelectAsync from 'react-select/async';
import { LdsBar} from '../../../core/components/Loaders'
import { FormControlElement, ResponseQuery } from '../../../core/types';
import { useMutationConfigQuery } from '../../../core/hooks/useConfigQuery';
import { Establecimiento } from '../../../core/types/catalogosTypes';
import { debounce } from '../../../core/utils/funciones';
import { filterUbigeosFetch } from '../../../core/services/ubigeosFetch';
import { filterParamsInit, selectDark } from '../../../core/utils/constants';
import useSessionStore from '../../../core/store/useSessionStore';
import useLayoutStore from '../../../core/store/useLayoutStore';
import { OptionsOrGroups } from 'react-select';
import { Bounce, toast } from 'react-toastify';
import Swal from 'sweetalert2';

type Props = {
  showForm: boolean;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
  currentId: number;
  setCurrentId: React.Dispatch<React.SetStateAction<number>>;
  getEstablecimientos: ()=>void;
}

interface UbigeoOption {
  value: string;
  label: string;
  dis_prov_dep: string;
}

interface DataGetEstablecimiento extends ResponseQuery {
  content: Establecimiento | null;
}

type GetEstablecimientoQuery = {
  data: DataGetEstablecimiento | null;
  isPending: boolean;
  getEstablecimiento: (id:number)=>void
}

const formInit = {
  id: 0,
  codigo_establecimiento: "",
  nombre: "",
  direccion: "",
  ubigeo_inei: "",
  dis_prov_dep: "",
  telefono: "",
  email: "",
  sucursal: false,
  almacen: false,
  estado: 1,
}

export default function EstablecimientoForm({showForm, setShowForm, currentId, setCurrentId, getEstablecimientos}: Props) {
  const [form, setForm] = useState<Establecimiento>(formInit)
  const tknSession = useSessionStore(state => state.tknSession)
  const darkMode = useLayoutStore(state => state.layout.darkMode)

  const {
    data: establecimiento,
    isPending: isPendingEstablecimiento,
    getEstablecimiento
  }: GetEstablecimientoQuery = useMutationConfigQuery()

  const {
    data: mutation,
    isPending: isPendingMutation,
    createEstablecimiento,
    updateEstablecimiento,
  } = useMutationConfigQuery()

  const abortController = useRef<AbortController | null>(null);
  
  const loadOptions =  debounce((search: string, callback: (options: OptionsOrGroups<UbigeoOption, any>)=>void) => {
    abortController.current?.abort(); // ✅ Cancela la petición anterior
    abortController.current = new AbortController();
    const filtered = {...filterParamsInit, search}
    filterUbigeosFetch({
      filterParamsUbigeos: filtered, 
      pageParam:1, 
      token: tknSession, 
      signal: abortController.current.signal
    }).then(data=>{
      callback(data.filas.map(el=>{
        const {ubigeo_inei, dis_prov_dep} = el
        return {
          value: ubigeo_inei,
          label: dis_prov_dep,
          dis_prov_dep,
        }})
      )
    })
  },500)

  const handleChange = (e: React.ChangeEvent<FormControlElement>) => {
    setForm({...form, [e.target.name]: e.target.value})
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault()
    Swal.fire({
      icon: 'question',
      text: form.id
        ? `¿Desea guardar los cambios?`
        : `¿Desea registrar a ${form.nombre}?`,
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: 'Cancelar',
      customClass: {popup: darkMode ? 'swal-dark' : ''}
    }).then((result) => {
      if (result.isConfirmed) {
        if (form.id){
          updateEstablecimiento(form)
        }else{
          createEstablecimiento(form)
        }
      }
    });
  }

  useEffect(()=>{
    if(!showForm){
      setForm(formInit)
      setCurrentId(0)
    }
  },[showForm])

  useEffect(()=>{
    if(currentId){
      getEstablecimiento(currentId)
    }
  },[currentId])

  useEffect(()=>{
    if(!establecimiento) return
    if(!establecimiento.error && establecimiento.content){
      setForm(establecimiento.content)
    }else{
      console.log(establecimiento.msg)
    }
  },[establecimiento])

  useEffect(()=>{
    if(!mutation) return
    if(!mutation.error) setShowForm(false);
    toast(mutation.msg, {
      type: mutation.msgType, autoClose: 3000, transition: Bounce,
    })
    getEstablecimientos()
  },[mutation])

  return (
    <Modal show={showForm} onHide={()=>setShowForm(false)} backdrop="static" size="md" >
      <Modal.Header closeButton className="py-2">
        <Modal.Title>{currentId ? "Editar establecimiento" : "Nuevo establecimiento"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {isPendingEstablecimiento && <LdsBar />}
          <Row>
            <Form.Group as={Col} md={12} className="mb-3">
              <Form.Label htmlFor="codigo_establecimiento">Código</Form.Label>
              <Form.Control
                id="codigo_establecimiento"
                name="codigo_establecimiento"
                value={form.codigo_establecimiento ? form.codigo_establecimiento : ""}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group as={Col} md={12} className="mb-3">
              <Form.Label htmlFor="nombre">Nombre</Form.Label>
              <Form.Control
                id="nombre"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group as={Col} md={12} className="mb-3">
              <Form.Label htmlFor="direccion">Dirección</Form.Label>
              <Form.Control
                id="direccion"
                name="direccion"
                value={form.direccion}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group as={Col} md={12} className="mb-3">
              <Form.Label htmlFor="ubigeo_inei">Distrito, Provincia, Departamento</Form.Label>
              <div title={form.dis_prov_dep}>
                <SelectAsync
                  loadOptions={loadOptions}
                  defaultOptions
                  styles={darkMode ? selectDark : undefined}
                  isClearable
                  value={{
                    value:form.ubigeo_inei,
                    label:form.ubigeo_inei ? form.dis_prov_dep : "",
                    dis_prov_dep: form.dis_prov_dep,
                  }}
                  onChange={(option)=>{
                    if(!option){
                      setForm({...form, ubigeo_inei: "", dis_prov_dep:""})
                    }else{
                      const {value, dis_prov_dep} = option
                      setForm({...form, ubigeo_inei: value, dis_prov_dep})
                    }
                  }}
                />
              </div>
            </Form.Group>
            <Form.Group as={Col} md={12} className="mb-3">
              <Form.Label htmlFor="telefono">Teléfono</Form.Label>
              <Form.Control
                id="telefono"
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group as={Col} md={12} className="mb-3">
              <Form.Label htmlFor="email">Email</Form.Label>
              <Form.Control
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
              />
            </Form.Group>
          </Row>
          <div className="d-flex gap-2 justify-content-end">
            <Button
              // onClick={() => resetForm()}
              variant="seccondary"
              type="button"
              // hidden={currentLaboratorioId ? true : false}
            >Reset</Button>
            <Button
              variant="seccondary"
              type="button"
              onClick={()=>setShowForm(false)}
            >Cerrar</Button>
            <Button 
              variant="primary" 
              type="submit"
              // disabled={isPendingMutate ? true : false}
            >
              Guardar
            </Button>
          </div>
        </Form>
      </Modal.Body>
      {/* {isPendingGetLaboratorio && <LdsEllipsisCenter/>} */}
    </Modal>
  )
}

