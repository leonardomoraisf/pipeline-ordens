export const pipelineHelper = {

    async animaElementSumindo(element, callback, scroll = true) {
        element.style.transition = "all 0.2s ease";

        if (scroll) {
            element.scrollIntoView({
                behavior: "smooth",
            });
        }

        element.style.transform = "scale(1.02)";
        element.style.opacity = "0.8";

        setTimeout(() => {
            element.style.transform = "scale(0)";
            element.style.opacity = "1";
        }, 600);

        setTimeout(() => {
            callback();
        }, 800);
    },

    async animaElementAparecendo(element) {
        element.style.transition = "all 0.5s ease";

        element.style.transform = "scale(0)";
        element.style.opacity = "0";

        setTimeout(() => {
            element.style.transform = "scale(1.02)";
            element.style.opacity = "0.8";
        }, 500);

        element.scrollIntoView({
            behavior: "smooth",
        });

        setTimeout(() => {
            element.style.transform = "scale(1)";
            element.style.opacity = "1";
        }, 1000);
    },
}
