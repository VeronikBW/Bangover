import { Navigate, Outlet, useLocation } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const AdminRoute = () => {
    const { store } = useGlobalReducer();
    const location = useLocation();

    if (!store.token || !store.user) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    if (store.user.role !== "admin") {
        return <Navigate to="/profile" replace />;
    }

    return <Outlet />;
};
