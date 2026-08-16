import Nav from "@/app/_components/Nav";

const links = [
    { href: "/dashboard", label: "Overview" },
    { href: "/dashboard/settings", label: "Settings" },
    { href: "/admin", label: "Admin" },
];

export default function DashboardNav() {
    return (
        <div className="dash-topbar">
            <Nav links={links} />
        </div>
    );
}
