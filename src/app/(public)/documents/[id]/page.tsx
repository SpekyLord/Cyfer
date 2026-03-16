export default function DocumentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div>
      <h1>Document Detail</h1>
      <p>Document details, verification status, and approval chain.</p>
    </div>
  );
}
