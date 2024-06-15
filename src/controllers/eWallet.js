import database from '../libs/prisma.js'
import asyncWrapper from '../middlewares/asyncWrapper.js'
import { getContants } from '../services/contantsServices.js'

const getEWallet = asyncWrapper(async (req, res) => {
    const data = {
        user: req.user,
        eWallet: null,
        bank: null,
    }
    data.eWallet = await database.ewallet.findFirst({
        where: {
            userId: req.user.id,
        },
    })
    data.bank = await getContants()

    res.render('member/e-wallet', { title: 'E-Wallet', data })
})

const fundWallet = asyncWrapper(async (req, res) => {
    const amount = Number(req.query.amount)
    const id = Number(req.query.id)

    if (req.user && req.user.hasFunded) {
        await database.ewallet.update({
            where: { userId: id },
            data: {
                balance: { increment: amount },
            },
        })
    } else {
        await database.user.update({
            where: { id },
            data: {
                hasFunded: true,
                eWallet: { update: { balance: { increment: amount } } },
            },
            include: {
                eWallet: true,
            },
        })
    }

    res.redirect('/e-wallet')
})

export { getEWallet, fundWallet }
