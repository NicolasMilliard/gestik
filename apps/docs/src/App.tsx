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

      <section aria-labelledby="drag-hint-title">
        <h2 id="drag-hint-title">DragHint</h2>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32 }}>
          <figure style={{ margin: 0 }}>
            <DragHint />
            <figcaption>Drag to the right.</figcaption>
          </figure>
        </div>
      </section>
    </main>
  );
}

export default App;
