import "./App.css";
import axios from "./api/axios.config";

function App() {
  async function handleSubmit(e) {
    try {
      const response = await axios.post("/auth/login", {
        email: "ghagnimesh490@gmail.com",
        password: "test1234",
      });

      console.log("api working", response);
    } catch (error) {
      console.error("Error occurred:", error);
    }
  }

  async function handlelogout(e) {
    try {
      const response = await axios.post("/auth/logout");

      console.log("api working", response);
    } catch (error) {
      console.error("Error occurred:", error);
    }
  }

  return (
    <>
      <button onClick={handleSubmit}>Login </button>
      <button onClick={handlelogout}>Logout</button>
    </>
  );
}

export default App;
