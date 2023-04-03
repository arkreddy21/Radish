import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  MantineProvider,
  ColorSchemeProvider,
  ColorScheme,
  AppShell,
} from "@mantine/core";
import { ModalsProvider } from '@mantine/modals';
import { QueryClient, QueryClientProvider } from "react-query";
import { useLocalStorage } from "@mantine/hooks";
import { HomePage, PostPage, RedirectPage, SubredditPage } from "./pages";
import { SideBar, TopBar } from "./components";
import { useState } from "react";

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
  const [opened, setOpened] = useState(false);  // for sidebar
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
          <ModalsProvider modalProps={{fullScreen: true}} >
            <QueryClientProvider client={queryClient}>
              <AppShell
                padding={0}
                navbarOffsetBreakpoint="xl"
                navbar={<SideBar opened={opened} />}
                header={<TopBar opened={opened} setOpened={setOpened} />}
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
          </ModalsProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </BrowserRouter>
  );
}

export default App;
