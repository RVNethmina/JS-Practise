import SettingsSubNav from "./SettingsSubNav";

// ─────────────────────────────────────────────────────────────────────────
// THE WRAPPER CHAIN (Problem 4 asked you to write this out)
//
// Visiting /dashboard/settings/profile builds this, outermost first:
//
//   RootLayout                  app/layout.tsx           <html> + <body>
//     └─ DashboardLayout        app/dashboard/layout.tsx sidebar + topbar
//          └─ SettingsLayout    THIS FILE                settings sub-nav
//               └─ ProfilePage  .../profile/page.tsx     the content
//
// THREE layouts wrap that one page.
//
// Note there is NO layout for the (marketing) or (shop) groups in this
// chain — /dashboard isn't inside either of them.
// ─────────────────────────────────────────────────────────────────────────

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
