import { createContext, useState, useEffect } from "react";

// Todo: Implement settings

type SettingsProviderProps = {
    children: React.ReactNode;
};

type SettingsProviderState = {
    locale?: string;
    weekStartDay: 0 | 1;
};

const initialState: SettingsProviderState = {
    locale: undefined,
    weekStartDay: 1,
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
