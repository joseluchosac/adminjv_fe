import { useEffect, useState } from "react"
import useSessionStore from "../../../core/store/useSessionStore"
import { useMutationConfigQuery } from "../../../core/hooks/useConfigQuery"
import { useForm, useWatch } from "react-hook-form"
import { type Empresa } from "../../../core/types"
import { Ubigeo } from "../../../core/types/catalogosTypes"
import { toast } from "react-toastify"
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap"
import { MdHideImage, MdImage } from "react-icons/md"
import { FaUndo } from "react-icons/fa"
import { LdsEllipsisCenter } from "../../../core/components/Loaders"
import UbigeosMdl from "../../../core/components/UbigeosMdl"
import { ConfirmPass } from "../../../core/components/ConfirmsMdl"

export default function Empresa() {
    const [urlLogoPreview, setUrlLogoPreview] = useState("")
    const [showUbigeos, setShowUbigeos] = useState(false)
    const [showConfirmPass, setShowConfirmPass] = useState(false)
    const setEmpresaSession = useSessionStore(state=>state.setEmpresaSession)
    const {
      data: empresa,
      isPending: isPendingEmpresa, 
      getEmpresa,
      reset: resetEmpresa,
    } = useMutationConfigQuery()
    const {
      data: mutation,
      isPending: isPendingMutation, 
      updateEmpresa 
    } = useMutationConfigQuery()
    const {
      register, 
      formState, 
      handleSubmit, 
      reset,
      getValues,
      setValue,
      control
    } = useForm<Empresa>()
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
      setValue("logo", empresa.logo)
      setUrlLogoPreview(empresa.urlLogo)
    }
    
    const handleQuitarLogo = () => {
      setUrlLogoPreview(empresa.urlNoImage)
      setValue("logo", "",{shouldDirty: true})
    }
  
    const handleQuitarCertificado = () => {
      setValue("certificado_digital", "",{shouldDirty: true})
    }
    
    const handleReset = () => {
      reset()
      setUrlLogoPreview(empresa.urlLogo)
    }
    
    const onChooseUbigeo = (ubigeo: Ubigeo) => {
      setShowUbigeos(false)
      setValue("departamento", ubigeo.departamento)
      setValue("provincia", ubigeo.provincia)
      setValue("distrito", ubigeo.distrito)
      setValue("ubigeo_inei", ubigeo.ubigeo_inei,{shouldDirty: true})
    }
    
  
  
    useEffect(()=>{
      getEmpresa()
    },[])
  
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
        resetEmpresa(mutation.registro)
        const {
          razon_social,
          nombre_comercial,
          ruc,
          direccion,
          departamento,
          provincia,
          distrito,
          telefono,
          email,
          urlLogo,
        } = mutation.registro
        setEmpresaSession({
          razon_social,
          nombre_comercial,
          ruc,
          direccion,
          departamento,
          provincia,
          distrito,
          telefono,
          email,
          urlLogo,
        })
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
            <Form.Label htmlFor="lugar">Distrito - Provincia - Departamento</Form.Label>
            <InputGroup>
              <Form.Control
                id="lugar"
                value={getValues().ubigeo_inei
                  ? `${getValues().distrito} - ${getValues().provincia} - ${getValues().departamento}`
                  : ""
                }
                disabled={true}
              />
              <Button variant="outline-secondary" onClick={()=>setShowUbigeos(true)}>
                Cambiar
              </Button>
            </InputGroup>
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
            disabled={!Boolean(Object.keys(formState.dirtyFields).length)}
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
        {(isPendingEmpresa || isPendingMutation) && <LdsEllipsisCenter />}
      </Form>
      <UbigeosMdl
        show={showUbigeos} 
        setShow={setShowUbigeos}
        onChooseUbigeo={onChooseUbigeo}
      />
      <ConfirmPass
        show = {showConfirmPass}
        setShow = {setShowConfirmPass}
        onSuccess = {onSuccessConfirmPass}
      />
    </div>
  )
}
