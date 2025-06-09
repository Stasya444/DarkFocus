import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  await prisma.photo.deleteMany();
  await prisma.photographer.deleteMany();
  await prisma.user.deleteMany();

  const users = await prisma.user.createMany({
    data: Array.from({ length: 10 }).map((_, i) => ({
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      phone: `+38050123456${i}`,
      password: "hashed_password_here",
      role: "photographer",
    })),
  });

  const userList = await prisma.user.findMany();

  const photographers = await Promise.all(
    userList.map((user: { id: number }, index: number) =>
      prisma.photographer.create({
        data: {
          name: `Photographer ${index + 1}`,
          city: "London",
          style: "Documentary",
          price: 500,
          about:
            "Professional photographer based in the UK with years of experience.",
          experience: 5 + index,
          ordersCount: 0,
          avatar: `avatar${index + 1}.jpg`,
          isVerified: true,
          userId: user.id,
        },
      })
    )
  );

  for (let i = 0; i < photographers.length; i++) {
    await prisma.photo.createMany({
      data: [
        {
          url: `photo${i + 1}_1.jpg`,
          title: `Photo 1 by Photographer ${i + 1}`,
          photographerId: photographers[i].id,
        },
        {
          url: `photo${i + 1}_2.jpg`,
          title: `Photo 2 by Photographer ${i + 1}`,
          photographerId: photographers[i].id,
        },
        {
          url: `photo${i + 1}_3.jpg`,
          title: `Photo 3 by Photographer ${i + 1}`,
          photographerId: photographers[i].id,
        },
      ],
    });
  }

  console.log("✅ Seed data created");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
