import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const saveImage = async (formData) => {
  const file = formData.get('profileImage');
  
  if (!file) {
    return null;
  }

  // Create uploads directory if it doesn't exist
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Get file extension and create unique filename
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const fileExtension = file.name.split('.').pop();
  const fileName = `${uuidv4()}.${fileExtension}`;
  const filePath = path.join(uploadsDir, fileName);

  // Write file to disk
  fs.writeFileSync(filePath, buffer);
  
  // Return the path that will be stored in the database
  return `/uploads/${fileName}`;
};