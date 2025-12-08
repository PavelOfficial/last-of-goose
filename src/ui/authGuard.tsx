import type { FunctionComponent } from "react";
import { useNavigate, useMatch } from "react-router";


import { useAuthMeQuery } from "query/api/appApi.api";
import { useAppSelector } from "../store/hooks";

export const authGuard = (ChildElement: FunctionComponent) => {
    return () => {
        const token = useAppSelector(state => state.app.token)
        const { isLoading, data: user, isError } = useAuthMeQuery(token)
        const navigate = useNavigate();
        const matchToAuth = useMatch("/auth")

        if (isError && !matchToAuth) {
            navigate("/auth")
            return null;
        }

        if (isLoading) {
            return null;
        }

        if (user && matchToAuth && !!token) {
            navigate("/rounds");
            return null;
        }

        return <ChildElement />;
    }
}