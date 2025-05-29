import ImageResizer, {
  Response as ImageResizedResponse,
} from '@bam.tech/react-native-image-resizer';
import axios, { AxiosRequestConfig, CancelToken } from 'axios';
// import { FFmpegKit } from 'ffmpeg-kit-react-native';
import { isNil, isNumber, last } from 'lodash';
import { ActionSheetIOS, Image, Platform } from 'react-native';
import RNFS from 'react-native-fs';
import {
  Image as CropImage,
  Video as CropVideo,
} from 'react-native-image-crop-picker';
import { Video as VideoCompressor } from 'react-native-compressor';
import { FileUtils } from './FileUtils';
import i18n from '@core/localize';
import Alert from '@core/components/popup/Alert';

interface ImageSize {
  width: number;
  height: number;
}

interface ImageInput extends Partial<CropImage> {
  name?: string;
  path: string;
}

interface ResizeConfigs {
  maxWidth?: number;
  maxHeight?: number;
  maxSize: number;
  includeBase64?: boolean;
}

const uploadImage = async (
  image: ImageInput,
  configs: ResizeConfigs,
  cancelToken?: CancelToken,
  axiosConfig?: AxiosRequestConfig,
) => {
  const newImage = await resizeImage(image, configs);
  const response = await uploadFile(newImage, cancelToken, axiosConfig);
  return response;
};

const uploadFile = async (
  file?: ImageInput | null,
  cancelToken?: CancelToken,
  axiosConfig?: AxiosRequestConfig,
) => {
  if (isNil(file)) {
    return { error: 'Image is not valid' };
  }
  let { path, mime, filename } = file;
  mime = mime || 'image/jpeg';
  const fileData = {
    uri: Platform.select({
      ios: path,
      android: `file://${path}`,
    }),
    type: mime,
    name: filename || FileUtils.getFileNameFromPath(path),
  };

  const data = new FormData();
  data.append('file', fileData);

  try {
    const rawResponse = await axios.request({
      method: 'POST',
      baseURL: 'https://nutribackend.zsolution.vn',
      url: '/images/dms',
      data,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return rawResponse.data;
  } catch (error) {
    throw error;
  }
};

const resize = (
  file: ImageInput,
  maxWidth: number = 1000,
  maxHeight: number = 1000,
  quality = 1,
): Promise<{ response?: ImageResizedResponse }> => {
  return new Promise(async resolve => {
    const { path } = file;
    const response = await ImageResizer.createResizedImage(
      path,
      maxWidth,
      maxHeight,
      'JPEG',
      quality * 100,
    );
    // console.log('response', response);
    resolve({ response });
  });
};

export const resizeImage = async (
  image: ImageInput,
  configs: ResizeConfigs,
): Promise<ImageInput | null> => {
  let { size } = image;
  const { maxWidth, maxHeight, maxSize } = configs || {};
  let newImage = {
    ...image,
  };
  while (isNumber(maxSize) && (!size || size > maxSize)) {
    const { response } = await resize(
      newImage,
      maxWidth,
      maxHeight,
      size ? maxSize / size : 1,
    );
    if (response) {
      newImage = {
        ...newImage,
        ...response,
      };
      if (configs.includeBase64) {
        const base64Data = await RNFS.readFile(newImage.path, 'base64');
        newImage.data = base64Data;
      }
      size = response.size;
    } else {
      return null;
    }
  }
  return newImage;
};

export const getImageSize = (filePath: string): Promise<ImageSize> => {
  return new Promise(resolve => {
    Image.getSize(filePath, (width, height) => {
      resolve({ width, height });
    });
  });
};

// const captureFirstFrame = async (video: CropVideo) => {
//   try {
//     const fileName = FileUtils.getFileNameFromPath(video.path);
//     const outputPath = `${RNFS.CachesDirectoryPath}/${fileName}.jpg`;
//     const command = `-i ${video.path} -vframes 1 -b:v 2M ${outputPath}`;
//     await FFmpegKit.execute(command);
//     console.log('First frame captured successfully', outputPath);
//     return outputPath;
//   } catch (error) {
//     console.error('Error capturing first frame:', error);
//     throw error;
//   }
// };

const uploadVideo = async (
  video: CropVideo,
  cancelToken?: CancelToken,
  axiosConfig?: AxiosRequestConfig,
) => {
  const maxSize = 25 * 1024 * 1024;
  if (video.size && video.size > maxSize) {
    const result = await VideoCompressor.compress(
      video.path,
      {
        compressionMethod: 'auto',
        minimumFileSizeForCompress: 25,
      },
      (progress: number) => {
        console.log('Compression Progress: ', progress);
      },
    );
    video.path = result;
  }
  const response = await uploadFile(video, cancelToken, axiosConfig);
  return response;
};

const openPicker = async ({
  openLibrary,
  openCamera,
  askMessage,
}: {
  openLibrary: () => void;
  openCamera: () => void;
  askMessage?: string;
}) => {
  if (Platform.OS === 'ios') {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: [
          i18n.t('upload.photo_library'),
          i18n.t('upload.camera'),
          i18n.t('common.cancel'),
        ],
        cancelButtonIndex: 2,
        destructiveButtonIndex: -1,
      },
      buttonIndex => {
        if (buttonIndex == 0) {
          openLibrary();
        } else if (buttonIndex == 1) {
          openCamera();
        }
      },
    );
  } else if (Platform.OS === 'android') {
    Alert.alert({
      message: askMessage || String(i18n.t('upload.choose_photos_from')),
      actions: [
        {
          text: i18n.t('upload.photo_library'),
          onPress: openLibrary,
        },
        {
          text: i18n.t('upload.camera'),
          onPress: openCamera,
        },
      ],
    });
  }
};

export default {
  uploadVideo,
  uploadImage,
  getImageSize,
  resizeImage,
  openPicker,
  // captureFirstFrame,
};
