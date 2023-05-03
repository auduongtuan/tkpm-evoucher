import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync("123456", salt);
import { faker } from "@faker-js/faker";
import { toNonAccentVietnamese } from "helpers";
faker.setLocale("vi");
async function main() {
  // ... you will write your Prisma Client queries here
  // const user = await prisma.user.create({
  //   data: {
  //     fullName: "Nguyen Van An",
  //     email: "an@evoucher.dev",
  //     password: hash,
  //     phone: "0948920320",
  //   },
  // });
  // console.log(user);

  // Create Staff
  // const fullName = faker.name.fullName();
  // const email = faker.internet.email(fullName);
  // const staff = await prisma.staff.create({
  //   data: {
  //     fullName,
  //     email,
  //     phone: faker.phone.number(),
  //     password: hash,
  //     systemAdmin: true,
  //   },
  // });
  // console.log(staff);

  // const merchants = await prisma.category.createMany({
  //   data: [
  //     {
  //       name: "The coffee house",
  //     },
  //     {
  //       name: "Pizza 4ps",
  //     },
  //     {
  //       name: "Cheese coffee",
  //     },
  //     {
  //       name: "Gong cha",
  //     },
  //     {
  //       name: "Phuc Long",
  //     },
  //     {
  //       name: "Highland",
  //     },
  //     {
  //       name: "A Chanh",
  //     },
  //   ],
  // });
  // console.log(merchants);

  // const categories = await prisma.category.createMany({
  //   data: [
  //     {
  //       name: "Coffee",
  //     },
  //     {
  //       name: "Trà sữa",
  //     },
  //     {
  //       name: "Nước ép - Sinh tố",
  //     },
  //     {
  //       name: "Bún đậu",
  //     },
  //     {
  //       name: "Bánh ngọt",
  //     },
  //   ],
  // });

  const stores = await prisma.store.createMany({
    data: [
      {
        name: "The Coffee House - Hoàng Diệu 2",
        merchantId: 1,
        address:
          "66E Đ. Hoàng Diệu 2, Phường Linh Trung, Thủ Đức, Thành phố Hồ Chí Minh 700000, Vietnam",
        lat: 10.86357250804964,
        lng: 106.76358757878761,
      },
      {
        name: "The Coffee House - Nguyen Thai Binh",
        merchantId: 1,
        address:
          "141 Đ. Nguyễn Thái Bình, Phường Nguyễn Thái Bình, Quận 1, Thành phố Hồ Chí Minh 700000, Vietnam",
        lat: 10.76918406526508,
        lng: 106.69911672999204,
      },
      {
        name: "Pizza 4P's - Lê Thánh Tôn",
        merchantId: 2,
        address:
          "8/15, Đ. Lê Thánh Tôn, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh 700000, Vietnam",
        lat: 10.78203711333918,
        lng: 106.7051479295118,
      },
      {
        name: "Pizza 4P's - Hai Bà Trưng",
        address:
          "151b Hai Bà Trưng, Phường 6, Quận 3, Thành phố Hồ Chí Minh 700000, Vietnam",
        merchantId: 2,
        lat: 10.78372680518978,
        lng: 106.69704960738156,
      },
      {
        name: "Pizza 4P's - Xuân Thủy",
        merchantId: 2,
        address:
          "48/01 Xuân Thủy, Thảo Điền, Tp Thủ đức, Thành phố Hồ Chí Minh 700000, Vietnam",
        lat: 10.802865268290207,
        lng: 106.73091969077285,
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
