import { DocsSidebar } from "./components/docs-sidebar";
import { OverviewSection } from "./components/overview-section";
import { DragHintPage } from "./pages/drag-hint-page";

const App = () => (
  <div className="min-h-screen bg-white font-sans text-zinc-900 lg:grid lg:grid-cols-[240px_minmax(0,1fr)]">
    <DocsSidebar />

    <main
      className="mx-auto w-full max-w-5xl px-5 py-12 sm:px-8 lg:px-12 lg:py-16"
      id="top"
    >
      <OverviewSection />
      <DragHintPage />
    </main>
  </div>
);

export default App;
