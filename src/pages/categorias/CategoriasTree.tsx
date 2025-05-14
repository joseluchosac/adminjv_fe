import { useEffect, useRef } from "react";
import DynaIcon from "../../core/components/DynaComponents";
import { Categoria } from "../../core/types"
import Sortable from "sortablejs";

type Props = {
  categoriasTree: Categoria[];
  toEdit: (id: number) => void;
  sortCategorias: (orderedItems: Categoria[]) => void;
}

export default function CategoriasTree({categoriasTree,  toEdit, sortCategorias}: Props) {

  const listRef = useRef<HTMLUListElement>(null);

  const handleEdit = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    e.preventDefault()
    toEdit(parseInt(e.currentTarget.dataset.id as string))
  }

  useEffect(() => {
    if (listRef.current) {
      const sortable = Sortable.create(listRef.current, {
        animation: 100,
        onEnd: (e) => {
          if(e.newIndex === e.oldIndex) return
          const newItems = [...categoriasTree];
          const [movedItem] = newItems.splice(e.oldIndex!, 1);
          newItems.splice(e.newIndex!, 0, movedItem);
          let orderedItems = newItems.map((el, idx) => {
            el.orden = idx + 1
            return el
          })
          sortCategorias(orderedItems)
        },
      });
      return () => { sortable.destroy(); };
    }
  }, [categoriasTree]);

  return (
      <ul ref={listRef} style={{paddingInlineStart: "20px"}}>
        {categoriasTree.map(el => (
          <li
            key={el.id}
            data-padre_id={el.padre_id}
            className='list-group-item'
          >
            {
              el.children.length === 0
              ? <div className='d-flex gap-2 mb-1'>
                  <div>&nbsp;&nbsp;&nbsp;{el.descripcion}</div>
                  <span onClick={handleEdit} data-id={el.id} role='button'><DynaIcon name='FaEdit' className='text-success' /></span>
                </div>
              : <details>
                  <summary className='d-flex gap-2 mb-1'>
                    <div>+ {el.descripcion}</div>
                    <span onClick={handleEdit} data-id={el.id}><DynaIcon name='FaEdit' className='text-success' /></span>
                  </summary>
                  <CategoriasTree
                    categoriasTree={el.children}
                    toEdit={toEdit}
                    sortCategorias={sortCategorias}
                  />
                </details>
            }
          </li>
        ))}
      </ul>
    )
}
