export default function LabLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div>
            <h1>These are Experiments.</h1>
            <main>{children}</main>
        </div>
    );
}