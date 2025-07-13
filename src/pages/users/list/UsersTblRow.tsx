import { format, isValid, parseISO } from "date-fns";
import { FaEdit, FaToggleOff, FaToggleOn, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { CampoTable, ResponseQuery, User, UserItem } from "../../../core/types";
import { useUsers } from "../context/UsersContext";
import useLayoutStore from "../../../core/store/useLayoutStore";
import { useMutationUsersQuery } from "../../../core/hooks/useUsersQuery";

interface UsersTblRowProps {
  user: UserItem ;
  camposUser: CampoTable[]
}
interface DataMutation extends ResponseQuery {content: User}

function UsersTblRow({ user, camposUser }: UsersTblRowProps) {
  const {setCurrentUserId, setShowUserForm} = useUsers()
  const darkMode = useLayoutStore(state => state.layout.darkMode)

  const {
    data: mutation,
    isPending: isPendingMutation,
    setStateUser,
    deleteUser, 
  } = useMutationUsersQuery<DataMutation>()

  const validDate = (date:string | undefined, formato = "dd/MM/yyyy") => {
    if(!date) return ''
    return isValid(parseISO(date)) ? format(date, formato) : ''
  }

  const handleToEdit = () => {
    setCurrentUserId(user.id)
    setShowUserForm(true)
  }

  const handleDelete = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    Swal.fire({
      icon: 'question',
      text: `¿Desea eliminar al usuario ${user.username}?`,
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: 'Cancelar',
      customClass: { 
        popup: darkMode ? 'swal-dark' : ''
      }
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUser(user.id)
      }
    });
  }

  const toggleEstado = () => {
    setStateUser(user.estado ? 0 : 1)
  }


  useEffect(() => {
    if(!mutation) return
    toast(mutation.msg, { type: mutation.msgType})
  }, [mutation])

  return (
    <tr className="text-nowrap">
      {camposUser.filter(el=>el.show).map(el => {
        switch (el.field_name){
          case "acciones": {
           if(isPendingMutation) return <td key={el.field_name}>...</td>  
            return (
              <td key={el.field_name}>
                <div className="d-flex gap-2 justify-content-start">
                  <a onClick={handleToEdit} href="#" className="" title="Editar">
                    <FaEdit />
                  </a>
                  <a onClick={handleDelete} href="#" className="" title="Eliminar">
                    <FaTrash className="text-danger"/>
                  </a>
                  {user.estado == 0
                    ? <div role="button" className="" onClick={toggleEstado} title="Habilitar" data-estado="0">
                        <FaToggleOff className="text-muted" size={"1.3rem"} />
                      </div>
                    : <div role="button" className="" onClick={toggleEstado} title="Deshabilitar" data-estado="1">
                        <FaToggleOn className="text-primary" size={"1.3rem"} />
                      </div>
                  }
                </div>
              </td>
            )
          }
          case "created_at":
          case "updated_at": {
            return <td key={el.field_name}>{validDate(user[el.field_name ], 'dd/MM/yyyy')}</td>
          }
          default: {
            return <td key={el.field_name}>{user[el.field_name as keyof UserItem]}</td>
          }
        }
      })}
    </tr>
  );
}

export default UsersTblRow;
