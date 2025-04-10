function applyScrolledState() {
    const scrollPosition = document.documentElement.scrollTop || document.body.scrollTop;
    if (scrollPosition > 0) {
        document.documentElement.classList.add("scrolled");
    } else {
        document.documentElement.classList.remove("scrolled");
    }
}

window.onscroll = applyScrolledState;

document.addEventListener("DOMContentLoaded", function() {
    applyScrolledState();
});

let togglesToTargets = new Map<HTMLElement, HTMLElement>();
document.querySelectorAll<HTMLElement>("[data-toggle]").forEach(function(toggle) {
    const target = document.querySelector<HTMLElement>(toggle.dataset.toggle!);
    if (!target) return;

    togglesToTargets.set(toggle, target);

    toggle.addEventListener(
        "click",
        function(this: HTMLElement, event: Event) {
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

document.addEventListener("click", function(_) {
    togglesToTargets.forEach((target, toggle) => {
        target.classList.remove("show");
        toggle.classList.remove("toggled");
    });
});