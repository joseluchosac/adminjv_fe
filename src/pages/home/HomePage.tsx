import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import Edit from "./Edit";
import Lista from "./Lista";
import View from "./View";

export default function HomePage() {
  const location = useLocation()

  const showList = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.size
  },[location])

  

  return (
    <>
      <Lista show={!!showList} />
      <Edit />
      <View />
    </>
  )
}
