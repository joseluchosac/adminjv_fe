import { useContext } from "react";
import { MovimientosContext } from "../context/MovimientosContext";
import { MovimientoFormDetalle } from "../../../core/types";

export const useMovimientos = () => {
  const context = useContext(MovimientosContext);

  if (context === undefined) {
    throw new Error('useMovimientos must be used within an MovimientosProvider');
  }

  const agregarProducto = (item: MovimientoFormDetalle) => {
    const {detalle} = context.userMovimientoForm.getValues()
    const idx = detalle.findIndex(el => el.producto_id === item.producto_id)
    let nuevoDetalle: MovimientoFormDetalle[] = []
    if(idx === -1){
      item.tmp_id = Date.now()
      nuevoDetalle = detalle ? [...detalle, item] : []
    }else{
      detalle[idx] = {...detalle[idx], cantidad: detalle[idx].cantidad + 1 }
      nuevoDetalle = [...detalle]
    }
    context.userMovimientoForm.setValue("detalle", nuevoDetalle, {shouldDirty: true})
  }

  return {
    ...context,
    agregarProducto
  };
};