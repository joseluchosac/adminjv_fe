const apiURL = import.meta.env.VITE_API_URL;
import Modal from "react-bootstrap/Modal";
import {
  Badge,
  Button,
  Col,
  Form,
  InputGroup,
  Row,
  Spinner,
} from "react-bootstrap";
import { useEffect, useMemo, useRef } from "react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { Controller, useForm } from "react-hook-form";
import { FaSearch } from "react-icons/fa";
import SelectAsync from "react-select/async";
import {
  clienteFormInit,
  filterParamInit,
  selectDark,
} from "../../app/utils/constants";
import {
  Cliente,
  QueryDocumentResp,
  ApiResp,
  UbigeoItem,
} from "../../app/types";
import useLayoutStore from "../../app/store/useLayoutStore";
import { useMutationClientesQuery } from "../../api/queries/useClientesQuery";
import { LdsBar, LdsEllipsisCenter } from "../../app/components/Loaders";
import { cropText, debounce } from "../../app/utils/funciones";
import useSessionStore from "../../app/store/useSessionStore";
import { useTiposDocumentoQuery } from "../../api/queries/useCatalogosQuery";
import { fnFetch } from "../../api/fnFetch";
import { useLocation, useNavigate } from "react-router-dom";

type ClienteRes = Cliente | ApiResp
export function isErrClienteRes(response: ClienteRes): response is ApiResp {
  return ('error' in response || (response as ApiResp).error == true);
}

type MutationRes = ApiResp & {
  cliente?: Cliente
};

type Props = {
  onMutation?: (cliente: Cliente | undefined)=>void;
}

export default function ClienteForm({onMutation}:Props) {
  const navigate = useNavigate()
  const location = useLocation()
  const darkMode = useLayoutStore((state) => state.layout.darkMode);
  const {tiposDocumento} = useTiposDocumentoQuery()
  const abortUbigeos = useRef<AbortController | null>(null);
  const token = useSessionStore((state) => state.tknSession);
  const {
    data: clienteRes,
    isPending: isPendingCliente,
    isError: isErrorCliente,
    getCliente,
  } = useMutationClientesQuery<ClienteRes>();

  const {
    data: mutationRes,
    isPending: isPendingMutation,
    createCliente,
    updateCliente,
  } = useMutationClientesQuery<MutationRes>();

  const {
    data: queryDocumentResp,
    isPending: isPendingQueryDocument,
    reset: resetQueryDocument,
    queryDocument,
  } = useMutationClientesQuery<QueryDocumentResp>();

  const {
    register,
    formState: { errors, isDirty },
    handleSubmit,
    reset,
    getValues,
    setValue,
    control,
    clearErrors,
    watch,
  } = useForm<Cliente>({ defaultValues: clienteFormInit });

  const id = useMemo(() => {
    const params = new URLSearchParams(location.search)
    return params.get('edit')
  }, [location]);

  const docum = useMemo(() => {
    if(queryDocumentResp && "nro_documento" in queryDocumentResp){
      return queryDocumentResp
    }
  },[queryDocumentResp])

  const loadUbigeosOptions = debounce((search: string, callback: any) => {
    abortUbigeos.current?.abort(); // ✅ Cancela la petición anterior
    abortUbigeos.current = new AbortController();
    const filtered = { ...filterParamInit, search };
    fnFetch({
      method: "POST",
      url: `${apiURL}ubigeos/filter_ubigeos?page=1`,
      body: JSON.stringify(filtered),
      signal: abortUbigeos.current.signal,
      authorization: "Bearer " + token
    }).then((data) => {
      callback(
        data.filas.map((el: UbigeoItem) => ({
          value: el.ubigeo_inei,
          label: el.dis_prov_dep,
        }))
      );
    });
  }, 500);

  const handleQueryDocument = () => {
    const { tipo_documento_cod, nro_documento, api } = getValues();
    if (tipo_documento_cod == "1" || tipo_documento_cod == "6") {
      queryDocument({ tipo_documento_cod, nro_documento, api });
    } else {
      toast("No se puede consultar este número de documento", {
        type: "warning",
      });
    }
  };

  const submit = (data: Cliente) => {
    Swal.fire({
      icon: "question",
      text: data.id
        ? `¿Desea guardar los cambios de ${cropText(data.nombre_razon_social)}?`
        : `¿Desea registrar a ${cropText(data.nombre_razon_social)}?`,
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "Cancelar",
      target: document.getElementById("form_cliente"),
      customClass: {
        popup: darkMode ? "swal-dark" : "",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        if (data.id) {
          updateCliente(data);
        } else {
          createCliente(data);
        }
      }
    });
  };

  const resetForm = () => {
    reset(clienteFormInit);
    if(queryDocumentResp){
      resetQueryDocument();
    }
  };

  const handleClose = () => {
    navigate(location.pathname)
  };

  useEffect(() => {
    if(!id) return resetForm()
    if(+id || 0){
      getCliente(+id)
    }else{
      resetForm()
    }
  }, [id]);

  // useEffect(() => {
  //   if (showClienteForm) {
  //     if (currentClienteId) {
  //       getCliente(currentClienteId);
  //     }
  //   } else {
  //     resetForm();
  //   }
  // }, [showClienteForm]);

  useEffect(() => {
    if (!queryDocumentResp) return;
    if("error" in queryDocumentResp && queryDocumentResp.error){
      toast(queryDocumentResp.msg, { type: queryDocumentResp.msgType });
    }else if("nro_documento" in queryDocumentResp){
      setValue("id", queryDocumentResp.id || 0);
      setValue("nombre_razon_social", queryDocumentResp.nombre_razon_social || "");
      setValue("direccion", queryDocumentResp.direccion || "");
      setValue("ubigeo_inei", queryDocumentResp.ubigeo || "");
      setValue("dis_prov_dep", queryDocumentResp.dis_prov_dep || "");
      setValue("email", queryDocumentResp.email || "");
      setValue("telefono", queryDocumentResp.telefono || "");
      setValue("api", 1, { shouldDirty: true });
    }
  }, [queryDocumentResp]);

  useEffect(() => {
    if (!clienteRes) return;
    if(isErrClienteRes(clienteRes)){
      toast.error("Error al obtener el cliente");
      handleClose();
    }else{
      reset(clienteRes);
    }
  }, [clienteRes]);

  useEffect(() => {
    if (!isErrorCliente) return;
    toast.error("Error de conexion");
    handleClose();
  }, [isErrorCliente]);

  useEffect(() => {
    if (!mutationRes) return;
    if(mutationRes?.msgType === 'success'){
      if(onMutation){
        onMutation(mutationRes?.cliente)
      }
      handleClose()
    }
    toast(mutationRes.msg, { type: mutationRes.msgType });
  }, [mutationRes]);

  return (
    <div>
      <Modal
        show={!!id}
        onHide={handleClose}
        backdrop="static"
        size="lg"
      >
        <Modal.Header closeButton className="py-2">
          <Modal.Title>
            {(id && +id) ? "Editar cliente" : "Nuevo cliente"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(submit)} id="form_cliente">
            {isPendingMutation && <LdsBar />}
            {isPendingQueryDocument && <LdsBar />}
            <Row>
              <Form.Group as={Col} md={4} className="mb-3">
                <Form.Label htmlFor="tipo_documento_cod">Tipo</Form.Label>
                <Form.Select
                  id="tipo_documento_cod"
                  {...register("tipo_documento_cod", {
                    required: "El nombre o Razón Social son requeridos",
                    validate: (val: string) => {
                      if (val == "0") {
                        return "Elija un tipo de documento";
                      }
                    },
                  })}
                  disabled={
                    docum?.nombre_razon_social ||
                    (id && +id)
                      ? true
                      : false
                  }
                >
                  {tiposDocumento.map((el) => (
                    <option key={el.id} value={el.codigo}>
                      {el.descripcion}
                    </option>
                  ))}
                </Form.Select>
                {errors.tipo_documento_cod && (
                  <div className="invalid-feedback d-block">
                    {errors.tipo_documento_cod.message}
                  </div>
                )}
              </Form.Group>
              <Form.Group as={Col} md={8} className="mb-3">
                <Form.Label
                  htmlFor="nro_documento"
                  className="d-flex justify-content-between"
                >
                  <div>Nro Doc</div>
                  {docum && (
                    <Badge
                      bg={
                        docum?.estado_sunat == "ACTIVO"
                          ? "success"
                          : "warning"
                      }
                    >
                      {docum?.estado_sunat}
                    </Badge>
                  )}
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    id="nro_documento"
                    {...register("nro_documento", {
                      required: "Ingrese el número de documento",
                      validate: (val: string) => {
                        if (watch("tipo_documento_cod") == "1" && val.trim().length != 8) {
                          return "Ingrese 8 dígitos para el DNI";
                        }
                        if (watch("tipo_documento_cod") == "6" && val.trim().length != 11) {
                          return "Ingrese 11 dígitos para el RUC";
                        }
                      },
                    })}
                    disabled={
                      docum?.nombre_razon_social ||
                      (id && +id)
                        ? true
                        : false
                    }
                  />
                  <Button
                    onClick={handleQueryDocument}
                    variant="outline-secondary"
                    title="Consultar nro. de documento"
                  >
                    <FaSearch />
                  </Button>
                </InputGroup>
                {errors.nro_documento && (
                  <div className="invalid-feedback d-block">
                    {errors.nro_documento.message}
                  </div>
                )}
              </Form.Group>
              <Form.Group as={Col} md={12} className="mb-3">
                <Form.Label htmlFor="nombre_razon_social">
                  Nombre o Razón Social
                </Form.Label>
                <Form.Control
                  id="nombre_razon_social"
                  {...register("nombre_razon_social", {
                    required: "El nombre o Razón Social son requeridos",
                    minLength: {
                      value: 3,
                      message: "Se permite mínimo 3 caracteres",
                    },
                    maxLength: {
                      value: 150,
                      message: "Se permite máximo 150 caracteres",
                    },
                  })}
                  disabled={
                    docum?.nombre_razon_social ? true : false
                  }
                />
                {errors.nombre_razon_social && (
                  <div className="invalid-feedback d-block">
                    {errors.nombre_razon_social.message}
                  </div>
                )}
              </Form.Group>
              <Form.Group as={Col} md={12} className="mb-3">
                <Form.Label
                  htmlFor="direccion"
                  className="d-flex justify-content-between"
                >
                  <div>Dirección</div>
                  {docum && (
                    <Badge
                      bg={
                        docum.condicion_sunat == "HABIDO"
                          ? "success"
                          : "warning"
                      }
                    >
                      {docum.condicion_sunat}
                    </Badge>
                  )}
                </Form.Label>
                <Form.Control
                  id="direccion"
                  {...register("direccion", {
                    minLength: {
                      value: 3,
                      message: "Se permite mínimo 3 caracteres",
                    },
                    maxLength: {
                      value: 150,
                      message: "Se permite máximo 150 caracteres",
                    },
                    validate: (val: string) => {
                      if (watch("tipo_documento_cod") == "6" && val == "") {
                        return "Debe ingresar la dirección";
                      }
                    },
                  })}
                  disabled={docum?.direccion ? true : false}
                />
                {errors.direccion && (
                  <div className="invalid-feedback d-block">
                    {errors.direccion.message}
                  </div>
                )}
              </Form.Group>

              <Form.Group as={Col} md={12} className="mb-3">
                <Form.Label >Ubigeo</Form.Label>
                <Controller
                  name="ubigeo_inei"
                  control={control}
                  rules={{
                    validate: (val: string) => {
                      if (watch("tipo_documento_cod") == "6" && val == "") {
                        return "Debe ingresar el ubigeo";
                      }
                    },
                  }}
                  render={() => (
                    <div title={getValues().dis_prov_dep}>
                      <SelectAsync
                        loadOptions={loadUbigeosOptions}
                        // defaultOptions
                        styles={darkMode ? selectDark : undefined}
                        isClearable
                        isDisabled={docum?.ubigeo ? true : false}
                        value={{
                          value: getValues().ubigeo_inei,
                          label: getValues().dis_prov_dep,
                        }}
                        onChange={(selectedOpt) => {
                          setValue(
                            "ubigeo_inei",
                            selectedOpt?.value ? selectedOpt?.value : "",
                            { shouldDirty: true }
                          );
                          setValue("dis_prov_dep", selectedOpt?.label || "");
                          if (selectedOpt) clearErrors("ubigeo_inei");
                        }}
                      />
                    </div>
                  )}
                />
                {errors.ubigeo_inei && (
                  <div className="invalid-feedback d-block">
                    {errors.ubigeo_inei.message}
                  </div>
                )}
              </Form.Group>

              <Form.Group as={Col} md={6} xl={4} className="mb-3">
                <Form.Label htmlFor="email">Email</Form.Label>
                <Form.Control
                  type="text"
                  id="email"
                  {...register("email", {
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Formato de email no válido",
                    },
                  })}
                />
                {errors.email && (
                  <div className="invalid-feedback d-block">
                    {errors.email.message}
                  </div>
                )}
              </Form.Group>
              <Form.Group as={Col} md={6} xl={4} className="mb-3">
                <Form.Label htmlFor="telefono">Teléfono</Form.Label>
                <Form.Control id="telefono" {...register("telefono")} />
                {errors.telefono && (
                  <div className="invalid-feedback d-block">
                    {errors.telefono.message}
                  </div>
                )}
              </Form.Group>
            </Row>
            <div className="d-flex gap-2 justify-content-end">
              <Button
                onClick={() => resetForm()}
                variant="seccondary"
                type="button"
                hidden={(id && +id) ? true : false}
              >
                Reset
              </Button>
              <Button variant="seccondary" type="button" onClick={handleClose}>
                Cerrar
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={isPendingMutation ? true : isDirty ? false : true}
              >
                {isPendingMutation && (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                )}
                Guardar
              </Button>
            </div>
          </Form>
        </Modal.Body>
        {isPendingCliente && <LdsEllipsisCenter />}
      </Modal>
    </div>
  );
}
