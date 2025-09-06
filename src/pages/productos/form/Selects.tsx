const apiURL = import.meta.env.VITE_API_URL;
import { useRef } from "react";
import { Form } from "react-bootstrap"
import { Control, Controller, UseFormClearErrors, UseFormGetValues, UseFormSetValue } from "react-hook-form";
import SelectAsync from "react-select/async"
import { debounce } from "../../../app/utils/funciones";
import useSessionStore from "../../../app/store/useSessionStore";
import { filterParamInit, selectDark } from "../../../app/utils/constants";
import useLayoutStore from "../../../app/store/useLayoutStore";
import { LaboratorioItem, MarcaItem, Producto } from "../../../app/types";
import { FaPlus } from "react-icons/fa6";
import { fnFetch } from "../../../api/fnFetch";

type SelectProps = {
  control: Control<Producto, any>;
  getValues: UseFormGetValues<Producto>;
  setValue: UseFormSetValue<Producto>;
  clearErrors: UseFormClearErrors<Producto>
}

interface SelectPropsMarcas extends SelectProps {
  setShowMarcaForm: React.Dispatch<React.SetStateAction<boolean>>;
}

interface SelectPropsLaboratorios extends SelectProps {
  setShowLaboratorioForm: React.Dispatch<React.SetStateAction<boolean>>;
}

export function MarcasSelect({
    control,
    getValues,
    setValue,
    clearErrors,
    setShowMarcaForm,
  }: SelectPropsMarcas) {
  const abortMarcas = useRef<AbortController | null>(null);
  const tknSession = useSessionStore(state => state.tknSession)
  const darkMode = useLayoutStore(state => state.layout.darkMode)

  const loadMarcasOptions =  debounce((search: string, callback: any) => {
    abortMarcas.current?.abort();
    abortMarcas.current = new AbortController();
    const filtered = {...filterParamInit, search}
    fnFetch({
      method: "POST",
      url: `${apiURL}marcas/filter_marcas?page=1`,
      body: JSON.stringify(filtered),
      signal: abortMarcas.current.signal,
      authorization: "Bearer " + tknSession
    }).then((data) => {
      callback(data.filas.map((el: MarcaItem)=>({value:el.id, label:el.nombre})))
    });
  },500)

  return (
    <>
      <Form.Label className="d-flex justify-content-between">
          <div>Marca</div>
          <div
            className="text-primary px-2"
            role="button"
            title="Crear marca"
            onClick={()=> setShowMarcaForm(true)}
          >
            <FaPlus />
          </div>
      </Form.Label>
      <Controller
        name="marca_id"
        control={control}
        render={() => (
          <SelectAsync
            id="marca_id"
            loadOptions={loadMarcasOptions}
            // defaultOptions
            styles={darkMode ? selectDark : undefined}
            isClearable
            value={{value:getValues().marca_id, label:getValues().marca}}
            onChange={(selectedOpt) => {
              setValue("marca_id", selectedOpt?.value || 0, {shouldDirty: true})
              setValue("marca", selectedOpt?.label || "")
              if(selectedOpt) clearErrors("marca_id")
            }}
          />
        )}
      />
    </>
  )
}

export function LaboratorioSelect({
  control, 
  getValues, 
  setValue, 
  clearErrors, 
  setShowLaboratorioForm
}: SelectPropsLaboratorios) {
  const abortLaboratorios = useRef<AbortController | null>(null);
  const tknSession = useSessionStore(state => state.tknSession)
  const darkMode = useLayoutStore(state => state.layout.darkMode)

  const loadLaboratoriosOptions =  debounce((search: string, callback: any) => {
    abortLaboratorios.current?.abort(); // ✅ Cancela la petición anterior
    abortLaboratorios.current = new AbortController();
    const filtered = {...filterParamInit, search}

    const abortController = new AbortController()
    return fnFetch({
      method: "POST",
      url: `${apiURL}laboratorios/filter_laboratorios?page=1`,
      body: JSON.stringify(filtered),
      signal: abortController.signal,
      authorization: "Bearer " + tknSession
    }).then((data) => {
      callback(data.filas.map((el: LaboratorioItem)=>({value:el.id, label:el.nombre})))
    });
  },500)

  return (
    <>
      <Form.Label className="d-flex justify-content-between">
        <div>Laboratorio</div>
        <div
          className="text-primary px-2"
          role="button"
          title="Crear laboratorio"
          onClick={()=> setShowLaboratorioForm(true)}
        >
          <FaPlus />
        </div>
      </Form.Label>
      <Controller 
        name="laboratorio_id"
        control={control}
        render={() => (
          <SelectAsync
            loadOptions={loadLaboratoriosOptions}
            // defaultOptions
            styles={darkMode ? selectDark : undefined}
            isClearable
            value={{value:getValues().laboratorio_id, label:getValues().laboratorio}}
            onChange={(selectedOpt) => {
              setValue("laboratorio_id", selectedOpt?.value || 0, {shouldDirty: true})
              setValue("laboratorio", selectedOpt?.label || "")
              if(selectedOpt) clearErrors("laboratorio_id")
            }}
          />
        )}
      />
    </>
  )
}


