import { createUserAction } from "@/app/actions/users";


export default function CreateUser() {

    return (
        <form action={createUserAction}>
            <input type="text" name="username" placeholder="Enter username" />
            <input type="text" name="name" placeholder="Enter name" />
            <input type="email" name="email" placeholder="Enter email" />
            <select name="role">
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
            </select>
            <button type="submit">Create User</button>
        </form>
    );

}