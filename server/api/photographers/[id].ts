import { tr } from "@nuxt/ui/runtime/locale/index.js";
import {prisma} from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  if (!id) return { status: 400, message: "Missing ID" };

  const photographer = await prisma.photographer.findUnique({
    where: { id: Number(id) },
    include: {
      photos: true,
      user: true, 
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

  return {photographer}
});
