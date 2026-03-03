export default async function SharePage({
  searchParams,
}: {
  searchParams: Promise<{ title?: string; text?: string; url?: string }>;
}) {
  const { title, text, url } = await searchParams;

  // If url isn't provided, sometimes shared "text" contains a URL. We'll be strict for V1.
  const sharedUrl = url ?? "";

  // Redirect to home with prefilled params so UI can show Add modal.
  const qs = new URLSearchParams();
  if (sharedUrl) qs.set("prefillUrl", sharedUrl);
  if (title) qs.set("prefillTitle", title);
  if (text) qs.set("prefillText", text);

  return (
    <html>
      <head>
        <meta httpEquiv="refresh" content={`0;url=/?${qs.toString()}`} />
      </head>
      <body />
    </html>
  );
}