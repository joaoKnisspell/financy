import Navbar from "@/components/shared/navbar/navbar";
import { Outlet } from "react-router";

export default function DefaultLayout() {
    return (
        <div className="w-screen h-screen bg-gray-100">
            <Navbar />
            <main className="flex flex-col w-full max-w-[1184px] mx-auto pt-12">
                <Outlet />
            </main>
        </div>
    )
}