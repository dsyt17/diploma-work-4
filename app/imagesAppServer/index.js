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

app.post('/upload', upload.single('image'), (req, res) => {

    const type = req.query.type;

    if (!type) {
        res.json({
            message: "Add query params: type='colorization' or 'resolution'",
        });
    }

    const { originalname, path } = req.file;

    const newName = `${Date.now() + '_' + originalname}`;
    const newPath = `uploads/${newName}`;
    const predictedName = `predicted_${newName}`;
    const predictedPath = `uploads/${predictedName}`;
    const predictedProcessedName = `predicted_processed_${newName}`;
    const predictedProcessedPath = `uploads/${predictedProcessedName}`;

    fs.renameSync(path, newPath);

    console.log(`File uploaded: ${originalname}`);

    const python = type === 'resolution' ? 'srgan.py' : 'colorization.py'

    const command = `conda run -n tensorflow python ${python} ${newPath} ${predictedName} ${predictedProcessedName}`

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

app.get('/uploads/:imageName', (req, res) => {
    const imageName = req.params.imageName;
    const imagePath = `uploads/${imageName}`;
    const options = {
        root: path.resolve()
    };
    res.sendFile(imagePath, options);
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});