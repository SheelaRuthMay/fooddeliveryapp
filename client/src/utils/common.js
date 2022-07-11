import React from "react";
import { Navigate, Outlet } from 'react-router-dom';

export const CheckAuth = () => {
    if (sessionStorage.getItem('isAuthorized')) {
        return true;
    }
    return false;
}

export const PrivateRoutes = () => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    return (
        <>
            {isAuthenticated ? (<Outlet />) : (<Navigate to='/menu' />)}
        </>
    )
}

export const PublicRoutes = () => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    return (
        <>
            {isAuthenticated ? (<Navigate to='/menu' />) : (<Outlet />)}
        </>
    )
}

export const AdminRoutes = () => {
    const isAuthenticatedAdmin = localStorage.getItem("isAuthenticatedAdmin");
    return (
        <>
            {isAuthenticatedAdmin ? (<Outlet />) : (<Navigate to='/menu' />)}
        </>
    )
}