import { useEffect, useRef } from 'react';
import Sortable from 'sortablejs';
import DynaIcon from '../../core/components/DynaComponents';
import { ModuloT } from '../../core/types';
interface Props {
  modulosTree: ModuloT[];
  setModulosTree: React.Dispatch<React.SetStateAction<ModuloT[] | null>>;
  toEdit: (id: number) => void;
  setIsSorted: (par: boolean) => void;
}

const ModulosTree: React.FC<Props> = ({modulosTree, setModulosTree, toEdit, setIsSorted}) => {

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
          const padre_id = parseInt(evt.item.dataset.padre_id as string)
          const newItems = [...modulosTree];
          const [movedItem] = newItems.splice(evt.oldIndex!, 1);
          newItems.splice(evt.newIndex!, 0, movedItem);
          if(padre_id == 0){
            setModulosTree(newItems);
          }else{
            setModulosTree((prevItems) => {
              const idx = prevItems?.findIndex((el:ModuloT) => el.id === padre_id) as number
              const prevItemsClone = structuredClone(prevItems) as ModuloT[]
              prevItemsClone[idx].children = newItems
              return prevItemsClone
            })
          }
          setIsSorted(true)
        },
      });
      return () => { sortable.destroy(); };
    }
  }, [modulosTree, setModulosTree]);

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
                <ModulosTree modulosTree={el.children} setModulosTree={setModulosTree} toEdit={toEdit} setIsSorted={setIsSorted}/>
                </details>
            }
          </li>
        )
      })}
    </ul>


  )
}

export default ModulosTree