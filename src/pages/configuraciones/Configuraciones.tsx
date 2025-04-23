import { Tab, Tabs} from "react-bootstrap";
import { useState } from "react";
import Empresa from "./Empresa";
import ApisConsulta from "./ApisConsulta";
import SunatCpe from "./SunatCpe";
import EmailConfig from "./EmailConfig";

export default function Configuraciones() {
  const [tabKey, setTabKey] = useState('empresa');

  return (
    <div style={{maxWidth:"892px"}} className="mx-auto">
      <Tabs
        id="controlled-tab-example"
        activeKey={tabKey}
        onSelect={(k) => setTabKey(() => k ? k : "")}
        className="mb-3"
      >
        <Tab eventKey="empresa" title="Empresa">
          {tabKey === "empresa" && <Empresa />}
        </Tab>
        <Tab eventKey="sunat_cpe" title="Sunat CPE">
          {tabKey === "sunat_cpe" && <SunatCpe />}
        </Tab>
        <Tab eventKey="apis_consulta" title="Apis consulta">
          {tabKey === "apis_consulta" && <ApisConsulta />}
        </Tab>
        <Tab eventKey="email" title="Correo">
          {tabKey === "email" && <EmailConfig />}
        </Tab>
      </Tabs>
    </div>
  );
}
