import { prisma } from "~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { commentId, photographerId } = body;

    const review = await prisma.rating.delete({
      where: { id: Number(commentId), photographerId: Number(photographerId) },
    })

    if(!review) {
      return { success: false, message: "Відгука не існує" };
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
      message: "Відгук видаленний!",
      photographer
    };
  } catch (error) {
    console.error("Помилка видалення відгуку:", error);
    return {
      success: false,
      message: "Помилка на сервері",
    };
  }
});
