import { Tab, Tabs} from "react-bootstrap";
import { useState } from "react";
import Empresa from "./Empresa";
import Otros from "./Otros";

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
      </Tabs>
    </div>
  );
}
