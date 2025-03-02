import { ThemeProvider } from './components/theme-provider';
import { Toaster } from './components/ui/toaster';
import Home from './pages/Home';
import './index.css';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vidscribe-theme">
      <Home />
      <Toaster />
    </ThemeProvider>
  );
}

export default App;