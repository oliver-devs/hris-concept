import { Injectable, signal, computed, effect } from '@angular/core';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ColorTheme = 'azure' | 'rose' | 'violet' | 'teal' | 'orange' | 'green';

export const MODE_OPTIONS = [
    { value: 'light' as ThemeMode, label: 'Hell', icon: 'light_mode' },
    { value: 'dark' as ThemeMode, label: 'Dunkel', icon: 'dark_mode' },
    { value: 'system' as ThemeMode, label: 'System', icon: 'desktop_windows' },
];

export const COLOR_THEMES = [
    { id: 'azure' as ColorTheme, label: 'Azure', preview: '#0078d4' },
    { id: 'rose' as ColorTheme, label: 'Rose', preview: '#e91e63' },
    { id: 'violet' as ColorTheme, label: 'Violett', preview: '#7c4dff' },
    { id: 'teal' as ColorTheme, label: 'Teal', preview: '#009688' },
    { id: 'orange' as ColorTheme, label: 'Orange', preview: '#ff5722' },
    { id: 'green' as ColorTheme, label: 'Grün', preview: '#4caf50' },
];

const ALL_COLOR_IDS = COLOR_THEMES.map((t) => t.id);

@Injectable({ providedIn: 'root' })
export class ThemeService {
    readonly mode = signal<ThemeMode>(this.loadMode());
    readonly colorTheme = signal<ColorTheme>(this.loadColor());

    private readonly systemPrefersDark = signal(window.matchMedia('(prefers-color-scheme: dark)').matches);

    readonly isDarkMode = computed(() => {
        const m = this.mode();
        if (m === 'system') return this.systemPrefersDark();
        return m === 'dark';
    });

    constructor() {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            this.systemPrefersDark.set(e.matches);
        });

        effect(() => {
            const dark = this.isDarkMode();
            const color = this.colorTheme();
            const html = document.documentElement;

            html.classList.toggle('dark', dark);

            for (const id of ALL_COLOR_IDS) {
                html.classList.toggle(`theme-${id}`, id === color);
            }
        });
    }

    setMode(mode: ThemeMode) {
        this.mode.set(mode);
        localStorage.setItem('theme-mode', mode);
    }

    setColor(color: ColorTheme) {
        this.colorTheme.set(color);
        localStorage.setItem('theme-color', color);
    }

    private loadMode(): ThemeMode {
        const saved = localStorage.getItem('theme-mode') as ThemeMode | null;
        if (saved) return saved;

        // Migration vom alten 'theme' Key
        const legacy = localStorage.getItem('theme');
        if (legacy === 'dark') return 'dark';
        if (legacy === 'light') return 'light';
        return 'system';
    }

    private loadColor(): ColorTheme {
        const saved = localStorage.getItem('theme-color') as ColorTheme | null;
        if (saved && ALL_COLOR_IDS.includes(saved)) return saved;
        return 'azure';
    }
}
