import { prisma } from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
      const body = await readBody(event);

  const { name, phone, date, photographerId, userId } = body;

  if (!name || !phone || !date || !photographerId || !userId) {
    return { statusCode: 400, statusMessage: "Всі поля обовʼязкові", body }
  }
  

  const booking = await prisma.booking.create({
    data: {
      name,
      phone,
      date: date,
      photographerId: Number(photographerId),
      userId
    },
  });

  if(!booking) return { status: 404, message: "Not found" };

  const photographer = await prisma.photographer.findUnique({
      where: { id: Number(photographerId) },
      include: {
        photos: true,
        ratings: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
              }
            }
          }
        },
        bookings: {
          select: {
            user: true,
            date: true
          }
        }
      },
    });
  if(!photographer) return { status: 404, message: "Фотографа не знайдено" };

  return {photographer, booking};
  } catch (error) {
    return { status: 400, message: "Bad Request", error };
  }
});
