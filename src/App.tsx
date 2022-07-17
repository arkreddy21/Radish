import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage, RedirectPage } from "./pages";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/redirect" element={<RedirectPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
