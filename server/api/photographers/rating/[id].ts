import {prisma} from "../../../utils/prisma";

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  if (!id) return { status: 400, message: "Missing ID" };

  const rating = await prisma.rating.findMany({
    where: { photographerId: Number(id) },
  });

  if (!rating) return { status: 404, message: "Not found" };
  return {status: 200, rating: rating};
});
