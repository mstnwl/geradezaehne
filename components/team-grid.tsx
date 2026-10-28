import Image from "next/image";
import { Reveal } from "@/components/reveal";
import type { TeamGridContent, TeamMember } from "@/lib/service-module";

function Member({ member }: { member: TeamMember }) {
  return (
    <li className="flex flex-col gap-nav">
      {member.image ? (
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-white">
          <Image
            src={member.image.src}
            alt={member.image.alt || member.name}
            fill
            sizes="(min-width: 64rem) 22rem, 45vw"
            className="object-cover"
          />
        </div>
      ) : null}
      {member.name || member.role ? (
        <p className="flex flex-col text-base leading-normal text-ink lg:text-[18px]">
          {member.name ? <span className="font-medium">{member.name}</span> : null}
          {member.role ? <span className="font-normal">{member.role}</span> : null}
        </p>
      ) : null}
    </li>
  );
}

export function TeamGrid({ teamGrid }: { teamGrid: TeamGridContent }) {
  return (
    <Reveal id={teamGrid.anchor} className="bg-white px-gutter py-20">
      <div className="mx-auto flex max-w-column flex-col gap-nav">
        <h2 className="text-headline text-ink">{teamGrid.headline}</h2>
        {teamGrid.members.length > 0 ? (
          <ul className="grid grid-cols-2 gap-12 lg:grid-cols-3 lg:gap-x-20">
            {teamGrid.members.map((member, index) => (
              <Member key={`${member.name}-${index}`} member={member} />
            ))}
          </ul>
        ) : null}
      </div>
    </Reveal>
  );
}
