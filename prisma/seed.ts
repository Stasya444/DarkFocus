import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

async function main() {
  try {
    // Clean up existing data
    await prisma.photo.deleteMany();
    await prisma.rating.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.photographer.deleteMany();
    await prisma.user.deleteMany();

    const photographersData = [
      {
        user: {
          name: "Anna Petrova",
          email: "anna@gmail.com",
          phone: "+380501112233",
        },
        photographer: {
          name: "Anna Petrova",
          city: "Lviv",
          style: "Wedding",
          price: 1500,
          about: "Capturing love and happiness in every frame.",
          avatar: "/uploads/anna.jpg",
          isVerified: true,
        },
        photos: ["anna1.jpg", "anna2.jpg", "anna3.jpg"],
      },
      {
        user: {
          name: "Ivan Sydorenko",
          email: "ivan@gmail.com",
          phone: "+380502223344",
        },
        photographer: {
          name: "Ivan Sydorenko",
          city: "Kyiv",
          style: "Reportage",
          price: 1200,
          about: "Documenting real life moments as they are.",
          avatar: "/uploads/ivan.jpg",
          isVerified: true,
        },
        photos: ["ivan1.jpg", "ivan2.jpg", "ivan3.jpg"],
      },
      {
        user: {
          name: "Maria Kovalenko",
          email: "maria@gmail.com",
          phone: "+380503334455",
        },
        photographer: {
          name: "Maria Kovalenko",
          city: "Odesa",
          style: "Portrait",
          price: 900,
          about: "Emotion-driven portraits that tell a story.",
          avatar: "/uploads/maria.jpg",
          isVerified: false,
        },
        photos: ["maria1.jpg", "maria2.jpg", "maria3.jpg"],
      },
      {
        user: {
          name: "Dmytro Bondarenko",
          email: "dmytro@gmail.com",
          phone: "+380504445566",
        },
        photographer: {
          name: "Dmytro Bondarenko",
          city: "Kharkiv",
          style: "Fashion",
          price: 1800,
          about: "Creative shots for magazines and runway vibes.",
          avatar: "/uploads/dmytro.jpg",
          isVerified: true,
        },
        photos: ["dmytro1.jpg", "dmytro2.jpg", "dmytro3.jpg"],
      },
      {
        user: {
          name: "Olena Shevchenko",
          email: "olena@gmail.com",
          phone: "+380505556677",
        },
        photographer: {
          name: "Olena Shevchenko",
          city: "Dnipro",
          style: "Nature",
          price: 1000,
          about: "Finding beauty in every leaf and sunset.",
          avatar: "/uploads/olena.jpg",
          isVerified: false,
        },
        photos: ["olena1.jpg", "olena2.jpg", "olena3.jpg"],
      },
      {
        user: {
          name: "Andriy Vasylenko",
          email: "andriy@gmail.com",
          phone: "+380506667788",
        },
        photographer: {
          name: "Andriy Vasylenko",
          city: "Zaporizhzhia",
          style: "Street",
          price: 1100,
          about: "Street vibes and raw urban moments.",
          avatar: "/uploads/andriy.jpg",
          isVerified: true,
        },
        photos: ["andriy1.jpg", "andriy2.jpg", "andriy3.jpg"],
      },
      {
        user: {
          name: "Natalia Hryn",
          email: "natalia@gmail.com",
          phone: "+380507778899",
        },
        photographer: {
          name: "Natalia Hryn",
          city: "Vinnytsia",
          style: "Family",
          price: 1300,
          about: "Memories for generations to come.",
          avatar: "/uploads/natalia.jpg",
          isVerified: false,
        },
        photos: ["natalia1.jpg", "natalia2.jpg", "natalia3.jpg"],
      },
      {
        user: {
          name: "Serhii Kravets",
          email: "serhii@gmail.com",
          phone: "+380508889900",
        },
        photographer: {
          name: "Serhii Kravets",
          city: "Poltava",
          style: "Travel",
          price: 1400,
          about: "Across cities and cultures — I bring stories.",
          avatar: "/uploads/serhii.jpg",
          isVerified: true,
        },
        photos: ["serhii1.jpg", "serhii2.jpg", "serhii3.jpg"],
      },
      {
        user: {
          name: "Yulia Romanenko",
          email: "yulia@gmail.com",
          phone: "+380509991122",
        },
        photographer: {
          name: "Yulia Romanenko",
          city: "Rivne",
          style: "Studio",
          price: 1600,
          about: "Perfect light, perfect frame, perfect you.",
          avatar: "/uploads/yulia.jpg",
          isVerified: true,
        },
        photos: ["yulia1.jpg", "yulia2.jpg", "yulia3.jpg"],
      },
      {
        user: {
          name: "Taras Melnyk",
          email: "taras@gmail.com",
          phone: "+380501234567",
        },
        photographer: {
          name: "Taras Melnyk",
          city: "Ternopil",
          style: "Artistic",
          price: 1700,
          about: "Art in every shadow and shape.",
          avatar: "/uploads/taras.jpg",
          isVerified: false,
        },
        photos: ["taras1.jpg", "taras2.jpg", "taras3.jpg"],
      },
    ];

    for (const entry of photographersData) {
      const user = await prisma.user.create({
        data: {
          name: entry.user.name,
          email: entry.user.email,
          phone: entry.user.phone,
          password: await bcrypt.hash("12345", await bcrypt.genSalt(10)),
          role: "photographer",
        },
      });

      const photographer = await prisma.photographer.create({
        data: {
          ...entry.photographer,
          userId: user.id,
        },
      });

      await prisma.photo.createMany({
        data: entry.photos.map((filename) => ({
          url: `/uploads/${filename}`,
          photographerId: photographer.id,
        })),
      });
    }
  } catch (error) {
    console.error(error);
  }
}

main()
  .then(() => console.log("Seed completed successfully"))
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
