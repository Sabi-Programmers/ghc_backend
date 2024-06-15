import database from '../libs/prisma.js'

const getContants = async () =>
    await database.contants.findUnique({ where: { id: 1 } })

export { getContants }
