import { Tab, Tabs} from "react-bootstrap";
import { useState } from "react";
import EmpresaConfig from "./EmpresaConfig";
import ApisConsulta from "./ApisConsulta";
import SunatCpe from "./SunatCpe";
import SeriesConfig from "./SeriesConfig";

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
          {tabKey === "empresa" && <EmpresaConfig />}
        </Tab>
        <Tab eventKey="series" title="Series">
          {tabKey === "series" && <SeriesConfig />}
        </Tab>
        <Tab eventKey="sunat_cpe" title="Sunat CPE">
          {tabKey === "sunat_cpe" && <SunatCpe />}
        </Tab>
        <Tab eventKey="apis_consulta" title="Apis consulta">
          {tabKey === "apis_consulta" && <ApisConsulta />}
        </Tab>
      </Tabs>
    </div>
  );
}
