type PageProps = {
    params: Promise<{ id: string}>;
}

export default async function ProductPage({ params }: PageProps) {

    const { id } = await params;

    return (
        <h1>You are looking at product {id}</h1>
    );
}