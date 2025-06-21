import { useEffect, useRef } from "react";
import Modal from "react-bootstrap/Modal";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { Controller, useForm } from "react-hook-form";
import { useSucursales } from "./context/SucursalesContext";
import { ResponseQuery } from "../../../core/types";
import { Sucursal } from "../../../core/types/catalogosTypes";
import useLayoutStore from "../../../core/store/useLayoutStore";
import { useMutationSucursalesQuery } from "../../../core/hooks/useSucursalesQuery";
import { LdsBar, LdsEllipsisCenter } from "../../../core/components/Loaders";
import SelectAsync from "react-select/async"
import { debounce } from "../../../core/utils/funciones";
import { filterParamsInit, selectDark } from "../../../core/utils/constants";
import { filterUbigeosFetch } from "../../../core/services/ubigeosFetch";
import useSessionStore from "../../../core/store/useSessionStore";

interface DataGetSucursal extends ResponseQuery {
  content: Sucursal | null;
}
type GetSucursalQuery = {
  data: DataGetSucursal | null ;
  isPending: boolean;
  isError: boolean;
  getSucursal: (id: number) => void
}

const sucursalFormInit = {
  id: 0,
  codigo: "",
  descripcion: "",
  direccion: "",
  ubigeo_inei: "",
  dis_prov_dep: "",
  telefono: "",
  email: "",
  estado: 1,
}

export default function SucursalForm() {
  const {showSucursalForm, setShowSucursalForm, currentSucursalId} = useSucursales()
  const darkMode = useLayoutStore(state => state.layout.darkMode)
  const tknSession = useSessionStore(state => state.tknSession)
  const abortUbigeos = useRef<AbortController | null>(null);

  const {
    data: sucursal,
    isPending: isPendingSucursal,
    isError: isErrorSucursal,
    getSucursal,
  }: GetSucursalQuery = useMutationSucursalesQuery()

  const {
    data: mutation,
    isPending: isPendingMutation,
    isError: isErrorMutation,
    createSucursal, 
    updateSucursal,
    typeAction,
  } = useMutationSucursalesQuery()

  const {
    register, 
    formState: {errors, isDirty},
    getValues,
    setValue,
    handleSubmit,
    control,
    reset,
    clearErrors,
  } = useForm<Sucursal>({defaultValues: sucursalFormInit})


  const loadUbigeosOptions =  debounce((search: string, callback: any) => {
    abortUbigeos.current?.abort(); // ✅ Cancela la petición anterior
    abortUbigeos.current = new AbortController();
    const filtered = {...filterParamsInit, search}
    filterUbigeosFetch({filterParamsUbigeos: filtered, pageParam:1, token: tknSession, signal: abortUbigeos.current.signal })
    .then(data=>{
      callback(data.filas.map(el=>({value: el.ubigeo_inei, label: el.dis_prov_dep})))
    })
  },500)


  const submit = (sucursal: Sucursal) => {
    Swal.fire({
      icon: 'question',
      text: sucursal.id
        ? `¿Desea guardar los cambios?`
        : `¿Desea registrar a ${sucursal.descripcion}?`,
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: 'Cancelar',
      target: document.getElementById('sucursal_form'),
      customClass: {popup: darkMode ? 'swal-dark' : ''}
    }).then((result) => {
      if (result.isConfirmed) {
        if (sucursal.id){
          updateSucursal(sucursal)
        }else{
          createSucursal(sucursal)
        }
      }
    });
  };

  useEffect(() => {
    if(showSucursalForm){
      if(currentSucursalId) getSucursal(currentSucursalId)
    }else{
      reset(sucursalFormInit)
    }
  }, [showSucursalForm])

  useEffect(() => {
    if(!sucursal) return
    if(sucursal.error){
      toast(sucursal.msg, {type: sucursal.msgType})
      setShowSucursalForm(false);
    }else{
      if(sucursal.content) reset(sucursal?.content)
    }
  }, [sucursal])
  
  useEffect(() => {
    if(!mutation) return
    if(typeAction==="mutate_sucursal"){
      if(!mutation.error) setShowSucursalForm(false);
      toast(mutation.msg, {type: mutation.msgType})
    }
  }, [mutation])

  useEffect(() => {
    if(!isErrorSucursal) return
    toast.error("Error al obtener datos")
    setShowSucursalForm(false)
  }, [isErrorSucursal])

  useEffect(() => {
    if(!isErrorMutation) return
    toast.error("Error al procesar solicitud")
  }, [isErrorMutation])


  return (
    <div>
      <Modal show={showSucursalForm} onHide={()=>setShowSucursalForm(false)} backdrop="static" size="md" >
        <Modal.Header closeButton className="py-2">
          <Modal.Title>{currentSucursalId ? "Editar sucursal" : "Nueva sucursal"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(submit)} id="sucursal_form">
            {(isPendingMutation && typeAction==="mutate_sucursal") && <LdsBar />}
            <Row>
              <Form.Group as={Col} md={3} className="mb-3">
                <Form.Label htmlFor="codigo">Código</Form.Label>
                <Form.Control
                  id="codigo"
                  {...register('codigo', {
                    required:"Ingrese el código",
                  })}
                />
                {errors.codigo && 
                  <div className="invalid-feedback d-block">{errors.codigo.message}</div>
                }
              </Form.Group>
              <Form.Group as={Col} md={9} className="mb-3">
                <Form.Label htmlFor="descripcion">Descripción</Form.Label>
                <Form.Control
                  id="descripcion"
                  {...register('descripcion', {
                    required:"Ingrese la descripción",
                  })}
                />
                {errors.descripcion && 
                  <div className="invalid-feedback d-block">{errors.descripcion.message}</div>
                }
              </Form.Group>
              <Form.Group as={Col} md={12} className="mb-3">
                <Form.Label htmlFor="direccion">Dirección</Form.Label>
                <Form.Control
                  id="direccion"
                  {...register('direccion', {
                    required:"Ingrese la dirección",
                  })}
                />
                {errors.direccion && 
                  <div className="invalid-feedback d-block">{errors.direccion.message}</div>
                }
              </Form.Group>
              <Form.Group as={Col} md={12} className="mb-3">
                <Form.Label htmlFor="ubigeo_inei">Ubigeo</Form.Label>
                <Controller
                  name="ubigeo_inei"
                  control={control}
                  rules={{required:"Debe ingresar el ubigeo"}}
                  render={() => (
                    <SelectAsync
                      loadOptions={loadUbigeosOptions}
                      defaultOptions
                      styles={darkMode ? selectDark : undefined}
                      isClearable
                      value={{value:getValues().ubigeo_inei, label:getValues().dis_prov_dep}}
                      onChange={(selectedOpt) => {
                        setValue("ubigeo_inei", selectedOpt?.value ? selectedOpt?.value : '', {shouldDirty: true})
                        setValue("dis_prov_dep", selectedOpt?.label || "")
                        if(selectedOpt) clearErrors("ubigeo_inei")
                      }}
                    />
                  )}
                />
                {errors.ubigeo_inei && 
                  <div className="invalid-feedback d-block">{errors.ubigeo_inei.message}</div>
                }
              </Form.Group>
              <Form.Group as={Col} md={6} className="mb-3">
                <Form.Label htmlFor="telefono">Teléfono</Form.Label>
                <Form.Control
                  id="telefono"
                  {...register('telefono')}
                />
              </Form.Group>
              <Form.Group as={Col} md={6} className="mb-3">
                <Form.Label htmlFor="email">Correo</Form.Label>
                <Form.Control
                  id="email"
                  {...register('email')}
                />
              </Form.Group>
            </Row>
            <div className="d-flex gap-2 justify-content-end">
              <Button
                onClick={() => reset(sucursalFormInit)}
                variant="seccondary"
                type="button"
                hidden={currentSucursalId ? true : false}
              >Reset</Button>
              <Button
                variant="seccondary"
                type="button"
                onClick={()=>setShowSucursalForm(false)}
              >Cerrar</Button>
              <Button 
                variant="primary" 
                type="submit"
                disabled={(isPendingMutation && typeAction==="mutate_sucursal") ? true : isDirty ? false : true}
              >
                {(isPendingMutation && typeAction==="mutate_sucursal") &&
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                }
                Guardar
              </Button>
            </div>
          </Form>
        </Modal.Body>
        {isPendingSucursal  && <LdsEllipsisCenter/>}
      </Modal>
    </div>
  );
}

