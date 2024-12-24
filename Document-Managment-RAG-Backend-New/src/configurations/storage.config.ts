import { diskStorage } from 'multer';
import { extname } from 'path';

export const storageConfig = () => {
    return diskStorage({
        destination: process.env.STORAGE_PATH || './uploads', // Directory to save the uploaded files
        filename: (req, file, callback) => {
            // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            // const ext = extname(file.originalname);
            callback(null, `${file.originalname}`);
        }
    });
};
