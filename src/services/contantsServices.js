import database from '../libs/prisma.js'

const getContants = async () => {
    return await database.contants.findUnique({
        where: { id: '669691b79c869b671aa806aa' },
    })
}

export { getContants }
