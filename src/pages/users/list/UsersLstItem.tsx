import { format, isValid, parseISO } from "date-fns";
import { FaEdit, FaToggleOff, FaToggleOn, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { MutationUserResp, UserItem } from "../../../app/types";
import { useUsers } from "../context/UsersContext";
import useLayoutStore from "../../../app/store/useLayoutStore";
import { useMutationUsersQuery } from "../../../api/queries/useUsersQuery";
import { useNavigate } from "react-router-dom";

interface Props {
  user: UserItem ;
}

function UsersLstItem({ user }: Props) {
  const { stateUsers: {camposUser} } = useUsers()
  const navigate = useNavigate()
  const darkMode = useLayoutStore(state => state.layout.darkMode)

  const {
    data: mutationResp,
    isPending: isPendingMutation,
    setStateUser,
    deleteUser, 
  } = useMutationUsersQuery<MutationUserResp>()

  const validDate = (date:string | undefined, formato = "dd/MM/yyyy") => {
    if(!date) return ''
    return isValid(parseISO(date)) ? format(date, formato) : ''
  }

  const handleToEdit = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    navigate(`${location.pathname}?edit=${user.id}`);
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
    setStateUser({estado: user.estado ? 0 : 1, id: user.id})
  }


  useEffect(() => {
    if(!mutationResp) return
    toast(mutationResp.msg, {type: mutationResp.msgType})
  }, [mutationResp])

  return (
    <tr className="text-nowrap">
      {camposUser.filter(el=>el.show).map(el => {
        switch (el.field_name){
          case "acciones": {
            return (
              <td key={el.field_name}>
                <div className="d-flex gap-2 justify-content-start position-relative">
                  <div className={`position-absolute w-100 h-100 ${!isPendingMutation ? 'd-none' : ''}`} style={{backgroundColor: "rgb(0,0,0,0.1)"}}></div>
                  <a onClick={handleToEdit} href="#" title="Editar">
                    <FaEdit />
                  </a>
                  <a onClick={handleDelete} href="#" title="Eliminar">
                    <FaTrash className="text-danger"/>
                  </a>
                  {user.estado == 0
                    ? <div role="button" onClick={toggleEstado} title="Habilitar" data-estado="0">
                        <FaToggleOff className="text-muted" size={"1.3rem"} />
                      </div>
                    : <div role="button" onClick={toggleEstado} title="Deshabilitar" data-estado="1">
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
            return (
              <td key={el.field_name} className={`${user.estado == 0 ? 'text-body-tertiary' : ''}`}>
                {user[el.field_name as keyof UserItem]}
              </td>
            )
          }
        }
      })}
    </tr>
  );
}

export default UsersLstItem;
