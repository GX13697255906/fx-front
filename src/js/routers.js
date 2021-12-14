import Login from '@/components/Login';
import Layout from "@/components/Layout";

const routers = {
    routes:
        [
            {
                path: "/",
                name: "layout",
                component: Layout
            },
            {
                path: "/layout",
                name: "layout",
                component: Layout
            },
            {
                path: "/login",
                name: "login",
                component: Login
            }

        ]
};

export default routers;
