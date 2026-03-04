export const dynamic = "force-dynamic";
export const revalidate = 0;

import ShareClient from "./share-client";

export default function SharePage({
  searchParams,
}: {
  searchParams: { url?: string; title?: string; text?: string };
}) {
  const url = searchParams?.url ?? "";
  const title = searchParams?.title ?? "";
  const text = searchParams?.text ?? "";

  return <ShareClient url={url} title={title} text={text} />;
}