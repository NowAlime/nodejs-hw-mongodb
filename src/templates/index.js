import path from 'path';
import fs from 'fs';


const TEMPLATES_DIR = path.join(process.cwd(), 'src', 'templates');


const TEMPLATES_INFO_PATH = path.join(TEMPLATES_DIR, 'templates.json');


export function getTemplateInfo() {
  if (fs.existsSync(TEMPLATES_INFO_PATH)) {
    const data = fs.readFileSync(TEMPLATES_INFO_PATH, 'utf8');
    return JSON.parse(data);
  } else {
    throw new Error('Templates info file not found.');
  }
}

export { TEMPLATES_DIR };