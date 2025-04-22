import { Tab, Tabs} from "react-bootstrap";
import { useState } from "react";
import Empresa from "./Empresa";
import Otros from "./Otros";
import ApisNroDoc from "./ApisNroDoc";
import SunatCpe from "./SunatCpe";

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
        <Tab eventKey="otros" title="Otros">
          {tabKey === "otros" && <Otros />}
        </Tab>
        <Tab eventKey="sunat_cpe" title="Sunat CPE">
          {tabKey === "sunat_cpe" && <SunatCpe />}
        </Tab>
        <Tab eventKey="apis_nro_doc" title="Apis consulta">
          {tabKey === "apis_nro_doc" && <ApisNroDoc />}
        </Tab>
      </Tabs>
    </div>
  );
}
