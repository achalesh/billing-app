'use server'

import { prisma } from "@/lib/db"
import { SettingsFormValues } from "@/lib/schemas"
import { revalidatePath } from "next/cache"

export async function getSettings() {
    return await prisma.settings.findUnique({
        where: { id: "settings" }
    })
}

export async function updateSettings(data: SettingsFormValues) {
    await prisma.settings.upsert({
        where: { id: "settings" },
        update: data,
        create: {
            id: "settings",
            ...data
        }
    })

    revalidatePath("/settings")
    return { success: true }
}
