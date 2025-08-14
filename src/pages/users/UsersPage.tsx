import { UsersProvider } from "./context/UsersContext";
import UsersLst from "./list/UsersLst";
import Userform from "./UserForm";

export default function UsersPage(){
  return (
    <UsersProvider>
      <UsersLst />
      <Userform />
    </UsersProvider>
  );
}