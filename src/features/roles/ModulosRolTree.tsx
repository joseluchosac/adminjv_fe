import { useRef } from 'react';
// import Sortable from 'sortablejs';
import DynaIcon from '../../app/components/DynaComponents';
import { Modulo } from '../../app/types';
interface Props {
  itemsTree: Modulo[];
  setItemsTree: React.Dispatch<React.SetStateAction<Modulo[] | null>>;
  toggleAssign: (id:number) => void;
}

const ModulosRolTree: React.FC<Props> = ({itemsTree, setItemsTree, toggleAssign}) => {

  const listRef = useRef<HTMLUListElement>(null);

  const toggleClick = (id: number) => {
    toggleAssign(id)
  }

  return (
    <ul ref={listRef} style={{paddingInlineStart: "20px"}}>
      {itemsTree.map((el)=>{
        return (
          <li 
            key={el.id} 
            data-padre_id={el.padre_id} 
            className='list-group-item'
          >
            {
              (el.children.length == 0)
              ? <div className='d-flex gap-2 mb-1'>
                  <div>&nbsp;&nbsp;&nbsp;{el.descripcion}</div>
                  <span onClick={()=>toggleClick(el.id)} role='button'>
                    {
                      el.assign
                      ? <DynaIcon name='FaToggleOn' className='text-primary fs-4' />
                      : <DynaIcon name='FaToggleOff' className='text-secondary fs-4' />
                    }
                  </span>
                </div> 
              : <details>
                <summary className='d-flex gap-2 mb-1'>
                  <div>+ {el.descripcion}</div>

                </summary>
                <ModulosRolTree 
                  itemsTree={el.children} 
                  setItemsTree={setItemsTree} 
                  toggleAssign={toggleAssign}
                />
                </details>
            }
          </li>
        )
      })}
    </ul>


  )
}

export default ModulosRolTree