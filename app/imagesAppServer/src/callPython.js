import { spawn } from 'child_process'

export const callPython = (newPath, predictedName) => {

    const command = `conda run -n tensorflow python srgan.py ${newPath} ${predictedName}`

    const pythonScript = spawn(command, { shell: true });
    pythonScript.on('close', (code) => {
        console.log('close!');
    });
}