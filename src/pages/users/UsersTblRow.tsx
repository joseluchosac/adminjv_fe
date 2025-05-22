import useUsersStore from "../../core/store/useUsersStore";
import { Badge } from "react-bootstrap";
import { CampoTable, User } from "../../core/types";
import { format, isValid, parseISO } from "date-fns";

interface UsersTblRowProps {
  user: User ;
  camposUser: CampoTable[]
}

function UsersTblRow({ user, camposUser }: UsersTblRowProps) {

  const setCurrentUserId = useUsersStore(state => state.setCurrentUserId)
  const setShowUserFormMdl = useUsersStore(state => state.setShowUserFormMdl)


  const validDate = (date:string | undefined, formato = "dd/MM/yyyy") => {
    if(!date) return ''
    return isValid(parseISO(date)) ? format(date, formato) : ''
  }

  const handleToEdit = () => {
    setCurrentUserId(user.id)
    setShowUserFormMdl(true)
  }

  return (
    <tr className="text-nowrap" onClick={handleToEdit}>
      {camposUser.map(el => {
        const {fieldname, show} = el

        if(show){
          if(fieldname === "estado"){
            return <td key={fieldname}> {user.estado == 0
              ? <Badge bg="danger">Deshabilitdo</Badge>
              : <Badge bg="success">Habilitado</Badge>} </td>
          }else if(fieldname === "created_at" || fieldname === "updated_at" ){
            return <td key={fieldname}>{validDate(user[fieldname], 'dd/MM/yyyy')}</td>
          }else{
            return <td key={fieldname}>{user[fieldname as keyof User]}</td>
          }
        }
      })}
    </tr>
  );
}

export default UsersTblRow;
