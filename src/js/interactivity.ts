function applyScrolledState() {
    const scrollPosition = document.documentElement.scrollTop || document.body.scrollTop;
    if (scrollPosition > 0) {
        document.documentElement.classList.add("scrolled");
    } else {
        document.documentElement.classList.remove("scrolled");
    }
}

window.onscroll = applyScrolledState;

document.addEventListener("DOMContentLoaded", function () {
    applyScrolledState();
});

let togglesToTargets = new Map<HTMLElement, HTMLElement>();
document.querySelectorAll<HTMLElement>("[data-toggle]").forEach(function (toggle) {
    const target = document.querySelector<HTMLElement>(toggle.dataset.toggle!);
    if (!target) return;

    togglesToTargets.set(toggle, target);

    toggle.addEventListener(
        "click",
        function (this: HTMLElement, event: Event) {
            event.preventDefault();
            event.stopPropagation();

            if (this.classList.contains("toggled")) {
                this.classList.remove("toggled");
                target.classList.remove("show");
            } else {
                this.classList.add("toggled");
                target.classList.add("show");
            }
        },
    );
});

document.addEventListener("click", function (_) {
    togglesToTargets.forEach((target, toggle) => {
        target.classList.remove("show");
        toggle.classList.remove("toggled");
    });
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

            const hoverSpan = this.querySelector<HTMLElement>(".button__hover");

            if (!hoverSpan) return;

            hoverSpan.style.opacity = "1.0";
            hoverSpan.style.left = `${mouseX - hoverSpan.offsetWidth / 2}px`;
            hoverSpan.style.top = `${mouseY - hoverSpan.offsetHeight / 2}px`;
        },
    );
});