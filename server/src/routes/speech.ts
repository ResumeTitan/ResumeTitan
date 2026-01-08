import express from 'express';
import multer from 'multer';
import { SpeechClient } from '@google-cloud/speech';
import fs from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

const client = new SpeechClient({
    keyFilename: path.join(__dirname, '../../google-credentials.json'),
});

ffmpeg.setFfmpegPath(ffmpegPath!);

function transcodeToWav(inputPath: string, outputPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .toFormat('wav')
            .audioFrequency(44100) // Ensure consistent sample rate
            .audioChannels(1) // Mono channel for speech
            .on('end', () => resolve())
            .on('error', err => reject(err))
            .save(outputPath);
    });
}

router.post('/speech-to-text', upload.single('audio'), async (req, res) => {
    const inputPath = req.file.path;
    const ext = path.extname(req.file.originalname).toLowerCase();
    let audioPath = inputPath;
    let needsTranscode = ext === '.mp4' || ext === '.aac' || ext === '.m4a' || ext === '.webm' || !ext;

    try {
        // If file is mp4/aac/m4a, transcode to wav
        if (needsTranscode) {
            const wavPath = inputPath + '.wav';
            await transcodeToWav(inputPath, wavPath);
            audioPath = wavPath;
        }

        const file = fs.readFileSync(audioPath);
        const audioBytes = file.toString('base64');

        const [response] = await client.recognize({
            audio: { content: audioBytes },
            config: {
                encoding: 'LINEAR16', // Always use LINEAR16 since we transcode everything to WAV
                sampleRateHertz: 44100, // Now guaranteed by ffmpeg transcoding
                languageCode: 'en-US',
            },
        });

        // Clean up temp files
        fs.unlinkSync(inputPath);
        if (needsTranscode && fs.existsSync(audioPath)) {
            fs.unlinkSync(audioPath);
        }

        const transcript = response.results.map(result => result.alternatives?.[0]?.transcript || '').join('\n');
        res.json({ transcript });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
