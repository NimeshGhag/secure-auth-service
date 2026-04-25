import MainRoutes from "./routing/MainRoutes";

function App() {
  console.log("CLIENT ID:",import.meta.env.VITE_GOOGLE_CLIENT_ID);
  return (
    <div className="h-screen w-screen ">
      <MainRoutes />
    </div>
  );
}

export default App;
