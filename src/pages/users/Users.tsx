import UserForm from "./UserForm";
import UsersTbl from "./UsersTbl";
import { UsersProvider } from "./context/UsersContext";
import UsersHead from "./UsersHead";
import UsersLstFilterMdl from "./UsersLstFilterMdl";

export default function Users(){
  return (
    <UsersProvider>
      <UsersHead />
      <UsersTbl />
      <UsersLstFilterMdl />
      <UserForm />
    </UsersProvider>
  );
}