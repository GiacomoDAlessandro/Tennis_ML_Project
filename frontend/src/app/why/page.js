import Header from "../components/header.jsx";

export const metadata = {
  title: "Why · Tennis Analytics",
};

export default function WhyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-100 text-zinc-900">
      <Header />
      <main className="space-y-4 mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Why did I build Tennis Visualizer?
        </h1>
          <p className="text-zinc-500 leading-relaxed">
              Tennis Visualizer shows statistics that are not readily available online. Shot charting is one of the least
              publicly available statistics in all of sports, since the data from hawkeye is owned by each individual tournament,
              and not public.
          </p>

          <p className="text-zinc-500 leading-relaxed">
              Tennis Visualizer allows the average tennis fan to see discrepancies in professionals' playstyles, such as
              where their serve goes on break points, clay vs. grass playstyle, where they hit shots against certain players, etc.
              While there are statistics that show this online, Tennis Analyzer visualizes it and makes it easy for the
              average person to understand.
          </p>
          {/*TODO: Change this when project is done*/}
          <p className="text-zinc-500 leading-relaxed">
              Lastly, however probably the most important feature of Tennis Visualizer, the video upload. This is coming soon...
          </p>
          <p className="text-zinc-500 leading-relaxed">
            This would not have been possible without Jeff Sackmann&apos;s data, so you should
            definitely check out his data and website,{" "}
            <a
              href="https://www.tennisabstract.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-zinc-800 underline decoration-zinc-400 underline-offset-2 transition-colors hover:text-zinc-950 hover:decoration-zinc-600"
            >
              Tennis Abstract
            </a>
          </p>
          <p className="text-zinc-500 leading-relaxed">
              DISCLAIMER: The data for the ATP match visualizer is charted by people who decide to contribute to Sackmann's
              Tennis Charting Project, therefore, the data may not be 100% accurate. This is unfortunately a setback to doing
              a project like this, as hawkeye data is not publicly available. Due to this, some matches are not charted, however,
              if you have a match that you really want to see, feel free to contact me at giacomo.dalessandro9@gmail.com, or
              chart it yourself on Sackmann's website!
          </p>
      </main>
    </div>
  );
}
