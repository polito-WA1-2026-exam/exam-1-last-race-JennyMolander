import { Outlet } from "react-router";
import Header from "./Header";
import Footer from "./Footer";

function MainLayout() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <Header></Header>
            <main className="grow">
                <Outlet />
            </main>
            <Footer></Footer>
        </div>
    )
}

export default MainLayout;