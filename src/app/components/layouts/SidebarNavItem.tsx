import { useRef } from "react";
import { Link } from "react-router-dom";
import DynaIcon from "../DynaComponents";

interface Props {
  item: any;
}

const SidebarNavItem:React.FC<Props> = ({ item }) => {
  const ulRef= useRef<HTMLUListElement>(null)
  const chevronRef = useRef<HTMLDivElement>(null)
  const handleCollapse = (e:React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (item.children.length) {
      if (ulRef.current?.clientHeight === 0) {
        ulRef.current?.clientHeight
        ulRef.current.style.maxHeight = ulRef.current.scrollHeight + "px";
        if(chevronRef.current){
          chevronRef.current.style.transform = 'rotate(180deg)'
        }
      } else {
        if(ulRef.current){
          ulRef.current.style.maxHeight = "0px";  
        }
        if(chevronRef.current){
          chevronRef.current.style.transform = 'rotate(0deg)'
        }
      }
    } else {
      document.body.classList.remove('sidebar-show-responsive')
    }
  };

  return (
    <li
      className={`nav-item ${item.children.length ? 'parent ' : ''}`}
    >
      {item.children.length 
        ?       
      <a onClick={handleCollapse} className={`nav-link${(item.active) ? ' active-parent' : ''}`}>
        <DynaIcon name={item.icon_menu} className="icon" />
        <span> {item.descripcion} </span>
        <div ref={chevronRef} className="chevron" style={{transform: item.active ? 'rotate(180deg)' : 'rotate(0deg)'}} >
          <DynaIcon name="FaChevronDown"/>
        </div>
      </a> 
        :
      <Link to={item.nombre} className={`nav-link${(item.active) ? ' active' : ''}`} data-nombre={item.nombre}>
        <DynaIcon name={item.icon_menu} className="icon"/>
        <span> {item.descripcion} </span>
      </Link>
      }

      {Boolean(item.children.length) && (
        <ul
          className={`overflow-hidden`} 
          style={{maxHeight: item.active ? '1000px' : '0px'}}
          ref={ulRef}
        >
          {item.children.map((el:any) => (
            <SidebarNavItem
              key={el.id}
              item={el}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export default SidebarNavItem