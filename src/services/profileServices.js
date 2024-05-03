const getUserProfile = async () => {
  const user = await database.user.findUnique({
    where: { id: req.user.id },
  });

  return excludeData(user, ["password"]);
};

export { getUserProfile };
