const gallery_button = document.querySelector(".gallery-button");
const news_button = document.querySelector(".news-button");
const gallery_section = document.querySelector(".table-section");
const news_section = document.querySelector(".news-section");

// Function for switching sections
function sectionActive(section1, section2) {
    section1.classList.remove("hidden");
    section2.classList.add("hidden");
};

// Events for switching sections
news_button.addEventListener("click", () => {
    sectionActive(news_section,gallery_section);
    news_button.style.backgroundColor = "#42B9B8";
    gallery_button.style.backgroundColor = "#fff";
});

gallery_button.addEventListener("click", () => {
    sectionActive(gallery_section,news_section);
    gallery_button.style.backgroundColor = "#42B9B8";
    news_button.style.backgroundColor = "#fff";
});

document.getElementById('files').addEventListener('change', function() {
    document.getElementById('uploadForm').submit();
});

// Delete image button
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', async () => {
            const imageId = button.getAttribute('data-id');
            if (confirm('¿Estás seguro de que deseas eliminar esta imagen?')) {
                await deleteImage(imageId);
            }
        });
    });
});

async function deleteImage(imageId) {
    try {
        const response = await fetch(`/img/${imageId}`, { method: 'DELETE' });
        const data = await response.json();
        if (response.ok) {
            alert(data.message);
            window.location.reload();
        } else {
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        console.error('Error eliminando la imagen:', error);
        alert('Error interno del servidor.');
    }
}

// Open form
document.addEventListener('DOMContentLoaded', () => {
    const openFormButton = document.getElementById('openFormButton');
    const closeFormButton = document.getElementById('closeFormButton');
    const newsFormPopup = document.getElementById('newsFormPopup');

    openFormButton.addEventListener('click', () => {
        newsFormPopup.classList.remove('hidden');
    });

    closeFormButton.addEventListener('click', () => {
        newsFormPopup.classList.add('hidden');
    });

    // Close the popup if user clicks outside of the form
    window.addEventListener('click', (event) => {
        if (event.target === newsFormPopup) {
            newsFormPopup.classList.add('hidden');
        }
    });
});

// Posting news
document.getElementById('newsForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = e.target.title.value;
    const content = e.target.content.value;
    const course = e.target.course.value;

    if (title && content && course) {
        try {
            const response = await fetch('/dashboard', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, content, course })
            });

            if (response.ok) {
                window.location.reload();
            } else {
                const data = await response.json();
                console.error(data.message);
            }
        } catch (error) {
            console.error('Error al publicar la noticia:', error);
        }
    } else {
        console.error('Título y contenido son requeridos.');
    }
});

// Deleting news
document.querySelectorAll('.delete-button-news').forEach(button => {
    button.addEventListener('click', async (e) => {
        const postId = e.target.getAttribute('data-id');
        if(confirm("¿Estás seguro de que quieres eliminar este anuncio?")) {
            try {
                const response = await fetch(`/news/${postId}`, { method: 'DELETE' });

                if (response.ok) {
                    e.target.parentElement.remove();
                    alert('Anuncio eliminado correctamente.');
                } else {
                    alert('Error al eliminar el anuncio.');
                }
            } catch(err) {
                console.error('Error al eliminar la noticia:', err);
                alert('Error al eliminar la noticia.');
            }
        }
    });
});