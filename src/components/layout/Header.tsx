import { Link } from 'react-router-dom';
import { Sun, Moon, Monitor, Heart } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { useTheme } from '@/hooks/useTheme';
import type { Theme } from '@/types';

export function Header() {
  const { theme, setTheme } = useTheme();

  const themeIcons = {
    light: <Sun className="w-4 h-4" />,
    dark: <Moon className="w-4 h-4" />,
    system: <Monitor className="w-4 h-4" />,
  };

  const cycleTheme = () => {
    const themes: Theme[] = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/logo.svg" alt="Logo" className="w-8 h-8" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Resource Explorer
            </h1>
          </Link>

          <nav className="flex items-center space-x-4">
            <Link to="/favorites">
              <Button variant="ghost" size="sm">
                <Heart className="w-4 h-4 mr-2" />
                Favorites
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={cycleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'} theme`}
            >
              {themeIcons[theme]}
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
