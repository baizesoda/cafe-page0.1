import eventsJson from "@/content/events.json";
import peopleJson from "@/content/people.json";
import placesJson from "@/content/places.json";
import type { Event } from "@/lib/types";
import Hero from "@/components/sections/Hero";
import Longform from "@/components/sections/Longform";
import Coda from "@/components/sections/Coda";

const events = eventsJson as unknown as Event[];
const spine = events.filter((e) => !e.aside);
const years = spine.map((e) => e.year);

export default function Page() {
  return (
    <>
      <Hero
        spanFrom={String(Math.min(...years))}
        spanTo={String(Math.max(...years))}
        counts={{
          events: spine.length,
          people: peopleJson.length,
          places: placesJson.length,
        }}
      />
      <Longform />
      <Coda />
    </>
  );
}
