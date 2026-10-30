import { SiteFooter } from "@/components/footer";
import { Sprechzeiten } from "@/components/sprechzeiten";
import { getFooter } from "@/lib/footer";
import { getSprechzeiten } from "@/lib/sprechzeiten";

export async function SiteEnd() {
  const [sprechzeiten, footer] = await Promise.all([getSprechzeiten(), getFooter()]);

  return (
    <>
      <Sprechzeiten sprechzeiten={sprechzeiten} />
      <SiteFooter footer={footer} />
    </>
  );
}
