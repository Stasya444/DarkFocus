import { defineEventHandler, readMultipartFormData, createError } from 'h3';
import { prisma } from '~/server/utils/prisma';
import { uploadFile } from '~/server/utils/upload';

export default defineEventHandler(async (event) => {
    // Проверяем метод запроса
    if (event.node.req.method !== 'POST') {
        throw createError({
            statusCode: 405,
            statusMessage: 'Method Not Allowed',
        });
    }

    // Безопасно получаем params
    const params = event.context.params;
    if (!params || !params.id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing Photographer ID',
        });
    }

    // Получаем photographerId из параметров маршрута
    const photographerId = parseInt(params.id);
    if (isNaN(photographerId)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid Photographer ID',
        });
    }

    // Проверяем, существует ли фотограф
    const photographer = await prisma.photographer.findUnique({
        where: { id: photographerId },
    });
    if (!photographer) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Photographer Not Found',
        });
    }

    // Читаем multipart/form-data
    const formData = await readMultipartFormData(event);
    if (!formData || !formData.length) {
        throw createError({
            statusCode: 400,
            statusMessage: 'No Files Uploaded',
        });
    }

    // Массив для хранения URL загруженных фотографий
    const uploadedPhotos = [];

    try {
        // Обрабатываем каждый файл
        for (const item of formData) {
            if (item.name === 'photos' && item.data && item.filename) {
                // Загружаем файл
                const fileUrl = await uploadFile(item.data, item.filename);

                // Сохраняем информацию о фото в базе данных
                const photo = await prisma.photo.create({
                    data: {
                        url: fileUrl,
                        title: item.filename,
                        photographerId: photographerId,
                    },
                });

                uploadedPhotos.push(photo);
            }
        }

        // Получаем обновленный список фотографий фотографа
        const updatedPhotos = await prisma.photo.findMany({
            where: { photographerId: photographerId },
        });

        return {
            success: true,
            photos: updatedPhotos,
        };
    } catch (error) {
        console.error('Error uploading photos:', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to Save Photos',
        });
    }
});