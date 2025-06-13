import { prisma } from "~/server/utils/prisma";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import { mkdir } from "fs/promises";

export default defineEventHandler(async (event) => {
  try {
    const form = await readMultipartFormData(event);
    if (!form) {
      throw createError({
        statusCode: 400,
        statusMessage: "Форма не надійшла",
      });
    }

    const fields = {};
    let avatarFile = null;

    for (const item of form) {
      if (item.name === "avatar" && item.filename) {
        avatarFile = item;
      } else {
        fields[item.name] = Buffer.isBuffer(item.data)
          ? item.data.toString()
          : item.data;
      }
    }

    const { name, about, city, style, price } = fields;

    if (!name || !about || !city || !style || !price) {
      throw createError({
        statusCode: 400,
        statusMessage: "Всі поля обовʼязкові",
      });
    }

    const priceNum = Number(price);
    if (isNaN(priceNum) || priceNum < 0) {
      throw createError({
        statusCode: 400,
        statusMessage: "Ціна має бути дійсним числом",
      });
    }

    const updateData = {
      name,
      about,
      city,
      style,
      price: priceNum,
    };

    if (avatarFile) {
      const uploadDir = join(process.cwd(), "public/uploads");
      await mkdir(uploadDir, { recursive: true });

      const extension = avatarFile.filename.split(".").pop();
      const filename = `${uuidv4()}.${extension}`;
      const filePath = join(uploadDir, filename);
      const avatarUrl = `/uploads/${filename}`;

      await writeFile(filePath, avatarFile.data);

      const currentPhotographer = await prisma.photographer.findUnique({
        where: { id: Number(event.context.params?.id) },
      });

      if (currentPhotographer?.avatar) {
        const oldAvatarPath = join(
          process.cwd(),
          "public",
          currentPhotographer.avatar
        );
        try {
          await unlink(oldAvatarPath);
        } catch (err) {
          console.warn(`Failed to delete old avatar: ${oldAvatarPath}`, err);
        }
      }

      updateData.avatar = avatarUrl;
    }

    const update = await prisma.photographer.update({
      where: {
        id: Number(event.context.params?.id),
      },
      data: updateData,
    });

    if (!update) {
      throw createError({
        statusCode: 404,
        statusMessage: "Фотограф не знайдений",
      });
    }

    return {
      statusCode: 200,
      message: "Фотограф успішно оновлений",
      photographer: update,
    };
  } catch (error) {
    console.error("Error in photographer submission:", error);

    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Внутрішня помилка сервера",
    });
  }
});