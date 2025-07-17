const apiURL = import.meta.env.VITE_API_URL;
import { useEffect, useRef, useState } from "react"
import SelectAsync from "react-select/async";
import { toast } from "react-toastify"
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap"
import { Controller, useForm, useWatch } from "react-hook-form"
import { MdHideImage, MdImage } from "react-icons/md"
import { FaUndo } from "react-icons/fa"
import { useQueryClient } from "@tanstack/react-query"
import useSessionStore from "../../../core/store/useSessionStore"
import { QueryResp, UbigeoItem, type Empresa } from "../../../core/types"
import { LdsEllipsisCenter } from "../../../core/components/Loaders"
import { ConfirmPass } from "../../../core/components/ConfirmsMdl"
import { debounce } from "../../../core/utils/funciones"
import { filterParamsInit, selectDark } from "../../../core/utils/constants"
import { fnFetch } from "../../../core/services/fnFetch"
import useLayoutStore from "../../../core/store/useLayoutStore";
import { useEmpresaQuery, useMutationEmpresaQuery } from "../../../core/hooks/useEmpresaQuery";

export default function Empresa() {
  const [showConfirmPass, setShowConfirmPass] = useState(false)
  const [urlLogoPreview, setUrlLogoPreview] = useState("")
  const token = useSessionStore((state) => state.tknSession);
  const queryClient = useQueryClient()
  const {empresa, isFetching: isFetchingEmpresa} = useEmpresaQuery()
  const darkMode = useLayoutStore((state) => state.layout.darkMode);
  const abortUbigeos = useRef<AbortController | null>(null);

  const {
    data: mutation,
    isPending: isPendingMutation, 
    updateEmpresa 
  } = useMutationEmpresaQuery<QueryResp>()

  const {
    register, 
    formState: {errors, dirtyFields}, 
    handleSubmit, 
    reset,
    getValues,
    setValue,
    control,
    clearErrors
  } = useForm<Empresa>()

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
  
  const watchLogoFile = useWatch({ control, name:"fileLogo" });


  const submit = () => {
    setShowConfirmPass(true)
    // onSuccessConfirmPass() // Solo para saltarse la confirmacion
  }

  const onSuccessConfirmPass = () => {
    let formData = new FormData()
    let data = getValues()
    Object.keys(data).forEach((el) => {
      if(!['fileLogo', 'fileCertificado', 'urlLogo', 'urlNoImage'].includes(el)){
        formData.append(el, data[el as keyof Empresa ])
      }
    })
    if(data.fileLogo?.length){
      formData.append("fileLogo",data.fileLogo[0])
    }
    if(data.fileCertificado?.length){
      formData.append("fileCertificado",data.fileCertificado[0])
    }
    updateEmpresa(formData)
  }

  const handleResetLogoFile = () => {
    setValue("fileLogo", null)
    setValue("logo", empresa ? empresa.logo : "")
    setUrlLogoPreview(empresa ? empresa.urlLogo : "")
  }
  
  const handleQuitarLogo = () => {
    setUrlLogoPreview(empresa ? empresa.urlNoImage : "")
    setValue("logo", "",{shouldDirty: true})
  }

  const handleQuitarCertificado = () => {
    setValue("certificado_digital", "",{shouldDirty: true})
  }
  
  const handleReset = () => {
    reset()
    setUrlLogoPreview(empresa ? empresa.urlLogo : "")
  }

  useEffect(()=>{
    if(empresa){
      reset(empresa as Empresa)
      setUrlLogoPreview(empresa.urlLogo)
    }
  },[empresa])

  useEffect(() => {
    if(!empresa) return
    if(!watchLogoFile || !watchLogoFile.length){
      setUrlLogoPreview(empresa.urlLogo)
    }else{
      if(!watchLogoFile[0].type.includes("image/")){
        setUrlLogoPreview(empresa.urlLogo)
        setValue("fileLogo", null)
      }else{
        const reader = new FileReader()
        reader.onloadend = () => {
          setUrlLogoPreview(reader.result as string)
        }
        reader.readAsDataURL(watchLogoFile[0])
        setValue("logo", empresa.logo)
      }
    }
  }, [watchLogoFile])

  useEffect(()=>{
    if(!mutation) return
    if(mutation?.msgType === "success"){
      queryClient.invalidateQueries({queryKey:['empresa']})
      queryClient.invalidateQueries({queryKey:['empresa_session']})
    setValue("fileLogo", null) 
    }
    toast(mutation?.msg, {type: mutation?.msgType})
  },[mutation])


  return (
    <div>
      <Form onSubmit={handleSubmit(submit)} className="position-relative p-2">
        <Row>
          <Form.Group as={Col} lg={6} className="mb-3">
            <Form.Label htmlFor="razon_social">Razon Social</Form.Label>
            <Form.Control
              id="razon_social"
              {...register('razon_social')}
            />
          </Form.Group>
          <Form.Group as={Col} lg={6} className="mb-3">
            <Form.Label htmlFor="nombre_comercial">Nombre Comercial</Form.Label>
            <Form.Control
              id="nombre_comercial"
              {...register('nombre_comercial')}
            />
          </Form.Group>
          <Form.Group as={Col} lg={8} className="mb-3">
            <Form.Label htmlFor="direccion">Dirección</Form.Label>
            <Form.Control
              id="direccion"
              {...register('direccion')}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label >Ubigeo</Form.Label>
            <Controller
              name="ubigeo_inei"
              control={control}
              rules={{required: "Ingrese el ubigeo"}}
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
          <Col md={6}>
            <Form.Group as={Col} className="mb-3">
              <Form.Label htmlFor="ruc">Ruc</Form.Label>
              <Form.Control
                id="ruc"
                {...register('ruc')}
              />
            </Form.Group>
            <Form.Group as={Col} className="mb-3">
              <Form.Label htmlFor="telefono">Teléfono</Form.Label>
              <Form.Control
                id="telefono"
                {...register('telefono')}
              />
            </Form.Group>
            <Form.Group as={Col} className="mb-3">
              <Form.Label htmlFor="email">Email</Form.Label>
              <Form.Control
                id="email"
                {...register('email')}
              />
            </Form.Group>
            <Form.Group as={Col} className="mb-3 text-center">
              <Form.Control
                id="logo"
                hidden={true}
                {...register('logo')}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <div className="d-flex justify-content-between">
              <div>Logo empresa</div>
              <div className="d-flex justify-content-center gap-3">
                <Form.Label htmlFor="logo-file" className="p-1 m-0" role="button">
                  <MdImage className="fs-4" title="Seleccionar logo" />
                </Form.Label>
                <div 
                  onClick={handleResetLogoFile} 
                  className="p-1 m-0" 
                  role="button"
                  hidden={(!watchLogoFile || !watchLogoFile.length) && getValues().logo ? true : false}
                ><FaUndo title="Restaurar logo" /></div>
                <div 
                  onClick={handleQuitarLogo} 
                  className="p-1 m-0" 
                  role="button"
                  hidden={
                    (getValues().logo && getValues().logo !== "no_image.png") 
                    && (!watchLogoFile || !watchLogoFile.length)
                      ? false : true}
                >
                  <MdHideImage className="fs-4" title="Eliminar logo" />
                </div>
              </div>
            </div>
            <div className="border">
              <img 
                src={urlLogoPreview}
                style={{width:"100%", height:"205px", objectFit: "contain"}} 
                alt="Logo preview" 
              />
              <div className="d-flex justify-content-center gap-3">
              </div>
                <Form.Control
                  id="logo-file"
                  type="file"
                  accept="image/*"
                  hidden={true}
                  {...register('fileLogo')}
                />
            </div>
          </Col>
        </Row>
        <Row>
          <Form.Group as={Col} md={12} className="mb-3">
            <Form.Label htmlFor="certificado_digital">Certificado digital actual</Form.Label>
            <InputGroup>
              <Form.Control
                id="certificado_digital"
                {...register('certificado_digital')}
                disabled={true}
              />
              <Button variant="outline-secondary" onClick={()=>{handleQuitarCertificado()}}>
                Eliminar
              </Button>
            </InputGroup>
          </Form.Group>
          <Form.Group as={Col} md={12} className="mb-3">
            <Form.Label>Elegir certificado digital</Form.Label>
            <Form.Control
              type="file"
              // accept=".pfx"
              {...register('fileCertificado')}
            />
          </Form.Group>
          <Form.Group as={Col} md={4} className="mb-3">
            <Form.Label htmlFor="clave_certificado">Clave certificado</Form.Label><Form.Control
              id="clave_certificado"
              {...register('clave_certificado')}
            />
          </Form.Group>
          <Form.Group as={Col} md={4} className="mb-3">
            <Form.Label htmlFor="usuario_sol">Usuario SOL</Form.Label><Form.Control
              id="usuario_sol"
              {...register('usuario_sol')}
            />
          </Form.Group>
          <Form.Group as={Col} md={4} className="mb-3">
            <Form.Label htmlFor="clave_sol">Clave SOL</Form.Label><Form.Control
              id="clave_sol"
              {...register('clave_sol')}
            />
          </Form.Group>
        </Row>
        <div className="d-flex gap-2 justify-content-end mb-3">
          <Button
            type="button" 
            variant="secundary"
            onClick={() => { console.log(getValues())}}
          >
            saber
          </Button>
          <Button 
            type="button" 
            variant="secundary"
            disabled={!Boolean(Object.keys(dirtyFields).length)}
            onClick={handleReset}
          >
            Resetear
          </Button>
          <Button 
            variant="primary" 
            type="submit"
            // disabled={isPendingOnMutate ? true : formState.isDirty ? false : true}
          >
            {/* {isPendingOnMutate &&
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            } */}
            Guardar datos de la Empresa
          </Button>
        </div>
        {(isFetchingEmpresa || isPendingMutation) && <LdsEllipsisCenter />}
      </Form>
      <ConfirmPass
        show = {showConfirmPass}
        setShow = {setShowConfirmPass}
        onSuccess = {onSuccessConfirmPass}
      />
    </div>
  )
}
