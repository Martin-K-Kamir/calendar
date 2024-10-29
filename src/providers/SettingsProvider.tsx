import { createContext, useState, useEffect } from "react";

type SettingsProviderProps = {
    children: React.ReactNode;
};

type SettingsProviderState = {
    locale?: string;
    weekStartDay: 0 | 1;
    renderWeekend: boolean;
    renderWeekendEvents: boolean;
    renderNonMonthDays: boolean;
    renderNonMonthEvents: boolean;
    highlighPastDays: boolean;
    disableAddingPastEvents: boolean;
};

const initialState: SettingsProviderState = {
    locale: undefined,
    weekStartDay: 1,
    renderWeekend: true,
    renderWeekendEvents: true,
    renderNonMonthDays: true,
    renderNonMonthEvents: true,
    highlighPastDays: false,
    disableAddingPastEvents: false,
};

const SettingsProviderContext = createContext<
    SettingsProviderState & {
        updateSettings: (newSettings: Partial<SettingsProviderState>) => void;
    }
>({
    ...initialState,
    updateSettings: () => {},
});

function SettingsProvider({ children }: SettingsProviderProps) {
    const [settings, setSettings] = useState<SettingsProviderState>(() => {
        const savedState = localStorage.getItem("SETTINGS");
        return savedState ? JSON.parse(savedState) : initialState;
    });

    useEffect(() => {
        localStorage.setItem("SETTINGS", JSON.stringify(settings));
    }, [settings]);

    const updateSettings = (newSettings: Partial<SettingsProviderState>) => {
        setSettings(prevSettings => ({
            ...prevSettings,
            ...newSettings,
        }));
    };

    return (
        <SettingsProviderContext.Provider
            value={{ ...settings, updateSettings }}
        >
            {children}
        </SettingsProviderContext.Provider>
    );
}

export {
    type SettingsProviderState,
    SettingsProvider,
    SettingsProviderContext,
};
