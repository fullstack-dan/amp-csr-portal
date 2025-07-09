import { House, ClipboardList, Users } from "lucide-react";
import { Link } from "react-router";

function NavLink({ href, icon: Icon, children }) {
    return (
        <Link
            to={href}
            className=" hover:bg-blue-950 flex flex-col items-center justify-center p-6 transition duration-200 ease-in-out"
        >
            <Icon />
            {children}
        </Link>
    );
}

export default function Navbar() {
    return (
        <nav className="flex justify-center md:justify-start md:flex-col md:max-w-[7rem] w-full  bg-blue-900 text-white">
            <NavLink href="/" icon={House}>
                Home
            </NavLink>
            <NavLink href="/requests" icon={ClipboardList}>
                Requests
            </NavLink>
            <NavLink href="/users" icon={Users}>
                Users
            </NavLink>
        </nav>
    );
}
