import { prisma } from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  const { id } = await readBody(event);

  await prisma.photographer.delete({
    where: { id: Number(id) },
  });

  return { success: true };
});
