import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  MantineProvider,
  ColorSchemeProvider,
  ColorScheme,
  AppShell,
} from "@mantine/core";
import { QueryClient, QueryClientProvider } from "react-query";
import { useLocalStorage } from "@mantine/hooks";
import { HomePage, PostPage, RedirectPage, SubredditPage } from "./pages";
import { SideBar, TopBar } from "./components";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "colorScheme",
    defaultValue: "light",
  });
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  return (
    <BrowserRouter>
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider
          theme={{ colorScheme }}
          withGlobalStyles
          withNormalizeCSS
        >
          <QueryClientProvider client={queryClient}>
            <AppShell
              padding="md"
              navbarOffsetBreakpoint="sm"
              navbar={<SideBar />}
              header={<TopBar />}
              styles={(theme) => ({
                main: {
                  backgroundColor:
                    theme.colorScheme === "dark"
                      ? theme.colors.dark[8]
                      : theme.colors.gray[0],
                },
              })}
            >
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/redirect" element={<RedirectPage />} />
                <Route path="/r/:subid" element={<SubredditPage />} />
                <Route path="/r/:subid/comments/:id/:name" element={<PostPage />} />
                <Route path="*" element={<h1>404 not found</h1>} />
              </Routes>
            </AppShell>
          </QueryClientProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </BrowserRouter>
  );
}

export default App;
