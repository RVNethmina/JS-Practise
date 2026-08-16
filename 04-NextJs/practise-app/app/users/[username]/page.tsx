type PageProps = {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Username({ params, searchParams }: PageProps) {
  const { username } = await params;
  const query = await searchParams;

  // ?tab=a&tab=b gives an ARRAY, so narrow it to a single string first.
  const tab = Array.isArray(query.tab) ? query.tab[0] : query.tab;

  return (
    <div>
      <h1>Username is: {username}</h1>
      {/* use the narrowed `tab`, not query.tab */}
      <h2>Showing tab: {tab ?? "no tab"}</h2>
    </div>
  );
}
