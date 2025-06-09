import {prisma} from "../../../utils/prisma";

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  if (!id) return { status: 400, message: "Missing ID" };

  const photographer = await prisma.photographer.findFirst({
    where: {
        userId: +id
    }
  })
  if (!photographer) return { status: 404, message: "Photographer not found" };

  const booking = await prisma.booking.findMany({
    where: { photographerId: +photographer.id },
  });

  if (!booking) return { status: 404, message: "Bookings not found" };
  return {status: 200, booking: booking};
});
