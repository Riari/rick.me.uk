import mediumZoom, { type Zoom } from "medium-zoom";

const modalOverlay: HTMLDivElement =
    document.querySelector(".modal-overlay")!;
const themeRadios: NodeListOf<HTMLInputElement> = document.querySelectorAll(
    "input[type=radio][name=theme]",
);
const mediumZoomBackgroundLight = "#fff";
const mediumZoomBackgroundDark = "#21212b";
var zoom: Zoom;

function applyTheme(name: string) {
    document.documentElement.dataset.theme = name;

    const prefersDark =
        (name == "system" &&
            window.matchMedia("(prefers-color-scheme: dark)").matches) ||
        name == "dark";

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

themeRadios[themeIndexMap.get(theme)!].checked = true;
zoom = mediumZoom(document.querySelectorAll("[data-zoomable]"));
applyTheme(theme);

for (var i = 0; i < themeRadios.length; ++i) {
    themeRadios[i].addEventListener(
        "change",
        function (this: HTMLInputElement, _: Event) {
            localStorage.setItem("theme", this.value);
            applyTheme(this.value);
        },
    );
}

const openModalLinks =
    document.querySelectorAll<HTMLAnchorElement>("a[data-open-modal]");
for (let i = 0; i < openModalLinks.length; ++i) {
    openModalLinks[i].addEventListener(
        "click",
        function (this: HTMLAnchorElement, event: Event) {
            event.preventDefault();

            if (window.getComputedStyle(modalOverlay).display != "none") {
                closeModals();
                return;
            }

            modalOverlay.style.display = "block";
            modalOverlay.querySelector<HTMLElement>(
                this.dataset.openModal!,
            )!.style.display = "block";
        },
    );
}

const closeModalLinks = document.querySelectorAll<HTMLAnchorElement>(
    "a[data-close-modal]",
);
for (let i = 0; i < closeModalLinks.length; ++i) {
    closeModalLinks[i].addEventListener(
        "click",
        function (this: HTMLAnchorElement, event: Event) {
            event.preventDefault();
            modalOverlay.style.display = "none";
            modalOverlay.querySelector<HTMLElement>(
                this.dataset.closeModal!,
            )!.style.display = "none";
        },
    );
}

function closeModals() {
    const modals = document.querySelectorAll<HTMLElement>(".modal");
    for (var i = 0; i < modals.length; i++) {
        modals[i].style.display = "none";
    }

    modalOverlay.style.display = "none";
}

document.onkeydown = function (event) {
    if (event.key == "Escape") closeModals();
};

modalOverlay.addEventListener("click", function (event) {
    if (this != event.target) return;
    closeModals();
});

const hoverSpan = document.createElement("span");
hoverSpan.classList.add("button__hover");

document.querySelectorAll(".button").forEach(function (element: Element) {
    element.appendChild(hoverSpan.cloneNode());

    element.addEventListener(
        "mouseleave",
        function (this: HTMLElement, event: any) {
            this.style.background = "";

            const hoverSpan = event.target.querySelector(".button__hover");
            hoverSpan.style.opacity = "0.0";
        },
    );

    element.addEventListener(
        "mousemove",
        function (this: HTMLElement, event: any) {
            const rect = this.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;

            const hoverSpan =
                this.querySelector<HTMLElement>(".button__hover");

            if (!hoverSpan) return;

            hoverSpan.style.opacity = "1.0";
            hoverSpan.style.left = `${mouseX - hoverSpan.offsetWidth / 2}px`;
            hoverSpan.style.top = `${mouseY - hoverSpan.offsetHeight / 2}px`;
        },
    );
});