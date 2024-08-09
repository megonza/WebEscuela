require('dotenv').config();
const express = require('express');
const path = require('path');
const connection = require('./db');
const multer = require('multer');
const fs = require("fs");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.resolve(__dirname, '../public'))); // Route for static files
app.use(bodyParser.urlencoded({ extended: true }));            // For managing form data
app.use(bodyParser.json());                                    // For managing form data


// Multer configuration (image uploading)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/img/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// EJS configuration (template engine)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Route for displaying images and news from database
app.get("/dashboard", async (req, res) => {
    try {
        const [images] = await connection.query("SELECT id, image_url FROM images");
        const [posts] = await connection.query("SELECT * FROM news ORDER BY created DESC");
        res.render("dashboard", { images, posts });
    } catch (err) {
        console.error("Error al obtener imágenes y noticias: ", err);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Route for rendering gallery view
app.get("/gallery", async(req, res) => {
    try {
        const [rows] = await connection.query("SELECT id, image_url FROM images ORDER BY id DESC");
        res.render("gallery", { images: rows });
    } catch(err) {
        console.error("Ocurrió un error al obtener las imágenes: ", err);
        res.status(500).json({ message: 'Error interno del servidor'});
    }
});

// Route for rendering news board view
app.get("/news", async(req, res) => {
    try {
        const [posts] = await connection.query("SELECT * FROM news ORDER BY created DESC");
        res.render("news", { news: posts });
    } catch(err) {
        console.error("Ocurrió un error al obtener las imágenes: ", err);
        res.status(500).json({ message: 'Error interno del servidor'});
    }
});

// Route for filtering news in news board view
app.get("/news/filter", async(req, res) => {

    const course = req.query.course;
    let query = "SELECT * FROM news";
    const queryParams = [];

    if (course && course !== 'all') {
        query += " WHERE course = ?";
        queryParams.push(course);
    }

    try {
        const [rows] = await connection.query(query, queryParams);
        res.json(rows);
    } catch(err) {
        console.error("Error al obtener anuncios filtrados: ", err);
        res.status(500).json({ message: "Error interno del servidor "});
    }
});

// Route for uploading images
app.post('/img', upload.single('image'), async (req, res) => {
    if (req.file) {
        const imageUrl = `/img/${req.file.filename}`;
        try {
            const [result] = await connection.query('INSERT INTO images (image_url) VALUES (?)', [imageUrl]);
            console.log("Imagen subida con éxito.")
        } catch (err) {
            console.error("Ocurrió un error al subir la imagen: ", err);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    } else {
        res.status(400).json({ message: 'No se ha subido ninguna imagen' });
    }
});

// Route for deleting images
app.delete('/img/:id', async (req, res) => {
    const imageId = req.params.id;
    try {
        const [rows] = await connection.query('SELECT image_url FROM images WHERE id = ?', [imageId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Imagen no encontrada' });
        }

        const imageUrl = rows[0].image_url;
        const imagePath = path.resolve(__dirname, `../public${imageUrl}`);

        fs.unlink(imagePath, async (err) => {
            if (err) {
                console.error('Error al eliminar la imagen del sistema de archivos:', err);
                return res.status(500).json({ message: 'Error interno del servidor.' });
            }

            await connection.query('DELETE FROM images WHERE id = ?', [imageId]);
            res.json({ message: 'Imagen eliminada correctamente.' });
        });
    } catch (err) {
        console.error('Error procesando la solicitud:', err);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});

// Route for posting news
app.post("/dashboard", async (req,res) => {
    const { title, content, course } = req.body;
    if (title && content && course) {
        try {
            const [result] = await connection.query("INSERT INTO news (title, content, course) VALUES (?, ?, ?)", [title, content, course]);
            res.redirect('/dashboard');
        } catch (err) {
            console.error("Ocurrió un error al publicar la noticia: ", err);
            res.status(500).json({ message: "Error interno del servidor. "});
        }
    } else {
        res.status(400).json({ message: "Rellene todos los campos para publicar el anuncio." });
    }
});

// Route for deleting news
app.delete("/news/:id", async (req, res) => {
    const postId = req.params.id;
    try {
        const [result] = await connection.query('DELETE FROM news WHERE id = ?', [postId]);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: "Anuncio eliminado correctamente." });
        } else {
            res.status(404).json({ message: "Anuncio no encontrado." });
        }
    } catch(err) {
        console.error("Error al eliminar la noticia:", err);
        res.status(500).json({ message: "Error interno del servidor. "});
    }
});

// Start server
app.listen(port, () => {
    console.log("Servidor escuchando en el puerto 3000");
});