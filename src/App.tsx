import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MantineProvider, ColorSchemeProvider, ColorScheme } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { HomePage, RedirectPage } from "./pages";

function App() {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({key:"colorScheme", defaultValue:"light"});
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{ colorScheme }}
        withGlobalStyles
        withNormalizeCSS
      >
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/redirect" element={<RedirectPage />} />
          </Routes>
        </BrowserRouter>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default App;
