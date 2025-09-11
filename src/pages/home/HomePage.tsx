import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import Edit from "./Edit";
import Lista from "./Lista";
import View from "./View";

export default function HomePage() {
  const location = useLocation()

  const idEdit = useMemo(() => {
    const params = new URLSearchParams(location.search)
    return params.get('edit')
  }, [location])

  const idView = useMemo(() => {
    const params = new URLSearchParams(location.search)
    return params.get('view')
  }, [location])

  return (
    <>
      <Lista show={!!idEdit || !!idView} />
      <Edit id={idEdit}/>
      <View id={idView}/>
    </>
  )
}
