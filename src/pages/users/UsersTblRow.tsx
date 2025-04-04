import useUsersStore from "../../core/store/useUsersStore";
import { Badge } from "react-bootstrap";
import { CampoUserT, UserT } from "../../core/types";
import { format, isValid, parseISO } from "date-fns";

interface UsersTblRowProps {
  user: UserT ;
  camposUser: CampoUserT[]
}

function UsersTblRow({ user, camposUser }: UsersTblRowProps) {

  const setCurrentUserId = useUsersStore(state => state.setCurrentUserId)
  const setShowUserFormMdl = useUsersStore(state => state.setShowUserFormMdl)


  const validDate = (date:string, formato = "dd/MM/yyyy") => {
    return isValid(parseISO(date)) ? format(date, formato) : ''
  }

  const handleToEdit = () => {
    setCurrentUserId(user.id)
    // setUserFormChange({name: "id", value: user.id.toString()})
    setShowUserFormMdl(true)
  }

  return (
    <tr className="text-nowrap" onClick={handleToEdit}>
      {camposUser.map(el => {
        const {campo_name, show} = el

        if(show){
          if(campo_name === "estado"){
            return <td key={campo_name}> {user.estado == 0
              ? <Badge bg="danger">Deshabilitdo</Badge>
              : <Badge bg="success">Habilitado</Badge>} </td>
          }else if(campo_name === "created_at" || campo_name === "updated_at" ){
            return <td key={campo_name}>{validDate(user[campo_name], 'dd/MM/yyyy')}</td>
          }else{
            return <td key={campo_name}>{user[campo_name as keyof UserT]}</td>
          }
        }
      })}
    </tr>
  );
}

export const UsersTblRowCampos = () => {

}

export default UsersTblRow;
