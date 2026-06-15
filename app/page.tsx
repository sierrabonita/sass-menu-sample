import RichEditor from "@/components/rich-editor";

const Home = () => {
  return (
    <div className="min-h-screen bg-zinc-100 py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <main className="mx-auto w-full max-w-4xl bg-white shadow-sm border border-zinc-200 rounded-xl overflow-hidden">
        <RichEditor />
      </main>
    </div>
  );
}

export default Home;