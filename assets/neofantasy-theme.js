(function () {
    'use strict';

    const STORAGE_KEY = 'nf-theme';
    const LEGACY_STORAGE_KEY = 'theme';
    const MODES = new Set(['system', 'light', 'dark']);
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');

    const readMode = () => {
        const storedMode = localStorage.getItem(STORAGE_KEY);
        if (MODES.has(storedMode)) return storedMode;

        const legacyMode = localStorage.getItem(LEGACY_STORAGE_KEY);
        return MODES.has(legacyMode) ? legacyMode : 'system';
    };

    const resolveMode = (mode) => (
        mode === 'system' ? (systemTheme.matches ? 'dark' : 'light') : mode
    );

    let currentMode = readMode();

    const syncControls = () => {
        const resolvedMode = resolveMode(currentMode);
        const nextMode = resolvedMode === 'dark' ? 'light' : 'dark';
        const label = nextMode === 'dark' ? '切换到深色主题' : '切换到浅色主题';

        document.querySelectorAll('[data-theme-toggle]').forEach((control) => {
            control.setAttribute('aria-label', label);
            control.setAttribute('title', label);
            control.dataset.resolvedTheme = resolvedMode;

            const icon = control.querySelector('[data-theme-icon]');
            if (icon) icon.textContent = resolvedMode === 'dark' ? '☀' : '☾';
        });
    };

    const applyMode = ({ announce = false } = {}) => {
        const resolvedMode = resolveMode(currentMode);
        const root = document.documentElement;

        root.classList.remove('light', 'dark');
        root.classList.add(resolvedMode);
        root.dataset.theme = currentMode;
        root.dataset.resolvedTheme = resolvedMode;
        root.style.colorScheme = resolvedMode;

        const themeColor = document.querySelector('meta[name="theme-color"]');
        if (themeColor) {
            themeColor.setAttribute('content', resolvedMode === 'dark' ? '#302d29' : '#c3dfe0');
        }

        syncControls();

        if (announce) {
            window.dispatchEvent(new CustomEvent('nf-theme-change', {
                detail: { theme: currentMode, resolvedTheme: resolvedMode },
            }));
        }
    };

    const setMode = (mode) => {
        if (!MODES.has(mode)) return;
        currentMode = mode;
        localStorage.setItem(STORAGE_KEY, mode);
        localStorage.removeItem(LEGACY_STORAGE_KEY);
        applyMode({ announce: true });
    };

    const bindControls = () => {
        document.querySelectorAll('[data-theme-toggle]').forEach((control) => {
            if (control.dataset.themeBound === 'true') return;
            control.dataset.themeBound = 'true';
            control.addEventListener('click', () => {
                setMode(resolveMode(currentMode) === 'dark' ? 'light' : 'dark');
            });
        });
        syncControls();
    };

    systemTheme.addEventListener('change', () => {
        if (currentMode === 'system') applyMode({ announce: true });
    });

    window.NeoFantasyTheme = {
        getTheme: () => currentMode,
        getResolvedTheme: () => resolveMode(currentMode),
        setTheme: setMode,
    };

    applyMode();

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bindControls, { once: true });
    } else {
        bindControls();
    }
})();
