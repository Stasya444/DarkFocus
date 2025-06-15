import { prisma } from '~/server/utils/prisma'
import { readMultipartFormData } from 'h3'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'

export default defineEventHandler(async (event) => {
    try {
        const userId = Number(event.context.params?.id)
        const form = await readMultipartFormData(event)

        if (!form) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Форма не надійшла',
            })
        }

        let avatarFile = null
        const fields: Record<string, any> = {}

        for (const item of form) {
            if (item.name === 'avatar' && item.filename) {
                avatarFile = item
            } else {
                fields[item.name] = item.data.toString()
            }
        }

        const { name, email } = fields
        if (!name || !email) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Імʼя та email обовʼязкові',
            })
        }

        const updateData: Record<string, any> = { name, email }

        if (avatarFile) {
            const uploadDir = join(process.cwd(), 'public/uploads/avatars')
            await mkdir(uploadDir, { recursive: true })
            const ext = avatarFile.filename.split('.').pop()
            const filename = `${uuidv4()}.${ext}`
            const filePath = join(uploadDir, filename)
            const avatarUrl = `/uploads/avatars/${filename}`
            await writeFile(filePath, avatarFile.data)
            updateData.avatar = avatarUrl

            // Можно добавить удаление старого аватара если нужно
            const current = await prisma.user.findUnique({ where: { id: userId } })
            if (current?.avatar) {
                try {
                    const oldPath = join(process.cwd(), 'public', current.avatar)
                    await unlink(oldPath)
                } catch {}
            }
        }

        const user = await prisma.user.update({
            where: { id: userId },
            data: updateData,
        })

        return {
            statusCode: 200,
            message: 'Користувач успішно оновлений',
            user,
        }
    } catch (error) {
        console.error('User update error:', error)
        if (error.statusCode) throw error
        throw createError({
            statusCode: 500,
            statusMessage: 'Внутрішня помилка сервера',
        })
    }
})
