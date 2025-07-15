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
import { useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { Controller, useForm } from "react-hook-form";
import { FaSearch } from "react-icons/fa";
import SelectAsync from "react-select/async";
import {
  clienteFormInit,
  filterParamsInit,
  selectDark,
} from "../../core/utils/constants";
import {
  Cliente,
  NroDocumento,
  ResponseQuery,
  UbigeoItem,
} from "../../core/types";
import useClientesStore from "../../core/store/useClientesStore";
import useLayoutStore from "../../core/store/useLayoutStore";
import useCatalogosStore from "../../core/store/useCatalogosStore";
import { useMutationClientesQuery } from "../../core/hooks/useClientesQuery";
import { LdsBar, LdsEllipsisCenter } from "../../core/components/Loaders";
import { cropText, debounce } from "../../core/utils/funciones";
import useSessionStore from "../../core/store/useSessionStore";
import { fnFetch } from "../../core/services/fnFetch";

interface DataNroDocumento extends ResponseQuery {
  content: NroDocumento;
}
interface DataCliente extends ResponseQuery {
  content: Cliente;
}

export default function ClienteForm() {
  const showClienteForm = useClientesStore((state) => state.showClienteForm);
  const setShowClienteForm = useClientesStore(
    (state) => state.setShowClienteForm
  );
  const setLastSettedCliente = useClientesStore((state) => state.setLastSettedCliente);
  const currentClienteId = useClientesStore((state) => state.currentClienteId);
  const darkMode = useLayoutStore((state) => state.layout.darkMode);
  const catalogos = useCatalogosStore((state) => state.catalogos);
  const abortUbigeos = useRef<AbortController | null>(null);
  const token = useSessionStore((state) => state.tknSession);

  const {
    data: cliente,
    isPending: isPendingCliente,
    isError: isErrorCliente,
    getCliente,
  } = useMutationClientesQuery<DataCliente>();

  const {
    data: mutation,
    isPending: isPendingMutation,
    createCliente,
    updateCliente,
  } = useMutationClientesQuery<DataCliente>();

  const {
    data: nroDocumento,
    isPending: isPendingNroDocumento,
    consultarNroDocumento,
    reset: resetNroDocumento,
  } = useMutationClientesQuery<DataNroDocumento>();

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

  const loadUbigeosOptions = debounce((search: string, callback: any) => {
    abortUbigeos.current?.abort(); // ✅ Cancela la petición anterior
    abortUbigeos.current = new AbortController();
    const filtered = { ...filterParamsInit, search };
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

  const handleConsultarNroDocumento = () => {
    const { tipo_documento_cod, nro_documento, api } = getValues();
    if (tipo_documento_cod == "1" || tipo_documento_cod == "6") {
      consultarNroDocumento({ tipo_documento_cod, nro_documento, api });
    } else {
      toast("No se puede consultar este número de documento", {
        type: "warning",
      });
    }
  };

  const submit = (data: Cliente) => {
    // console.log(data)
    // return
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
    if(nroDocumento){
      resetNroDocumento();
    }
  };

  const handleClose = () => {
    setShowClienteForm(false);
  };

  useEffect(() => {
    setLastSettedCliente(null)
  }, []);
  
  useEffect(() => {
    if (showClienteForm) {
      if (currentClienteId) {
        getCliente(currentClienteId);
      }
    } else {
      resetForm();
    }
  }, [showClienteForm]);

  useEffect(() => {
    if (!nroDocumento) return;
    if (!nroDocumento.error) {
      setValue("id", nroDocumento.content.id);
      setValue("nombre_razon_social", nroDocumento.content.nombre_razon_social);
      setValue("direccion", nroDocumento.content.direccion);
      setValue("ubigeo_inei", nroDocumento.content.ubigeo);
      setValue("dis_prov_dep", nroDocumento.content.dis_prov_dep);
      setValue("email", nroDocumento.content.email);
      setValue("telefono", nroDocumento.content.telefono);
      setValue("api", 1, { shouldDirty: true });
    } else {
      toast(nroDocumento.msg, { type: nroDocumento.msgType });
    }
  }, [nroDocumento]);

  useEffect(() => {
    if (!cliente) return;
    if (cliente.error) {
      toast.error("Error al obtener los datos");
      setShowClienteForm(false);
    } else {
      if (cliente.content) {
        reset(cliente.content);
      }
    }
  }, [cliente]);

  useEffect(() => {
    if (!isErrorCliente) return;
    toast.error("Error de conexion");
    setShowClienteForm(false);
  }, [isErrorCliente]);

  useEffect(() => {
    if (!mutation) return;
    if (!mutation.error) setShowClienteForm(false);
    toast(mutation.msg, { type: mutation.msgType });
    setLastSettedCliente(mutation.content)
  }, [mutation]);

  return (
    <div>
      <Modal
        show={showClienteForm}
        onHide={handleClose}
        backdrop="static"
        size="md"
      >
        <Modal.Header closeButton className="py-2">
          <Modal.Title>
            {currentClienteId ? "Editar cliente" : "Nuevo cliente"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(submit)} id="form_cliente">
            {isPendingMutation && <LdsBar />}
            {isPendingNroDocumento && <LdsBar />}
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
                    nroDocumento?.content?.nombre_razon_social ||
                    currentClienteId
                      ? true
                      : false
                  }
                >
                  {catalogos?.tipos_documento.map((el) => (
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
                  {nroDocumento?.content && (
                    <Badge
                      bg={
                        nroDocumento?.content.estado_sunat == "ACTIVO"
                          ? "success"
                          : "warning"
                      }
                    >
                      {nroDocumento?.content.estado_sunat}
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
                      nroDocumento?.content?.nombre_razon_social ||
                      currentClienteId
                        ? true
                        : false
                    }
                  />
                  <Button
                    onClick={handleConsultarNroDocumento}
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
                    nroDocumento?.content?.nombre_razon_social ? true : false
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
                  {nroDocumento?.content && (
                    <Badge
                      bg={
                        nroDocumento?.content?.condicion_sunat == "HABIDO"
                          ? "success"
                          : "warning"
                      }
                    >
                      {nroDocumento?.content?.condicion_sunat}
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
                  disabled={nroDocumento?.content?.direccion ? true : false}
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
                hidden={currentClienteId ? true : false}
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
