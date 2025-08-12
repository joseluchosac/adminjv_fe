import { memo } from "react";
import SidebarNavItem from "./SidebarNavItem";

interface Props {
  modulosTree: any;
}

const SidebarNavItems:React.FC<Props> = memo(({ modulosTree}) => {
  return <ul> {modulosTree.map((item:any) => (
    <SidebarNavItem
      key={item.id}
      item={item}
    />
  ))} </ul>;
})
export default SidebarNavItems