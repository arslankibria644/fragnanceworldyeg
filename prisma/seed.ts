import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123456", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@luxescents.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@luxescents.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log("✅ Admin user created:", admin.email);

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({ where: { slug: "mens-perfumes" }, update: {}, create: { name: "Men's Perfumes", slug: "mens-perfumes", description: "Masculine fragrances for the modern man" } }),
    prisma.category.upsert({ where: { slug: "womens-perfumes" }, update: {}, create: { name: "Women's Perfumes", slug: "womens-perfumes", description: "Elegant fragrances for the sophisticated woman" } }),
    prisma.category.upsert({ where: { slug: "unisex" }, update: {}, create: { name: "Unisex", slug: "unisex", description: "Fragrances for everyone" } }),
    prisma.category.upsert({ where: { slug: "niche" }, update: {}, create: { name: "Niche", slug: "niche", description: "Exclusive niche fragrances" } }),
    prisma.category.upsert({ where: { slug: "decants" }, update: {}, create: { name: "Decants", slug: "decants", description: "Try before you buy" } }),
  ]);
  console.log("✅ Categories created:", categories.length);

  // Create brands
  const brands = await Promise.all([
    prisma.brand.upsert({ where: { slug: "dior" }, update: {}, create: { name: "Dior", slug: "dior", featured: true, description: "Christian Dior - French luxury fashion house" } }),
    prisma.brand.upsert({ where: { slug: "chanel" }, update: {}, create: { name: "Chanel", slug: "chanel", featured: true, description: "Iconic French fashion house" } }),
    prisma.brand.upsert({ where: { slug: "tom-ford" }, update: {}, create: { name: "Tom Ford", slug: "tom-ford", featured: true, description: "American luxury fashion designer" } }),
    prisma.brand.upsert({ where: { slug: "creed" }, update: {}, create: { name: "Creed", slug: "creed", featured: true, description: "Royal perfumers since 1760" } }),
    prisma.brand.upsert({ where: { slug: "versace" }, update: {}, create: { name: "Versace", slug: "versace", featured: false, description: "Italian luxury fashion house" } }),
    prisma.brand.upsert({ where: { slug: "ysl" }, update: {}, create: { name: "Yves Saint Laurent", slug: "ysl", featured: true, description: "French luxury fashion brand" } }),
    prisma.brand.upsert({ where: { slug: "armani" }, update: {}, create: { name: "Giorgio Armani", slug: "armani", featured: false, description: "Italian luxury fashion brand" } }),
    prisma.brand.upsert({ where: { slug: "baccarat-rouge" }, update: {}, create: { name: "Maison Francis Kurkdjian", slug: "baccarat-rouge", featured: true, description: "Parisian perfume house" } }),
  ]);
  console.log("✅ Brands created:", brands.length);

  // Create sample products
  const diorBrand = brands.find((b) => b.slug === "dior")!;
  const mfkBrand = brands.find((b) => b.slug === "baccarat-rouge")!;
  const creedBrand = brands.find((b) => b.slug === "creed")!;
  const tomFordBrand = brands.find((b) => b.slug === "tom-ford")!;

  const mensCat = categories.find((c) => c.slug === "mens-perfumes")!;
  const unisexCat = categories.find((c) => c.slug === "unisex")!;
  const nicheCat = categories.find((c) => c.slug === "niche")!;

  // Product 1: Dior Sauvage
  const sauvage = await prisma.product.upsert({
    where: { slug: "dior-sauvage" },
    update: {},
    create: {
      name: "Sauvage",
      slug: "dior-sauvage",
      brandId: diorBrand.id,
      categoryId: mensCat.id,
      type: "FULL_BOTTLE",
      description: "A radically fresh composition, Dior Sauvage is both raw and noble. An encounter between a solar, fresh and lively masculinity. The freshness of Calabrian bergamot, revealing notes of pepper and patchouli.",
      fragranceNotes: {
        top: ["Calabrian Bergamot", "Pepper"],
        middle: ["Lavender", "Pink Pepper", "Vetiver", "Patchouli", "Geranium"],
        base: ["Ambroxan", "Cedar", "Labdanum"],
      },
      gender: "MENS",
      images: [
        "https://images.unsplash.com/photo-1541643600914-78b084683702?w=800",
        "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800",
      ],
      basePrice: 12000,
      discount: 0,
      isFeatured: true,
      isNewArrival: false,
      isBestSeller: true,
      metaTitle: "Dior Sauvage - Buy Online in Pakistan",
      metaDescription: "Buy authentic Dior Sauvage perfume online in Pakistan. Fresh, masculine fragrance with bergamot and ambroxan.",
      variants: {
        create: [
          { size: "60ml", price: 12000, stock: 25, sku: "DIOR-SAU-60ML" },
          { size: "100ml", price: 18000, stock: 15, sku: "DIOR-SAU-100ML" },
          { size: "200ml", price: 28000, stock: 8, sku: "DIOR-SAU-200ML" },
        ],
      },
    },
  });

  // Product 2: Baccarat Rouge 540 Decant
  const br540 = await prisma.product.upsert({
    where: { slug: "baccarat-rouge-540-decant" },
    update: {},
    create: {
      name: "Baccarat Rouge 540",
      slug: "baccarat-rouge-540-decant",
      brandId: mfkBrand.id,
      categoryId: nicheCat.id,
      type: "DECANT",
      description: "Baccarat Rouge 540 is a masterpiece of perfumery created by Francis Kurkdjian for the French crystal manufacturer Baccarat. A luminous, woody, and floral fragrance that has become an icon of modern perfumery.",
      fragranceNotes: {
        top: ["Jasmine", "Saffron"],
        middle: ["Amberwood", "Ambergris"],
        base: ["Fir Resin", "Cedar"],
      },
      gender: "UNISEX",
      images: [
        "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800",
      ],
      basePrice: 1500,
      discount: 0,
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
      variants: {
        create: [
          { size: "2ml", price: 1500, stock: 50, sku: "MFK-BR540-2ML" },
          { size: "5ml", price: 3000, stock: 30, sku: "MFK-BR540-5ML" },
          { size: "10ml", price: 5500, stock: 20, sku: "MFK-BR540-10ML" },
          { size: "15ml", price: 8000, stock: 15, sku: "MFK-BR540-15ML" },
        ],
      },
    },
  });

  // Product 3: Creed Aventus
  const aventus = await prisma.product.upsert({
    where: { slug: "creed-aventus" },
    update: {},
    create: {
      name: "Aventus",
      slug: "creed-aventus",
      brandId: creedBrand.id,
      categoryId: mensCat.id,
      type: "FULL_BOTTLE",
      description: "Aventus celebrates the life of a strong, successful man. With a rich history of over two centuries of perfume making, Creed has created a scent that combines strength and class, inspired by the dramatic life of a historic emperor.",
      fragranceNotes: {
        top: ["Pineapple", "Bergamot", "Black Currant", "Apple"],
        middle: ["Birch", "Patchouli", "Rose", "Jasmine"],
        base: ["Musk", "Oak Moss", "Ambergris", "Vanilla"],
      },
      gender: "MENS",
      images: [
        "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800",
      ],
      basePrice: 35000,
      discount: 5,
      isFeatured: true,
      isNewArrival: false,
      isBestSeller: true,
      variants: {
        create: [
          { size: "50ml", price: 35000, stock: 10, sku: "CREED-AV-50ML" },
          { size: "100ml", price: 60000, stock: 5, sku: "CREED-AV-100ML" },
        ],
      },
    },
  });

  // Product 4: Tom Ford Oud Wood
  const oudWood = await prisma.product.upsert({
    where: { slug: "tom-ford-oud-wood" },
    update: {},
    create: {
      name: "Oud Wood",
      slug: "tom-ford-oud-wood",
      brandId: tomFordBrand.id,
      categoryId: unisexCat.id,
      type: "FULL_BOTTLE",
      description: "Tom Ford Oud Wood is a smooth, sophisticated blend for those who appreciate complexity. Rare oud wood is blended with rosewood and cardamom, then a hint of sandalwood, vetiver, and amber create an unexpected sensuality.",
      fragranceNotes: {
        top: ["Cardamom", "Chinese Pepper", "Rosewood"],
        middle: ["Agarwood (Oud)", "Sandalwood", "Vetiver"],
        base: ["Tonka Bean", "Amber", "Musk"],
      },
      gender: "UNISEX",
      images: [
        "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=800",
      ],
      basePrice: 22000,
      discount: 10,
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: false,
      variants: {
        create: [
          { size: "50ml", price: 22000, stock: 12, sku: "TF-OW-50ML" },
          { size: "100ml", price: 38000, stock: 7, sku: "TF-OW-100ML" },
        ],
      },
    },
  });

  console.log("✅ Sample products created: Sauvage, BR540 Decant, Aventus, Oud Wood");

  // Create sample coupon
  await prisma.coupon.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: {
      code: "WELCOME10",
      type: "PERCENTAGE",
      value: 10,
      minOrder: 5000,
      isActive: true,
      freeShipping: false,
    },
  });
  console.log("✅ Sample coupon created: WELCOME10 (10% off orders over CAD 10)");

  // Create theme settings
  await prisma.themeSettings.create({
    data: {
      primaryColor: "#d4af37",
      secondaryColor: "#1a1a1a",
      accentColor: "#c9a227",
      fontHeading: "Playfair Display",
      fontBody: "Inter",
    },
  }).catch(() => {}); // Ignore if already exists

  console.log("✅ Theme settings initialized");
  console.log("\n🎉 Seeding completed!\n");
  console.log("Admin credentials:");
  console.log("  Email: admin@luxescents.com");
  console.log("  Password: admin123456");
  console.log("\nSample coupon: WELCOME10 (10% off)");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
