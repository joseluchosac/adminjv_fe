const apiURL = import.meta.env.VITE_API_URL;
import { useEffect, useRef } from "react"
import { Button, Col, Container, Form, Row } from "react-bootstrap"
import { Controller, useForm } from "react-hook-form"
import SelectAsync from "react-select/async"
import Select from "react-select"
import useLayoutStore from "../../core/store/useLayoutStore"
import { filterParamsInit, selectDark } from "../../core/utils/constants"
import useSessionStore from "../../core/store/useSessionStore"
import { debounce } from "../../core/utils/funciones"
import { LaboratorioItem } from "../../core/types";
import { fnFetch } from "../../core/services/fnFetch";
const opciones = [
  {value:1, label:"opcion 1"},
  {value:2, label:"opcion 2"},
  {value:3, label:"opcion 3"},
  {value:4, label:"opcion 4"},
]

type Producto = {
  id: number;
  descripcion: string;
  marca_id: number | null;
  marca: string;
  laboratorio_id: number | null;
  laboratorio: string;
  estado: number;
  categorias: any;
}

const productoFormInit = {
  id: 0,
  descripcion: "",
  marca_id: null,
  marca: "",
  laboratorio_id: null,
  laboratorio: "",
  estado: 1,
  categorias: []
}

const unProducto = {
  id: 0,
  descripcion: "Redmi note",
  marca_id: 14,
  marca: "XIAOMI",
  laboratorio_id: 20,
  laboratorio: "ANDINA PAKAMUROS",
  estado: 1,
}

function Formulario() {
  const darkMode = useLayoutStore(state => state.layout.darkMode)
  const tknSession = useSessionStore(state => state.tknSession)

  const {
    register, 
    formState: {errors, isDirty}, 
    handleSubmit, 
    reset,
    getValues,
    setValue,
    control,
    clearErrors
  } = useForm<Producto>({defaultValues: productoFormInit})


  const abortLaboratorios = useRef<AbortController | null>(null);
  const abortMarcas = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      abortLaboratorios.current?.abort(); // ✅ Cancela la petición al desmontar
      abortMarcas.current?.abort();
    };
  }, []);

  const loadMarcasOptions =  debounce((search: string, callback: any) => {
    abortMarcas.current?.abort(); // ✅ Cancela la petición anterior
    abortMarcas.current = new AbortController();
    const filtered = {...filterParamsInit, search}
    const abortController = new AbortController()
    fnFetch({
      method: "POST",
      url: `${apiURL}marcas/filter_marcas?page=1`,
      body: JSON.stringify(filtered),
      signal: abortController.signal,
      authorization: "Bearer " + tknSession
    }).then((data) => {
      callback(data.filas.map((el: LaboratorioItem)=>({value:el.id, label:el.nombre})))
    });
  },500)

  const loadLaboratoriosOptions =  debounce((search: string, callback: any) => {
    abortLaboratorios.current?.abort(); // ✅ Cancela la petición anterior
    abortLaboratorios.current = new AbortController();
    const filtered = {...filterParamsInit, search}

    const abortController = new AbortController()
    fnFetch({
      method: "POST",
      url: `${apiURL}laboratorios/filter_laboratorios?page=1`,
      body: JSON.stringify(filtered),
      signal: abortController.signal,
      authorization: "Bearer " + tknSession
    }).then((data) => {
      callback(data.filas.map((el: LaboratorioItem)=>({value:el.id, label:el.nombre})))
    });
  },500)

  const submit = (data: Producto) => {
    console.log(data)
  };
  
  return (
    <Container>
      {isDirty && <div>Modificado</div>}
      <Form onSubmit={handleSubmit(submit)}>
        <Row>
          <Form.Group as={Col} md={8} className="mb-3">
            <Form.Label htmlFor="descripcion">Descripcion</Form.Label>
            <Form.Control
              id="descripcion"
              {...register('descripcion', {
                required:"Debe ingresar este campo",
                minLength: {value: 3, message:"Se permite mínimo 3 caracteres"},
                maxLength: {value: 150, message:"Se permite máximo 150 caracteres"}
              })}
            />
            {errors.descripcion && 
              <div className="invalid-feedback d-block">{errors.descripcion.message}</div>
            }        
          </Form.Group>
          <Form.Group as={Col} md={8} className="mb-3">
            <Form.Label htmlFor="marca_id">Marca</Form.Label>
            <Controller
              name="marca_id"
              control={control}
              rules={{required:"Debe ingresar este campo"}}
              render={() => (
                <SelectAsync
                  loadOptions={loadMarcasOptions}
                  defaultOptions
                  styles={darkMode ? selectDark : undefined}
                  isClearable
                  value={{value:getValues().marca_id, label:getValues().marca}}
                  onChange={(selectedOpt) => {
                    setValue("marca_id", selectedOpt?.value || null, {shouldDirty: true})
                    setValue("marca", selectedOpt?.label || "")
                    if(selectedOpt) clearErrors("marca_id")
                  }}
                />
              )}
            />
            {errors.marca_id && 
              <div className="invalid-feedback d-block">{errors.marca_id.message}</div>
            }
          </Form.Group>
          <Form.Group as={Col} md={8} className="mb-3">
            <Form.Label htmlFor="laboratorio_id">Laboratorio</Form.Label>
            <Controller
              name="laboratorio_id"
              control={control}
              rules={{required:"Debe ingresar este campo"}}
              render={() => (
                <SelectAsync
                  loadOptions={loadLaboratoriosOptions}
                  defaultOptions
                  styles={darkMode ? selectDark : undefined}
                  isClearable
                  value={{value:getValues().laboratorio_id, label:getValues().laboratorio}}
                  onChange={(selectedOpt) => {
                    setValue("laboratorio_id", selectedOpt?.value || null, {shouldDirty: true})
                    setValue("laboratorio", selectedOpt?.label || "")
                    if(selectedOpt) clearErrors("laboratorio_id")
                  }}
                />
              )}
            />
            {errors.laboratorio_id && 
              <div className="invalid-feedback d-block">{errors.laboratorio_id.message}</div>
            }
          </Form.Group>
        </Row>
        <Row>
          <Button type="submit">enviar</Button>
        </Row>
      </Form>
      <button onClick={()=>{
        reset(unProducto)
      }}>set producto</button>
      <button onClick={()=>{
        reset(productoFormInit)
      }}>reset</button>
      <Select
        options={opciones}
        isMulti
        value={[{value:3, label:"opcion 2"}]}
      />
    </Container>
  )
}

export default Formulario