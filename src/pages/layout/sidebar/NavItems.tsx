import { memo } from "react";
import NavItem from "./NavItem";

interface Props {
  modulosTree: any;
}

const NavItems:React.FC<Props> = memo(({ modulosTree}) => {
  return <ul> {modulosTree.map((item:any) => (
    <NavItem
      key={item.id}
      item={item}
    />
  ))} </ul>;
})
export default NavItems