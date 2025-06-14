import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function uploadFile(fileBuffer: Buffer, filename: string): Promise<string> {
    try {
        const ext = path.extname(filename);
        const uniqueName = `${uuidv4()}${ext}`;
        const uploadPath = path.join(process.cwd(), 'public/uploads', uniqueName);

        await fs.mkdir(path.dirname(uploadPath), { recursive: true });
        await fs.writeFile(uploadPath, fileBuffer);

        return `/uploads/${uniqueName}`; // URL relative to public folder
    } catch (error) {
        console.error('Error uploading file:', error);
        throw new Error('Failed to upload file');
    }
}