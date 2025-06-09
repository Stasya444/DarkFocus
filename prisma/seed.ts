import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

async function main() {
  // Clean up existing data
  await prisma.photo.deleteMany();
  await prisma.rating.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.photographer.deleteMany();
  await prisma.user.deleteMany();

  // Photographer 1
  const user1 = await prisma.user.create({
    data: {
      name: "Anna Petrova",
      email: "anna@gmail.com",
      phone: "+380501112233",
      password:  await bcrypt.hash("12345", await bcrypt.genSalt(10)),
      role: "photographer",
    },
  });

  await prisma.photographer.create({
    data: {
      name: "Anna Petrova",
      city: "Lviv",
      style: "Wedding",
      price: 1500,
      about: "Capturing love and happiness in every frame.",
      experience: 3,
      avatar: "/uploads/anna.jpg",
      ordersCount: 12,
      isVerified: true,
      userId: user1.id,
    },
  });

  // Photographer 2
  const user2 = await prisma.user.create({
    data: {
      name: "Ivan Sydorenko",
      email: "ivan@gmail.com",
      phone: "+380502223344",
      password: await bcrypt.hash("12345", await bcrypt.genSalt(10)),
      role: "photographer",
    },
  });

  await prisma.photographer.create({
    data: {
      name: "Ivan Sydorenko",
      city: "Kyiv",
      style: "Reportage",
      price: 1200,
      about: "Documenting real life moments as they are.",
      experience: 5,
      avatar: "/uploads/ivan.jpg",
      ordersCount: 20,
      isVerified: true,
      userId: user2.id,
    },
  });

  // Photographer 3
  const user3 = await prisma.user.create({
    data: {
      name: "Maria Kovalenko",
      email: "maria@gmail.com",
      phone: "+380503334455",
      password:  await bcrypt.hash("12345", await bcrypt.genSalt(10)),
      role: "photographer",
    },
  });

  await prisma.photographer.create({
    data: {
      name: "Maria Kovalenko",
      city: "Odesa",
      style: "Portrait",
      price: 900,
      about: "Emotion-driven portraits that tell a story.",
      experience: 2,
      avatar: "/uploads/maria.jpg",
      ordersCount: 7,
      isVerified: false,
      userId: user3.id,
    },
  });

  // Photographer 4
  const user4 = await prisma.user.create({
    data: {
      name: "Dmytro Bondarenko",
      email: "dmytro@gmail.com",
      phone: "+380504445566",
      password:  await bcrypt.hash("12345", await bcrypt.genSalt(10)),
      role: "photographer",
    },
  });

  await prisma.photographer.create({
    data: {
      name: "Dmytro Bondarenko",
      city: "Kharkiv",
      style: "Fashion",
      price: 1800,
      about: "Creative shots for magazines and runway vibes.",
      experience: 7,
      avatar: "/uploads/dmytro.jpg",
      ordersCount: 15,
      isVerified: true,
      userId: user4.id,
    },
  });

  // Photographer 5
  const user5 = await prisma.user.create({
    data: {
      name: "Olena Shevchenko",
      email: "olena@gmail.com",
      phone: "+380505556677",
      password:  await bcrypt.hash("12345", await bcrypt.genSalt(10)),
      role: "photographer",
    },
  });

  await prisma.photographer.create({
    data: {
      name: "Olena Shevchenko",
      city: "Dnipro",
      style: "Nature",
      price: 1000,
      about: "Finding beauty in every leaf and sunset.",
      experience: 4,
      avatar: "/uploads/olena.jpg",
      ordersCount: 10,
      isVerified: false,
      userId: user5.id,
    },
  });

  // Photographer 6
  const user6 = await prisma.user.create({
    data: {
      name: "Andriy Vasylenko",
      email: "andriy@gmail.com",
      phone: "+380506667788",
      password:  await bcrypt.hash("12345", await bcrypt.genSalt(10)),
      role: "photographer",
    },
  });

  await prisma.photographer.create({
    data: {
      name: "Andriy Vasylenko",
      city: "Zaporizhzhia",
      style: "Street",
      price: 1100,
      about: "Street vibes and raw urban moments.",
      experience: 6,
      avatar: "/uploads/andriy.jpg",
      ordersCount: 18,
      isVerified: true,
      userId: user6.id,
    },
  });

  // Photographer 7
  const user7 = await prisma.user.create({
    data: {
      name: "Natalia Hryn",
      email: "natalia@gmail.com",
      phone: "+380507778899",
      password:  await bcrypt.hash("12345", await bcrypt.genSalt(10)),
      role: "photographer",
    },
  });

  await prisma.photographer.create({
    data: {
      name: "Natalia Hryn",
      city: "Vinnytsia",
      style: "Family",
      price: 1300,
      about: "Memories for generations to come.",
      experience: 4,
      avatar: "/uploads/natalia.jpg",
      ordersCount: 8,
      isVerified: false,
      userId: user7.id,
    },
  });

  // Photographer 8
  const user8 = await prisma.user.create({
    data: {
      name: "Serhii Kravets",
      email: "serhii@gmail.com",
      phone: "+380508889900",
      password:  await bcrypt.hash("12345", await bcrypt.genSalt(10)),
      role: "photographer",
    },
  });

  await prisma.photographer.create({
    data: {
      name: "Serhii Kravets",
      city: "Poltava",
      style: "Travel",
      price: 1400,
      about: "Across cities and cultures — I bring stories.",
      experience: 7,
      avatar: "/uploads/serhii.jpg",
      ordersCount: 25,
      isVerified: true,
      userId: user8.id,
    },
  });

  // Photographer 9
  const user9 = await prisma.user.create({
    data: {
      name: "Yulia Romanenko",
      email: "yulia@gmail.com",
      phone: "+380509991122",
      password:  await bcrypt.hash("12345", await bcrypt.genSalt(10)),
      role: "photographer",
    },
  });

  await prisma.photographer.create({
    data: {
      name: "Yulia Romanenko",
      city: "Rivne",
      style: "Studio",
      price: 1600,
      about: "Perfect light, perfect frame, perfect you.",
      experience: 5,
      avatar: "/uploads/yulia.jpg",
      ordersCount: 22,
      isVerified: true,
      userId: user9.id,
    },
  });

  // Photographer 10
  const user10 = await prisma.user.create({
    data: {
      name: "Taras Melnyk",
      email: "taras@gmail.com",
      phone: "+380501234567",
      password:  await bcrypt.hash("12345", await bcrypt.genSalt(10)),
      role: "photographer",
    },
  });

  await prisma.photographer.create({
    data: {
      name: "Taras Melnyk",
      city: "Ternopil",
      style: "Artistic",
      price: 1700,
      about: "Art in every shadow and shape.",
      experience: 6,
      avatar: "/uploads/taras.jpg",
      ordersCount: 16,
      isVerified: false,
      userId: user10.id,
    },
  });
}

main()
  .then(() => console.log("Seed completed successfully"))
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
