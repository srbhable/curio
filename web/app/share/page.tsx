// web/app/share/page.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;

import ShareClient from "./share-client";

export default function SharePage({
  searchParams,
}: {
  searchParams?: { url?: string };
}) {
  const url = searchParams?.url ?? "";
  return <ShareClient url={url} />;
}