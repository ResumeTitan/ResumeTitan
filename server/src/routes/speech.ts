import express from 'express';
import multer from 'multer';
import { SpeechClient } from '@google-cloud/speech';
import fs from 'fs';
import path from 'path';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

const client = new SpeechClient({
  keyFilename: path.join(__dirname, '../../google-credentials.json'),
});

router.post('/speech-to-text', upload.single('audio'), async (req, res) => {
  try {
    const file = fs.readFileSync(req.file.path);
    const audioBytes = file.toString('base64');

    const [response] = await client.recognize({
      audio: { content: audioBytes },
      config: {
        encoding: 'WEBM_OPUS', // or 'LINEAR16' if using .wav
        sampleRateHertz: 48000, // or 16000 for .wav
        languageCode: 'en-US',
      },
    });

    fs.unlinkSync(req.file.path); // Clean up temp file

    const transcript = response.results
      .map(result => result.alternatives?.[0]?.transcript || '')
      .join('\n');
    res.json({ transcript });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
