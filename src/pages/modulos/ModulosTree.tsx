import { useEffect, useRef } from 'react';
import Sortable from 'sortablejs';
import DynaIcon from '../../app/components/DynaComponents';
import { Modulo } from '../../app/types';
interface Props {
  modulosTree: Modulo[];
  toEdit: (id: number) => void;
  sortModulos: (itemsOrdered: Modulo[]) => void;
}

const ModulosTree: React.FC<Props> = ({modulosTree, toEdit, sortModulos}) => {

  const listRef = useRef<HTMLUListElement>(null);

  const handleEdit = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    e.preventDefault()
    toEdit(parseInt(e.currentTarget.dataset.id as string))
  }

  useEffect(() => {
    if (listRef.current) {
      const sortable = Sortable.create(listRef.current, {
        animation: 100,
        onEnd: (evt) => {
          const newItems = [...modulosTree];
          const [movedItem] = newItems.splice(evt.oldIndex!, 1);
          newItems.splice(evt.newIndex!, 0, movedItem);
          let orderedItems = newItems.map((el, idx) => {
            el.orden = idx + 1
            return el
          })
          sortModulos(orderedItems)
        },
      });
      return () => { sortable.destroy(); };
    }
  }, [modulosTree]);

  return (
    <ul ref={listRef} style={{paddingInlineStart: "20px"}}>
      {modulosTree.map((el)=>{
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
                  <span onClick={handleEdit} data-id={el.id} role='button'><DynaIcon name='FaEdit' className='text-success' /></span>
                </div> 
              : <details>
                <summary className='d-flex gap-2 mb-1'>
                  <div>+ {el.descripcion}</div>
                  <span onClick={handleEdit} data-id={el.id}><DynaIcon name='FaEdit' className='text-success' /></span>
                </summary>
                <ModulosTree
                  modulosTree={el.children}
                  toEdit={toEdit}
                  sortModulos={sortModulos}
                />
                </details>
            }
          </li>
        )
      })}
    </ul>


  )
}

export default ModulosTree