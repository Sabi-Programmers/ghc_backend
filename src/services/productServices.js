import slugify from "slugify";
import database from "../libs/prisma.js";
import { excludeData } from "../utils/index.js";

const getAllProducts = async (page, perPage, productType, category) => {
  // Build filter object based on provided parameters
  const filters = {};
  if (productType && productType !== "all") {
    filters.productType = productType.toUpperCase();
  }
  if (category && category !== "all") {
    filters.category = category;
  }

  // Fetch products with pagination and applied filters
  const products = await database.product.findMany({
    where: filters,
    select: {
      id: true,
      name: true,
      sellingPrice: true,
      description: true,
      category: true,
      photo: true,
      slug: true,
      productType: true,
    },
    skip: (page - 1) * perPage,
    take: perPage,
    orderBy: { updatedAt: "desc" },
  });

  // Get total item count based on the same filters
  const totalItem = await database.product.count({
    where: filters,
  });

  return { products, totalItem };
};

const getSingleProduct = async (slug, id, selectOption = null) => {
  let whereClause = {};
  if (slug) {
    whereClause = { slug };
  } else {
    whereClause = { id };
  }
  const query = {
    where: whereClause,
  };

  if (selectOption) {
    query.select = selectOption;
  }
  const product = await database.product.findUnique(query);
  if (!product) {
    return null;
  }

  return excludeData(product, ["price", "updatedAt"]);
};

const generateProduct = async () => {
  const categories = [
    "Footwear",
    "Headwear",
    "Books",
    "Electronics",
    "Clothing",
  ];
  const productTypes = ["PHYSICAL", "DIGITAL"];
  const descriptions = [
    "This is an amazing product that you will love!",
    "Top quality and affordable price.",
    "Get it now while stocks last.",
    "Limited edition item, grab it before it's gone!",
    "Highly recommended by our customers.",
  ];

  function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  function getRandomPrice(min, max) {
    return (Math.random() * (max - min) + min).toFixed(2);
  }

  function getRandomDate() {
    const start = new Date(2023, 0, 1);
    const end = new Date();
    return new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
    );
  }

  function generateRandomProducts(num) {
    const products = [];
    for (let i = 4; i <= num; i++) {
      const createdAt = getRandomDate();
      const updatedAt = getRandomDate();
      products.push({
        name: `Product ${i}`,
        slug: `Product-${i}`,
        price: parseFloat(getRandomPrice(5, 100)),
        sellingPrice: parseFloat(getRandomPrice(10, 150)),
        productType: getRandomElement(productTypes),
        category: getRandomElement(categories),
        description: getRandomElement(descriptions),
        photo: `https://via.placeholder.com/${
          Math.floor(Math.random() * 100) + 300
        }x${Math.floor(Math.random() * 100) + 300}`,
        file: null,
        createdAt: createdAt.toISOString(),
        updatedAt:
          updatedAt > createdAt
            ? updatedAt.toISOString()
            : createdAt.toISOString(),
      });
    }
    return products;
  }

  const randomProducts = generateRandomProducts(30);
  return await database.product.createMany({
    data: randomProducts,
  });
};

const createProduct = async ({
  name,
  description,
  price,
  sellingPrice,
  photo,
  productType,
  category,
}) => {
  const slug = slugify(name + "-" + Math.floor(100 + Math.random() * 900));

  return await database.product.create({
    data: {
      name,
      description,
      price: parseFloat(price),
      sellingPrice: parseFloat(sellingPrice),
      photo,
      slug,
      category: category ? category : null,
      productType: productType.toUpperCase(),
    },
  });
};

const uploadProductFile = async (id, file) => {
  return await database.product.update({
    where: { id: Number(id) },
    data: {
      file,
    },
  });
};

const getSponsor = async (username) => {
  // find sponspor and upline
  const sponsor = await database.user.findUnique({
    where: { username },
    select: { id: true, sponsorId: true },
  });
  if (!sponsor) {
    return null;
  }
  return sponsor;
};

const paySalesIncome = async (sponsor, gain, productType) => {
  const { sponsorId, id } = sponsor;
  // create sales income for sponsor and 50%
  const fiftyPercent = parseFloat((gain / 2).toFixed());
  await database.salesIncomeBonus.create({
    data: {
      productType,
      userId: id,
      amount: fiftyPercent,
      agent: "Myself",
    },
  });

  if (sponsorId !== 0) {
    // create sales income for upline and 25% to upline
    const twentyfivePercent = parseFloat((gain / 4).toFixed());
    await database.salesIncomeBonus.create({
      data: {
        productType,
        userId: sponsorId,
        amount: twentyfivePercent,
        agent: "Downline",
      },
    });
  }
  return true;
};

export {
  getAllProducts,
  generateProduct,
  getSingleProduct,
  createProduct,
  uploadProductFile,
  getSponsor,
  paySalesIncome,
};
