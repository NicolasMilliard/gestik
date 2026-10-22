import { DragHint } from '@gestik/react';

function App() {
  return (
    <main>
      <h1>Gestik</h1>

      <section aria-labelledby="drag-hint-title">
        <h2 id="drag-hint-title">DragHint</h2>
        <figure>
          <DragHint />
          <figcaption>Drag to the right.</figcaption>
        </figure>

        <figure>
          <DragHint direction="left" size={84} className="custom-drag-hint" />
          <figcaption>Drag to the left.</figcaption>
        </figure>
      </section>
    </main>
  );
}

export default App;
