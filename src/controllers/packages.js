import asyncWrapper from "../middlewares/asyncWrapper.js";

const buyPackages = asyncWrapper(async (req, res) => {
  // get packages from the request body
  // looop
  const packages = [
    {
      package: "BRONZE",
      unit: 1,
    },
    {
      package: "GOLD",
      unit: 2,
    },
  ];

  const prices = {
    bronze: 4.1,
    gold: 12.3,
    diamond: 36.9,
  };

  const balance = 30.1;

  res.json({ test: "test" });
});

export { buyPackages };
