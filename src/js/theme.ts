import mediumZoom, { type Zoom } from "medium-zoom";

const themeRadios: NodeListOf<HTMLInputElement> = document.querySelectorAll("input[type=radio][name=theme]");
const mediumZoomBackgroundLight = "#fff";
const mediumZoomBackgroundDark = "#21212b";
var zoom: Zoom;

function applyTheme(name: string) {
    document.documentElement.dataset.theme = name;

    const prefersDark = (name == "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)
        || name == "dark";

    zoom.update({
        background: prefersDark
            ? mediumZoomBackgroundDark
            : mediumZoomBackgroundLight,
    });
}

const theme: string = localStorage.getItem("theme") ?? "system";

const themeIndexMap: Map<string, number> = new Map();
themeIndexMap.set("system", 0);
themeIndexMap.set("dark", 1);
themeIndexMap.set("light", 2);

if (themeRadios.length > 0) {
    themeRadios[themeIndexMap.get(theme)!].checked = true;
    zoom = mediumZoom(document.querySelectorAll("[data-zoomable]"));
    applyTheme(theme);

    for (var i = 0; i < themeRadios.length; ++i) {
        themeRadios[i].addEventListener(
            "change",
            function(this: HTMLInputElement, _: Event) {
                localStorage.setItem("theme", this.value);
                applyTheme(this.value);
            },
        );
    }
}
