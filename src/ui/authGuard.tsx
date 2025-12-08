import type { FunctionComponent } from "react"
import { useNavigate } from "react-router"

import { useAuthMeQuery } from "query/api/appApi.api"


export const authGuard = (children: FunctionComponent) => {
    const { isLoading, data: user, isError } = useAuthMeQuery(undefined)
    const navigate = useNavigate()

    if (isError) {
        navigate("/auth")
    }

    if (isLoading) {
        return null;
    }

    if (user) {
        return children;
    }

    return null
}