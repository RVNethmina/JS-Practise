import SettingsSubNav from "./SettingsSubNav";

export default function SettingsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div>
            <h2>Settings</h2>
            <SettingsSubNav />
            <div>{children}</div>
        </div>
    );
}
