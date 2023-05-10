import express from 'express'
import multer from 'multer'
import cors from 'cors'
import fs from 'fs'
import path from 'path';
import { callPython } from './src/callPython.js';
import { spawn } from 'child_process'


const app = express();
app.use(cors())

const upload = multer({ dest: 'uploads/' });

// Эндпоинт для загрузки изображения
app.post('/upload', upload.single('image'), (req, res) => {

    // Определяем желаемый тип обработки изображения
    const type = req.query.type;

    // Если параметр с типом не определен выдаем сообщение об ошибке 
    if (!type) {
        res.json({
            message: "Add query params: type='colorization' or 'resolution'",
        });
    }

    // Получаем оригинальное название изображения
    const { originalname, path } = req.file;

    // Подготавливаем новые уникальные имена
    const newName = `${Date.now() + '_' + originalname}`;
    const newPath = `uploads/${newName}`;
    const predictedName = `predicted_${newName}`;
    const predictedPath = `uploads/${predictedName}`;
    const predictedProcessedName = `predicted_processed_${newName}`;
    const predictedProcessedPath = `uploads/${predictedProcessedName}`;

    // Переименовываем полученный файл
    fs.renameSync(path, newPath);

    // Выбераем скрипт, в зависимости от параметров запроса
    const python = type === 'resolution' ? 'srgan.py' : 'colorization.py'

    // Команда для запуска скрипта
    const command = `conda run -n tensorflow python ${python} ${newPath} ${predictedName} ${predictedProcessedName}`

    // Запускаем скрипт и по завершении его работы отправляем пользователю ссылки на изображения
    const pythonScript = spawn(command, { shell: true });
    pythonScript.on('close', (code) => {
        res.json({
            message: 'File uploaded successfully',
            link: newPath,
            predictedLink: predictedPath,
            predictedProcessedLink: predictedProcessedPath
        });
    });
});

// Эндпоинт для отправки изображения
app.get('/uploads/:imageName', (req, res) => {

    // Получаем название изображения
    const imageName = req.params.imageName;

    // Получаем путь до него
    const imagePath = `uploads/${imageName}`;
    const options = {
        root: path.resolve()
    };

    // Отправляем изображение клиенту
    res.sendFile(imagePath, options);
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});