import { useEffect, useState } from "react";
import { getEvents } from "../api/eventsService";
import type { Event } from "@shared/types/Event";
import heroImage from "../images/hero.jpg";
import EventSection from "../components/events/EventSection";
import type { Category } from "@shared/types/Category";
import { getCategories } from "../api/categoryService";
import eventosLogo from "../images/eventosLogo.png";

function HomePage() {
  const [isEventsLoading, setIsEventsLoading] = useState(true);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);

  const isLoading = isEventsLoading || isCategoriesLoading;

  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function loadEvents() {
      try {
        setIsEventsLoading(true);

        const receivedEvents = await getEvents();
        setEvents(receivedEvents);
      } catch (error) {
        console.error("Greška pri učitavanju događaja.", error);
      } finally {
        setIsEventsLoading(false);
      }
    }

    loadEvents();
  }, []);

  useEffect(() => {
    async function loadCategories() {
      try {
        setIsCategoriesLoading(true);

        const receivedCategories = await getCategories();
        setCategories(receivedCategories);
      } catch (error) {
        console.error("Greška pri učitavanju kategorija.", error);
      } finally {
        setIsCategoriesLoading(false);
      }
    }

    loadCategories();
  }, []);

  function handleScrollTo() {
    document
      .getElementById("mainContent")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className=" w-full  bg-[#181818]">
      <section className="relative h-screen w-full overflow-hidden">
        <img
          src={heroImage}
          alt="Hero slika"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black/25 to-transparent" />
        <div className="flex flex-col gap-6 absolute left-60 bottom-46 z-80 w-full ">
          <img src={eventosLogo} alt="Eventos logo" className="w-1/6" />
          <p className="text-white text-7xl font-bold">
            Uvek u centru dešavanja!
          </p>
          <button
            className=" bg-[#E98400] text-white text-xl rounded-2xl w-1/3 px-10 py-3 cursor-pointer"
            onClick={handleScrollTo}
          >
            Pogledaj događaje
          </button>
        </div>
      </section>
      <main
        id="mainContent"
        className="mx-auto flex min-h-[400px] w-full max-w-[1200px] flex-col gap-20 px-6 py-20 md:px-12"
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/30 border-t-white" />
          </div>
        ) : (
          categories.map((category) => (
            <EventSection
              key={category.id}
              categoryId={category.id}
              title={category.categoryName}
              events={
                events &&
                events.filter((event) => event.categoryId === category.id)
              }
            />
          ))
        )}
      </main>
    </div>
  );
}

export default HomePage;
