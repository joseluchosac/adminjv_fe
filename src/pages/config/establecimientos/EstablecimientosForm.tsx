const apiURL = import.meta.env.VITE_API_URL;
import { useEffect, useRef } from "react";
import Modal from "react-bootstrap/Modal";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { Controller, useForm } from "react-hook-form";
import { useEstablecimientos } from "./context/EstablecimientosContext";
import { Establecimiento, QueryResp, UbigeoItem } from "../../../core/types";
import useLayoutStore from "../../../core/store/useLayoutStore";
import { useMutationEstablecimientosQuery } from "../../../core/hooks/useEstablecimientosQuery";
import { LdsBar, LdsEllipsisCenter } from "../../../core/components/Loaders";
import SelectAsync from "react-select/async"
import { debounce } from "../../../core/utils/funciones";
import { filterParamsInit, selectDark } from "../../../core/utils/constants";
import useSessionStore from "../../../core/store/useSessionStore";
import { fnFetch } from "../../../core/services/fnFetch";
import { useQueryClient } from "@tanstack/react-query";
import { useTiposEstablecimientoQuery } from "../../../core/hooks/useCatalogosQuery";

interface EstablecimientoQryRes extends QueryResp {
  content: Establecimiento | null;
}
type GetEstablecimientoQuery = {
  data: EstablecimientoQryRes | null ;
  isPending: boolean;
  isError: boolean;
  getEstablecimiento: (id: number) => void
}

const establecimientoFormInit = {
  id: 0,
  codigo: "",
  tipo: "",
  descripcion: "",
  direccion: "",
  ubigeo_inei: "",
  dis_prov_dep: "",
  telefono: "",
  email: "",
  estado: 1,
}

export default function EstablecimientoForm() {
  const {showEstablecimientoForm, setShowEstablecimientoForm, currentEstablecimientoId} = useEstablecimientos()
  const darkMode = useLayoutStore(state => state.layout.darkMode)
  const tknSession = useSessionStore(state => state.tknSession)
  const {tiposEstablecimiento} = useTiposEstablecimientoQuery()
  const queryClient = useQueryClient()
  const abortUbigeos = useRef<AbortController | null>(null);

  const {
    data: establecimiento,
    isPending: isPendingEstablecimiento,
    isError: isErrorEstablecimiento,
    getEstablecimiento,
  }: GetEstablecimientoQuery = useMutationEstablecimientosQuery()

  const {
    data: mutation,
    isPending: isPendingMutation,
    isError: isErrorMutation,
    createEstablecimiento, 
    updateEstablecimiento,
  } = useMutationEstablecimientosQuery()

  const {
    register, 
    formState: {errors, isDirty},
    getValues,
    setValue,
    handleSubmit,
    control,
    reset,
    clearErrors,
  } = useForm<Establecimiento>({defaultValues: establecimientoFormInit})


  const loadUbigeosOptions =  debounce((search: string, callback: any) => {
    abortUbigeos.current?.abort(); // ✅ Cancela la petición anterior
    abortUbigeos.current = new AbortController();
    const filtered = {...filterParamsInit, search}
    fnFetch({
      method: "POST",
      url: `${apiURL}ubigeos/filter_ubigeos?page=1`,
      body: JSON.stringify(filtered),
      signal: abortUbigeos.current.signal,
      authorization: "Bearer " + tknSession
    }).then((data) => {
      callback(data.filas.map((el: UbigeoItem)=>({value: el.ubigeo_inei, label: el.dis_prov_dep})))
    });
  },500)


  const submit = (establecimiento: Establecimiento) => {
    Swal.fire({
      icon: 'question',
      text: establecimiento.id
        ? `¿Desea guardar los cambios?`
        : `¿Desea registrar a ${establecimiento.descripcion}?`,
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: 'Cancelar',
      target: document.getElementById('establecimiento_form'),
      customClass: {popup: darkMode ? 'swal-dark' : ''}
    }).then((result) => {
      if (result.isConfirmed) {
        if (establecimiento.id){
          updateEstablecimiento(establecimiento)
        }else{
          createEstablecimiento(establecimiento)
        }
      }
    });
  };

  useEffect(() => {
    if(showEstablecimientoForm){
      if(currentEstablecimientoId) getEstablecimiento(currentEstablecimientoId)
    }else{
      reset(establecimientoFormInit)
    }
  }, [showEstablecimientoForm])

  useEffect(() => {
    if(!establecimiento) return
    if(establecimiento.error){
      toast(establecimiento.msg, {type: establecimiento.msgType})
      setShowEstablecimientoForm(false);
    }else{
      if(establecimiento.content) reset(establecimiento?.content)
    }
  }, [establecimiento])
  
  useEffect(() => {
    if(!mutation) return
    toast(mutation.msg, {type: mutation.msgType})
    if(mutation.content){
      queryClient.invalidateQueries({queryKey:['establecimientos']})
    }
    if(!mutation.error) setShowEstablecimientoForm(false);
  }, [mutation])

  useEffect(() => {
    if(!isErrorEstablecimiento) return
    toast.error("Error al obtener datos")
    setShowEstablecimientoForm(false)
  }, [isErrorEstablecimiento])

  useEffect(() => {
    if(!isErrorMutation) return
    toast.error("Error al procesar solicitud")
  }, [isErrorMutation])


  return (
    <div>
      <Modal show={showEstablecimientoForm} onHide={()=>setShowEstablecimientoForm(false)} backdrop="static" size="md" >
        <Modal.Header closeButton className="py-2">
          <Modal.Title>{currentEstablecimientoId ? "Editar establecimiento" : "Nueva establecimiento"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(submit)} id="establecimiento_form">
            {(isPendingMutation) && <LdsBar />}
            <Row>
              <Form.Group as={Col} md={4} className="mb-3">
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
              <Form.Group as={Col} md={8} className="mb-3">
                <Form.Label htmlFor="tipo">Tipo</Form.Label>
                <Form.Select
                  id="tipo"
                  {...register('tipo', {
                    required:"Ingrese el código",
                  })}
                >
                  {tiposEstablecimiento?.map(el=><option key={el}>{el}</option>)}
                </Form.Select>
                {errors.tipo && 
                  <div className="invalid-feedback d-block">{errors.tipo.message}</div>
                }
              </Form.Group>
              <Form.Group as={Col} md={12} className="mb-3">
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
                onClick={() => reset(establecimientoFormInit)}
                variant="seccondary"
                type="button"
                hidden={currentEstablecimientoId ? true : false}
              >Reset</Button>
              <Button
                variant="seccondary"
                type="button"
                onClick={()=>setShowEstablecimientoForm(false)}
              >Cerrar</Button>
              <Button 
                variant="primary" 
                type="submit"
                disabled={(isPendingMutation) ? true : isDirty ? false : true}
              >
                {(isPendingMutation) &&
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
        {isPendingEstablecimiento  && <LdsEllipsisCenter/>}
      </Modal>
    </div>
  );
}

