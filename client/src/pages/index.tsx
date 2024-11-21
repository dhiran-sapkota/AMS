import { useAuth } from "@/contexts/AuthContext"
import { routes } from "@/data/routes"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

const Homepage = () => {
    const navigate = useNavigate()
    const { isLoading, user } = useAuth()
    const allowedRoutes = routes[user?.role as keyof typeof routes].map((route) => route.path)

    useEffect(() => {
        if (user?.role === "super_admin") {
            navigate(allowedRoutes[0])
        }

        if (user?.role === "artist_manager") {
            console.log("does it reach here", allowedRoutes[0])
            navigate(allowedRoutes[0])
        }

        if (user?.role === "artist") {
            navigate(allowedRoutes[0])
        }
    }, [user])

    if (isLoading) {
        return null
    }

    return null
}

export default Homepage