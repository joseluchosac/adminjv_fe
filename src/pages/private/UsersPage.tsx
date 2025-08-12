import UserForm from "../../features/users/UserForm";
import { UsersProvider } from "../../features/users/context/UsersContext";
import UsersLst from "../../features/users/list/UsersLst";

export default function UsersPage(){
  return (
    <UsersProvider>
      <UsersLst />
      <UserForm />
    </UsersProvider>
  );
}