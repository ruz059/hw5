const mainImg = document.getElementById("main-img");
const caption = document.getElementById("caption");
const thumbs = document.querySelectorAll(".thumbnails img");

thumbs.forEach(thumb => {
    thumb.addEventListener("click", async () => {
    if (!document.startViewTransition) {
        updateImage(thumb);
        return;
    }

    // Use the View Transitions API for smooth change
    document.startViewTransition(() => updateImage(thumb));
    });
});

function updateImage(thumb) {
    mainImg.src = thumb.dataset.full;
    caption.textContent = thumb.dataset.caption;
}