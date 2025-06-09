import { prisma } from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    const { author, comment, rating, photographerId } = body;

    if (!author || !comment || !rating || !photographerId) {
      return { success: false, message: "Заповніть усі обов’язкові поля" };
    }

    const review = await prisma.rating.create({
      data: {
        authorId: Number(author),
        comment,
        rating: Number(rating),
        photographerId: Number(photographerId),
      },
      select: {
        author: true
      }
    });

    if (!review) {
      return { success: false, message: "Не вдалося зберегти відгук" };
    }

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
        bookings: true
      },
    });

    if (!photographer) return { status: 404, message: "Not found" };

    return {
      success: true,
      message: "Відгук збережено!",
      review,
      photographer
    };
  } catch (error) {
    console.error("Помилка створення відгуку:", error);
    return {
      success: false,
      message: "Помилка на сервері",
    };
  }
});
