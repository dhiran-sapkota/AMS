import { useAuth } from "@/contexts/AuthContext"
import { routes } from "@/data/routes"
import { useEffect } from "react"
import { Params, useLocation, useNavigate, useParams } from "react-router-dom"

const isRouteAllowed = (route: string, params: Readonly<Params<string>>, allowedRoles: string[]) => {

    if(Object.keys(params).length > 0) {
        route = `${route.split('/').slice(0, -1).join('/')}`
    }
    return allowedRoles.includes(route)
}

const AuthorizeRoute = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate()
    const location = useLocation()
    const params = useParams()
    const { isLoading, user, isAuthenticated } = useAuth()
    if (isLoading) {
        return null
    }

    useEffect(() => {
        if (user) {
            const allowedRoutes = routes[user.role as keyof typeof routes].map((route) => route.path)
            if (!isRouteAllowed(location.pathname, params, allowedRoutes)) {
                if (isAuthenticated) {
                    navigate(allowedRoutes[0])
                } else {
                    navigate("/login")
                }
            }
        }

    }, [user])

    return <>{children}</>

}

export default AuthorizeRoute