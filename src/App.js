import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Router,
  Routes,
} from "react-router-dom";
import "./App.css";
import DescriptionPage from "./Pages/Description/DescriptionPage";
import HomePage from "./Pages/Home/HomePage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Outlet />}>
            <Route index element={<Navigate to={"/home"} />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="description/:id" element={<DescriptionPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
