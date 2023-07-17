document.addEventListener('DOMContentLoaded', () => {
    let loading = document.querySelectorAll("img[data-src]");

    const loadImages = (image) => {
        image.setAttribute("src", image.getAttribute("data-src"));
        image.onload = () => {
            image.removeAttribute("data-src");
        };
    };

    const callback = (items, observer) => {
        items.forEach((item) => {
            if (item.isIntersecting) {
                loadImages(item.target);
                observer.unobserve(item.target);
            }
        });
    };

    let options = {
        threshold: 0.5,
    };

    const observer = new IntersectionObserver(callback, options);

    loading.forEach((img) => {
        observer.observe(img);
    });
});