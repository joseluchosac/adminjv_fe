import { Tab, Tabs} from "react-bootstrap";
import { useState } from "react";
import ApisConsulta from "./ApisConsulta";
import SunatCpe from "./SunatCpe";
import Emails from "./emails/Emails";
import Empresa from "./empresa/Empresa";
import Sucursales from "./sucursales/Sucursales";
import Terminales from "./Terminales";

export default function Config() {
  const [tabKey, setTabKey] = useState('empresa');

  return (
    <div style={{maxWidth: "991.98px"}} className="mx-auto">
      <Tabs
        id="controlled-tab-example"
        activeKey={tabKey}
        onSelect={(k) => setTabKey(() => k ? k : "")}
        className="mb-3"
      >
        <Tab eventKey="empresa" title="Empresa">
          {tabKey === "empresa" && <Empresa />}
        </Tab>
        <Tab eventKey="sucursales" title="Sucursales">
          {tabKey === "sucursales" && <Sucursales />}
        </Tab>
        <Tab eventKey="sunat_cpe" title="Sunat CPE">
          {tabKey === "sunat_cpe" && <SunatCpe />}
        </Tab>
        <Tab eventKey="emails" title="Correos">
          {tabKey === "emails" && <Emails />}
        </Tab>
        <Tab eventKey="apis_consulta" title="Apis consulta">
          {tabKey === "apis_consulta" && <ApisConsulta />}
        </Tab>
        <Tab eventKey="terminal" title="Terminal">
          {tabKey === "terminal" && <Terminales />}
        </Tab>
      </Tabs>
    </div>
  );
}
