import { Suspense } from "react";
import { SiteEnd } from "@/components/site-end";

export default function NotFound() {
  return (
    <>
      <main className="px-gutter py-20">
        <h1 className="text-ink">Seite nicht gefunden</h1>
      </main>
      <Suspense fallback={null}>
        <SiteEnd />
      </Suspense>
    </>
  );
}
