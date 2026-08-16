import Nav from "@/app/_components/Nav";

// Reuses the same Nav client component as the marketing header.
// Different links, same active-highlighting behaviour — write it once,
// use it everywhere.
const links = [
    { href: "/dashboard/settings", label: "General" },
    { href: "/dashboard/settings/profile", label: "Profile" },
];

export default function SettingsSubNav() {
    return (
        <div className="sub-nav">
            <Nav links={links} />
        </div>
    );
}
