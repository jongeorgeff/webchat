import { createContext } from "react";

const UserContext = createContext({
	username: null,
	token: null
});

export default UserContext;
