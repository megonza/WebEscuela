document.querySelectorAll('.filter-items p').forEach(item => {
    item.addEventListener('click', async (e)=> {
        const course = e.target.getAttribute('data-course');
        const response = await fetch(`/news/filter?course=${course}`);
        const filteredPosts = await response.json();
        const newsContainer = document.querySelector('.news-container');
        newsContainer.innerHTML = '';

        if (filteredPosts.length > 0) {
            filteredPosts.forEach(post => {
                const newsDiv = document.createElement('div');
                newsDiv.classList.add('news');
                newsDiv.innerHTML = `
                <span>${post.course}</span>
                <h3>${post.title}</h3>
                <div class="line"></div>
                <p>${post.content}</p>
                <small>Publicado el: ${new Date(post.created).toLocaleString()}</small>
                `;
                newsContainer.appendChild(newsDiv);
            });
        } else {
            newsContainer.innerHTML = '<p class="empty">No hay anuncios disponibles para este curso.</p>';
        }
    });
});