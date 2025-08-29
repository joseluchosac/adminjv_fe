const apiURL = import.meta.env.VITE_API_URL;
import { useMutation, useQuery } from "@tanstack/react-query";
import useSessionStore from "../../app/store/useSessionStore";
import { useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FetchOptions,
  TipoComprobante,
} from "../../app/types";
import { fnFetch } from "../fnFetch";
import {
  CajasSchema,
  FormasPagoSchema,
  ImpuestosSchema,
  MotivosNotaSchema,
  TiposComprobanteSchema,
  TiposDocumentoSchema,
  TiposEstablecimientoSchema,
  TiposMonedaSchema,
  TiposMovimientoCajaSchema,
  TiposMovimientoSchema,
  TiposOperacionSchema,
  UnidadesMedidaSchema,
} from "../../app/schemas/catalogos-schema";

// ****** CAJAS ******
export const useCajasQuery = () => {
  const tknSession = useSessionStore((state) => state.tknSession);
  const { data, isFetching } = useQuery({
    queryKey: ["cajas"],
    queryFn: () => {
      const options: FetchOptions = {
        url: apiURL + "catalogos/get_cajas",
        authorization: "Bearer " + tknSession,
      };
      return fnFetch(options);
    },
    staleTime: 1000 * 60 * 60 * 24,
  });

  const cajas = useMemo(() => {
    const result = CajasSchema.safeParse(data);
    return result.success ? result.data : [];
  }, [data]);

  return {
    cajas,
    isFetching,
  };
};

// ****** FORMAS PAGO ******
export const useFormasPagoQuery = () => {
  const tknSession = useSessionStore((state) => state.tknSession);
  const { data, isFetching } = useQuery({
    queryKey: ["formas_pago"],
    queryFn: () => {
      const options: FetchOptions = {
        url: apiURL + "catalogos/get_formas_pago",
        authorization: "Bearer " + tknSession,
      };
      return fnFetch(options);
    },
    staleTime: 1000 * 60 * 60 * 24,
  });

  const formasPago = useMemo(() => {
    const result = FormasPagoSchema.safeParse(data);
    return result.success ? result.data : [];
  }, [data]);

  return {
    formasPago,
    isFetching,
  };
};

// ****** IMPUESTOS ******
export const useImpuestosQuery = () => {
  const tknSession = useSessionStore((state) => state.tknSession);
  const { data, isFetching } = useQuery({
    queryKey: ["impuestos"],
    queryFn: () => {
      const options: FetchOptions = {
        url: apiURL + "catalogos/get_impuestos",
        authorization: "Bearer " + tknSession,
      };
      return fnFetch(options);
    },
    staleTime: 1000 * 60 * 60 * 24,
  });

  const impuestos = useMemo(() => {
    const result = ImpuestosSchema.safeParse(data);
    return result.success ? result.data : [];
  }, [data]);

  return {
    impuestos,
    isFetching,
  };
};

// ****** MOTIVOS NOTA ******
export const useMotivosNotaQuery = () => {
  const tknSession = useSessionStore((state) => state.tknSession);
  const { data, isFetching } = useQuery({
    queryKey: ["motivos_nota"],
    queryFn: () => {
      const options: FetchOptions = {
        url: apiURL + "catalogos/get_motivos_nota",
        authorization: "Bearer " + tknSession,
      };
      return fnFetch(options);
    },
    staleTime: 1000 * 60 * 60 * 24,
  });

  const motivosNota = useMemo(() => {
    const result = MotivosNotaSchema.safeParse(data);
    return result.success ? result.data : [];
  }, [data]);

  return {
    motivosNota,
    isFetching,
  };
};

// ****** TIPOS DOCUMENTO ******
export const useTiposDocumentoQuery = () => {
  const tknSession = useSessionStore((state) => state.tknSession);
  const { data, isFetching } = useQuery({
    queryKey: ["tipos_documento"],
    queryFn: () => {
      const options: FetchOptions = {
        url: apiURL + "catalogos/get_tipos_documento",
        authorization: "Bearer " + tknSession,
      };
      return fnFetch(options);
    },
    staleTime: 1000 * 60 * 60 * 24,
  });

  const tiposDocumento = useMemo(() => {
    const result = TiposDocumentoSchema.safeParse(data);
    return result.success ? result.data : [];
  }, [data]);

  return {
    tiposDocumento,
    isFetching,
  };
};

// ****** TIPOS COMPROBANTE ******
export const useTiposComprobanteQuery = () => {
  const tknSession = useSessionStore((state) => state.tknSession);
  const { data, isFetching } = useQuery({
    queryKey: ["tipos_comprobante"],
    queryFn: () => {
      const options: FetchOptions = {
        url: apiURL + "catalogos/get_tipos_comprobante",
        authorization: "Bearer " + tknSession,
      };
      return fnFetch(options);
    },
    staleTime: 1000 * 60 * 60 * 24,
  });

  const tiposComprobante = useMemo(() => {
    const result = TiposComprobanteSchema.safeParse(data);
    return result.success ? result.data : [];
  }, [data]);

  return {
    tiposComprobante,
    isFetching,
  };
};

// ****** TIPOS MOVIMIENTO CAJA ******
export const useTiposMovimientoCajaQuery = () => {
  const tknSession = useSessionStore((state) => state.tknSession);
  const { data, isFetching } = useQuery({
    queryKey: ["tipos_movimiento_caja"],
    queryFn: () => {
      const options: FetchOptions = {
        url: apiURL + "catalogos/get_tipos_movimiento_caja",
        authorization: "Bearer " + tknSession,
      };
      return fnFetch(options);
    },
    staleTime: 1000 * 60 * 60 * 24,
  });

  const tiposMovimientoCaja = useMemo(() => {
    const result = TiposMovimientoCajaSchema.safeParse(data);
    return result.success ? result.data : [];
  }, [data]);

  return {
    tiposMovimientoCaja,
    isFetching,
  };
};

// ****** TIPOS MOVIMIENTO ******
export const useTiposMovimientoQuery = () => {
  const tknSession = useSessionStore((state) => state.tknSession);
  const { data, isFetching } = useQuery({
    queryKey: ["tipos_movimiento"],
    queryFn: () => {
      const options: FetchOptions = {
        url: apiURL + "catalogos/get_tipos_movimiento",
        authorization: "Bearer " + tknSession,
      };
      return fnFetch(options);
    },
    staleTime: 1000 * 60 * 60 * 24,
  });

  const tiposMovimiento = useMemo(() => {
    const result = TiposMovimientoSchema.safeParse(data);
    return result.success ? result.data : [];
  }, [data]);

  return {
    tiposMovimiento,
    isFetching,
  };
};

// ****** TIPOS OPERACION ******
export const useTiposOperacionQuery = () => {
  const tknSession = useSessionStore((state) => state.tknSession);
  const { data, isFetching } = useQuery({
    queryKey: ["tipos_operacion"],
    queryFn: () => {
      const options: FetchOptions = {
        url: apiURL + "catalogos/get_tipos_operacion",
        authorization: "Bearer " + tknSession,
      };
      return fnFetch(options);
    },
    staleTime: 1000 * 60 * 60 * 24,
  });

  const tiposOperacion = useMemo(() => {
    const result = TiposOperacionSchema.safeParse(data);
    return result.success ? result.data : [];
  }, [data]);

  return {
    tiposOperacion,
    isFetching,
  };
};

// ****** TIPOS MONEDA ******
export const useTiposMonedaQuery = () => {
  const tknSession = useSessionStore((state) => state.tknSession);
  const { data, isFetching } = useQuery({
    queryKey: ["tipos_moneda"],
    queryFn: () => {
      const options: FetchOptions = {
        url: apiURL + "catalogos/get_tipos_moneda",
        authorization: "Bearer " + tknSession,
      };
      return fnFetch(options);
    },
    staleTime: 1000 * 60 * 60 * 24,
  });

  const tiposMoneda = useMemo(() => {
    const result = TiposMonedaSchema.safeParse(data);
    return result.success ? result.data : [];
  }, [data]);

  return {
    tiposMoneda,
    isFetching,
  };
};

// ****** TIPOS ESTABLECIMIENTO ******
export const useTiposEstablecimientoQuery = () => {
  const tknSession = useSessionStore((state) => state.tknSession);
  const { data, isFetching } = useQuery({
    queryKey: ["tipos_establecimiento"],
    queryFn: () => {
      const options: FetchOptions = {
        url: apiURL + "catalogos/get_tipos_establecimiento",
        authorization: "Bearer " + tknSession,
      };
      return fnFetch(options);
    },
    staleTime: 1000 * 60 * 60 * 24,
  });

  const tiposEstablecimiento = useMemo(() => {
    const result = TiposEstablecimientoSchema.safeParse(data);
    return result.success ? result.data : [];
  }, [data]);

  return {
    tiposEstablecimiento,
    isFetching,
  };
};

// ****** UNIDADES MEDIDA ******
export const useUnidadesMedidaQuery = () => {
  const tknSession = useSessionStore((state) => state.tknSession);
  const { data, isFetching } = useQuery({
    queryKey: ["unidades_medida"],
    queryFn: () => {
      const options: FetchOptions = {
        url: apiURL + "catalogos/get_unidades_medida",
        authorization: "Bearer " + tknSession,
      };
      return fnFetch(options);
    },
    staleTime: 1000 * 60 * 60 * 24,
  });

  const unidadesMedida = useMemo(() => {
    const result = UnidadesMedidaSchema.safeParse(data);
    return result.success ? result.data : [];
  }, [data]);

  return {
    unidadesMedida,
    isFetching,
  };
};


// ****** MUTATION CATALOGOS ******
export const useMutationCatalogosQuery = () => {
  const fnName = useRef("");
  const resetSessionStore = useSessionStore((state) => state.resetSessionStore);
  const navigate = useNavigate();
  const token = useSessionStore((state) => state.tknSession);

  const { data, isPending, isError, mutate } = useMutation({
    mutationKey: ["mutation_catalogos"],
    mutationFn: fnFetch,
    onSuccess: (resp) => {
      if (resp.msgType !== "success") return;
      // queryClient.invalidateQueries({queryKey:["catalogos"]})
    },
  });

  const createTipoComprobante = (param: TipoComprobante) => {
    fnName.current = createTipoComprobante.name;
    const options: FetchOptions = {
      method: "POST",
      url: apiURL + "catalogos/create_tipo_comprobante",
      body: JSON.stringify(param),
      authorization: "Bearer " + token,
    };
    mutate(options);
  };

  const updateTipoComprobante = (param: TipoComprobante) => {
    fnName.current = updateTipoComprobante.name;
    const options: FetchOptions = {
      method: "PUT",
      url: apiURL + "catalogos/update_tipo_comprobante",
      body: JSON.stringify(param),
      authorization: "Bearer " + token,
    };
    mutate(options);
  };

  const deleteTipoComprobante = (id: number) => {
    fnName.current = deleteTipoComprobante.name;
    const options: FetchOptions = {
      method: "DELETE",
      url: apiURL + "catalogos/delete_tipo_comprobante",
      body: JSON.stringify({ id }),
      authorization: "Bearer " + token,
    };
    mutate(options);
  };

  useEffect(() => {
    if (!data) return;
    if (data?.errorType === "errorToken") {
      resetSessionStore();
      navigate("/auth");
    }
  }, [data]);

  return {
    data,
    isPending,
    isError,
    createTipoComprobante,
    updateTipoComprobante,
    deleteTipoComprobante,
  };
};
