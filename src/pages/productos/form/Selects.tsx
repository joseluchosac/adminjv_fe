import { useRef } from "react";
import { Form } from "react-bootstrap"
import { Control, Controller, UseFormClearErrors, UseFormGetValues, UseFormSetValue } from "react-hook-form";
import SelectAsync from "react-select/async"
import { debounce } from "../../../core/utils/funciones";
import useLaboratoriosStore from "../../../core/store/useLaboratoriosStore";
import { filterLaboratoriosFetch } from "../../../core/services/laboratoriosFetch";
import useSessionStore from "../../../core/store/useSessionStore";
import { selectDark } from "../../../core/utils/constants";
import useLayoutStore from "../../../core/store/useLayoutStore";
import { Producto } from "../../../core/types";
import useMarcasStore from "../../../core/store/useMarcasStore";
import { filterMarcasFetch } from "../../../core/services/marcasFetch";


type SelectProps = {
  control: Control<Producto, any>;
  getValues: UseFormGetValues<Producto>;
  setValue: UseFormSetValue<Producto>;
  clearErrors: UseFormClearErrors<Producto>
}

export function MarcasSelect({control, getValues, setValue, clearErrors}: SelectProps) {
  const filterParamsMarcas = useMarcasStore(state => state.filterParamsMarcas)
  const abortMarcas = useRef<AbortController | null>(null);
  const tknSession = useSessionStore(state => state.tknSession)
  const darkMode = useLayoutStore(state => state.layout.darkMode)

  const loadMarcasOptions =  debounce((search: string, callback: any) => {
    abortMarcas.current?.abort(); // ✅ Cancela la petición anterior
    abortMarcas.current = new AbortController();
    const filtered = {...filterParamsMarcas, search}
    filterMarcasFetch({filterParamsMarcas: filtered, pageParam:1, token: tknSession, signal: abortMarcas.current.signal })
    .then(data=>{
      callback(data.filas.map(el=>({value:el.id, label:el.nombre})))
    })
  },500)

  return (
    <>
      <Form.Label>Marca</Form.Label>
      <Controller
        name="marca_id"
        control={control}
        render={() => (
          <SelectAsync
            id="marca_id"
            loadOptions={loadMarcasOptions}
            defaultOptions
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

export function LaboratorioSelect({control, getValues, setValue, clearErrors}: SelectProps) {
  const filterParamsLaboratorios = useLaboratoriosStore(state => state.filterParamsLaboratorios)
  const abortLaboratorios = useRef<AbortController | null>(null);
  const tknSession = useSessionStore(state => state.tknSession)
  const darkMode = useLayoutStore(state => state.layout.darkMode)

  const loadLaboratoriosOptions =  debounce((search: string, callback: any) => {
    abortLaboratorios.current?.abort(); // ✅ Cancela la petición anterior
    abortLaboratorios.current = new AbortController();
    const filtered = {...filterParamsLaboratorios, search}
    filterLaboratoriosFetch({filterParamsLaboratorios: filtered, pageParam:1, token: tknSession, signal: abortLaboratorios.current.signal })
    .then(data=>{
      callback(data.filas.map(el=>({value:el.id, label:el.nombre})))
    })
  },500)

  return (
    <>
      <Form.Label>Laboratorio</Form.Label>
      <Controller
        name="laboratorio_id"
        control={control}
        render={() => (
          <SelectAsync
            loadOptions={loadLaboratoriosOptions}
            defaultOptions
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
