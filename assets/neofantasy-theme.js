(function () {
    'use strict';

    const STORAGE_KEY = 'tm-theme';
    const LEGACY_STORAGE_KEYS = ['nf-theme', 'theme'];
    const MODES = new Set(['system', 'light', 'dark']);
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
    const THEME_ICONS = {
        moon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"></path></svg>',
        sun: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path></svg>',
    };

    const readMode = () => {
        const storedMode = localStorage.getItem(STORAGE_KEY);
        if (MODES.has(storedMode)) return storedMode;

        for (const key of LEGACY_STORAGE_KEYS) {
            const legacyMode = localStorage.getItem(key);
            if (MODES.has(legacyMode)) return legacyMode;
        }
        return 'system';
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
            const iconName = resolvedMode === 'dark' ? 'sun' : 'moon';
            if (icon && icon.dataset.themeIcon !== iconName) {
                icon.innerHTML = THEME_ICONS[iconName];
                icon.dataset.themeIcon = iconName;
            }
        });
    };

    const applyMode = ({ announce = false } = {}) => {
        const resolvedMode = resolveMode(currentMode);
        const root = document.documentElement;

        root.classList.remove('light', 'dark');
        root.classList.add(resolvedMode);
        root.dataset.theme = resolvedMode;
        root.dataset.themeMode = currentMode;
        root.dataset.resolvedTheme = resolvedMode;
        root.style.colorScheme = resolvedMode;

        const themeColor = document.querySelector('meta[name="theme-color"]');
        if (themeColor) {
            themeColor.setAttribute('content', resolvedMode === 'dark' ? '#141a19' : '#eef1ef');
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
        LEGACY_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
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
