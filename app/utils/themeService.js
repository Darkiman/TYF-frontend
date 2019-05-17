import Themes from "../constants/Themes";
import blueColors from "../theme/blue/colors";
import redColors from "../theme/red/colors";
import asyncStorageService from "./asyncStorageService";

const themeKey = 'theme';

class ThemeServiceSingleton {

    constructor() {
        this.currentTheme = Themes.BLUE;
        this.currentThemeColors = blueColors;
        this.initialized = false;
    }

    async initialize() {
        const theme = await asyncStorageService.getItem(themeKey);
        switch (theme) {
            case Themes.BLUE:
                this.currentTheme = Themes.RED;
                this.currentThemeColors = blueColors;
                break;
            default: {
                this.currentTheme = Themes.RED;
                this.currentThemeColors = blueColors;
                return;
            }
        }
        this.initialized = true;
    }

    async setTheme(theme) {
        switch (theme) {
            case Themes.BLUE:
                asyncStorageService.setItem(themeKey, Themes.BLUE);
                this.currentTheme = Themes.BLUE;
                this.currentThemeColors = colors;
                break;
            default: {
                this.currentTheme = Themes.BLUE;
                asyncStorageService.setItem(themeKey, Themes.BLUE);
                this.currentThemeColors = colors;
                return;
            }
        }
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    getCurrentThemreColors() {
        return this.currentThemeColors;
    }
}

const themeService = new ThemeServiceSingleton();
themeService.initialize();
export default themeService;
