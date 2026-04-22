// import axiosClient from '../api/axiosClient';

// export const uploadImage = async (uri: string): Promise<string | null> => {
//   const formData = new FormData();

//   formData.append('image', {
//     uri,
//     name: 'photo.jpg',
//     type: 'image/jpeg',
//   });

//   try {
//     const response = await axiosClient.post('/upload', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });

//     return response.data.imageUrl;
//   } catch (error) {
//     console.error('❌ خطأ أثناء رفع الصورة:', error);
//     return null;
//   }
// };


// app/api/uploadService.ts
import axiosClient from './axiosClient';

export const uploadImage = async (uri: string): Promise<string | null> => {
  const filename = uri.split('/').pop() || 'photo.jpg';
  const formData = new FormData();

  formData.append('image', {
    uri,
    name: filename,
    type: 'image/jpeg',
  } as any);

  try {
    const response = await axiosClient.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // تأكد إن الباك-إند يرجع المفتاح الصحيح
    return response.data.imageUrl || response.data.secure_url || null;
  } catch (error) {
    console.error('❌ فشل أثناء رفع الصورة', error);
    return null;
  }
};

export default uploadImage;