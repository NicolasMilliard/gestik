import { DragHint } from '@gestik/react';

function App() {
  return (
    <main
      style={{
        maxWidth: 720,
        margin: '0 auto',
        padding: '48px 24px',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <h1>Gestik</h1>
      <p>Show users how.</p>

      <section aria-labelledby="drag-hint-title">
        <h2 id="drag-hint-title">DragHint</h2>
        <p>Static study of the input, draggable object, and destination.</p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32 }}>
          <figure style={{ margin: 0 }}>
            <DragHint input="pointer" />
            <figcaption>Pointer: drag to the right.</figcaption>
          </figure>

          <figure style={{ margin: 0 }}>
            <DragHint input="cursor" />
            <figcaption>Cursor: drag to the right.</figcaption>
          </figure>
        </div>
      </section>
    </main>
  );
}

export default App;
