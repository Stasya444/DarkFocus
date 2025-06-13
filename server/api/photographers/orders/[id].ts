import { prisma } from "../../../utils/prisma";

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  if (!id) return { status: 400, message: "Missing ID" };

  const user = await prisma.user.findUnique({
    where: { id: +id },
  });

  if (!user) return { status: 404, message: "User not found" };

  // 🔐 Якщо адмін — повертаємо всі замовлення
  if (user.role === "admin") {
    const allBookings = await prisma.booking.findMany({
      include: {
        user: true,
      },
    });
    return { status: 200, booking: allBookings };
  }

  // 📸 Якщо фотограф — знайдемо його профіль
  const photographer = await prisma.photographer.findFirst({
    where: { userId: +id },
  });

  if (!photographer) return { status: 404, message: "Photographer not found" };

  const bookings = await prisma.booking.findMany({
    where: { photographerId: photographer.id },
    include: {
      user: true,
    },
  });

  return { status: 200, booking: bookings };
});
