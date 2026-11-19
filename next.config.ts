import type { NextConfig } from "next";

// Squarespace paths that have no matching page on this site.
// Next.js matches the percent-encoded request pathname, and path-to-regexp
// treats "+" as a modifier, so redirects() encodes these exact paths.
const cutoverRedirects: ReadonlyArray<{
  source: string;
  destination: string;
}> = [
  { source: "/welcome-marquee", destination: "/" },
  { source: "/start", destination: "/" },
  { source: "/home-1", destination: "/" },
  { source: "/teamm", destination: "/team" },
  { source: "/news/category/Öffnungszeiten", destination: "/news" },
  { source: "/news/tag/Feiertage", destination: "/news" },
  { source: "/news/tag/Öffnungszeiten", destination: "/news" },
  { source: "/news/tag/Dr.+Michael+Hück", destination: "/news" },
  { source: "/news/tag/Dr.+Günter+Hück", destination: "/news" },
  { source: "/news/2026/10/9/schne-herbstferien", destination: "/news/schoene-herbstferien" },
  { source: "/news/2026/6/25/herzlichen-glckwunsch-kiana", destination: "/news/kiana-freisprechung" },
  { source: "/news/2024/11/20/if-its-not-clean-its-not-cleen", destination: "/news/cleen-zahngel" },
  { source: "/news/2024/12/18/graphy-aligner", destination: "/news/graphy-aligner" },
  { source: "/news/2023/3/1/frhlingsbeginn", destination: "/news/fruehlingsbeginn" },
  { source: "/news/2023/2/16/helau-und-alaaf-2023", destination: "/news/helau-und-alaaf-2023" },
  { source: "/news/2022/9/19/firmenlauf-2022", destination: "/news/firmenlauf-2022" },
  { source: "/news/2022/7/5/praxisausflug-2022-meenz-goes-klle", destination: "/news/praxisausflug-2022-meenz-goes-klle" },
  {
    source: "/news/2022/7/5/internationaler-kieferorthopden-kongress-miami",
    destination: "/news/internationaler-kieferorthopden-kongress-miami",
  },
  {
    source: "/news/2021/10/1/nachhaltigkeit-ist-uns-immer-noch-wichtig",
    destination: "/news/nachhaltigkeit-ist-uns-immer-noch-wichtig",
  },
  { source: "/news/2021/2/11/helau-2021", destination: "/news/helau-2021" },
  { source: "/news/2021/2/11/frau-dr-kieferorthopdin", destination: "/news/frau-dr-kieferorthopaedin" },
  { source: "/news/2021/1/7/hygiene-gel", destination: "/news/hygiene-gel" },
  { source: "/news/2020/4/29/primescan-digitale-kieferorthopdie-20", destination: "/news/primescan-digitale-kieferorthopaedie-20" },
  { source: "/news/2020/4/21/koogkti0qgc0n1fuojc0zuxo91tspe", destination: "/news/wir-sind-fuer-sie-euch-da" },
  {
    source: "/news/2020/3/18/hinweise-zu-unserem-umgang-mit-dem-corona-virus-sars-cov-2",
    destination: "/news/hinweise-zu-unserem-umgang-mit-dem-corona-virus-sars-cov-2",
  },
  { source: "/news/2019/8/23/firmenlauf-2019-wir-haben-es-geschafft", destination: "/news/firmenlauf-2019" },
  { source: "/news/2019/7/31/praxisausflug-sterreich-2019", destination: "/news/praxisausflug-oesterreich-2019" },
  {
    source: "/news/2019/3/4/wir-wnschen-eine-schne-fassenacht-in-meenz",
    destination: "/news/wir-wuenschen-eine-schoene-fassenacht-in-meenz",
  },
  { source: "/news/2018/12/21/frohe-weihnachten", destination: "/news/frohe-weihnachten" },
  { source: "/news/2018/12/21/just-married", destination: "/news/just-married" },
  { source: "/news/2018/8/29/praxisausflug-2018", destination: "/news/praxisausflug-2018" },
  { source: "/news/2018/7/6/herzlichen-glckwunsch-yaren", destination: "/news/herzlichen-glueckwunsch-yaren" },
  { source: "/news/2018/7/6/willkommen-in-unserem-team", destination: "/news/willkommen-in-unserem-team-2" },
  { source: "/news/2018/2/9/helau", destination: "/news/helau-2018" },
  { source: "/news/2018/1/16/ausbildung-zurzum-zfa", destination: "/news/fortbildung-dr-michael-hueck" },
  { source: "/news/2017/8/23/vielen-dank", destination: "/news/vielen-dank" },
  { source: "/news/2017/8/23/willkommen-in-unserem-team", destination: "/news/willkommen-in-unserem-team" },
  { source: "/news/2016/9/23/nachhaltigkeit-ist-uns-wichtig", destination: "/news/nachhaltigkeit-ist-uns-wichtig" },
  { source: "/news/2016/8/16/sprechzeiten-1", destination: "/news/sprechzeiten" },
];

const nextConfig: NextConfig = {
  async redirects() {
    return cutoverRedirects.map((redirect) => ({
      source: encodeURI(redirect.source).replace(/[()+?*{}:]/g, (char) => `\\${char}`),
      destination: redirect.destination,
      statusCode: 301,
    }));
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "a.storyblok.com",
      },
    ],
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    root: process.cwd(),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
