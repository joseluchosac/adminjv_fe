import useTablas from "../../core/hooks/useTablas";
import HomeReactSelect from "./HomeReactSelect";

export default function Home() {
  const {rols, isFetching} = useTablas();

  return (
    <div>
      <HomeReactSelect />
      {isFetching && <h4>Cargando...</h4>}
      <ul>
        {rols && rols.map(el=><li key={el.id}>{el.rol}</li>)}

      </ul>
    </div>
  );
}
