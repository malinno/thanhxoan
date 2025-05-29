export class FileUtils {
  static getFileNameFromPath = (path: string) => {
    const fragments = path.split('/');
    let fileName = fragments[fragments.length - 1];
    fileName = fileName.split('.')[0];
    return fileName;
  };
}
