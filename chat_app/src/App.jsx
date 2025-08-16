import { Route } from "react-router-dom";
import Home from "./Pages/Home";
import Chat from "./Pages/Chat";

function App() {
  return (
    <div>
      <Route path="/" component={Home} exact />
      <Route path="/Chat" component={Chat} exact />
    </div>
  );
}

export default App;
