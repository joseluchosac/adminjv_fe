import UserForm from "./UserForm";
import { UsersProvider } from "./context/UsersContext";
import UsersLst from "./list/UsersLst";

export default function Users(){
  return (
    <UsersProvider>
      <UsersLst />
      <UserForm />
    </UsersProvider>
  );
}