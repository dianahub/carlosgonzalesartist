import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const BIO = `Here to Play the Game.

The game of Life is to Enjoy and Live Happy! The Game my way is to Create & Paint that which is expressed from my soul. My Love for Nature is the passion behind all my work. Passion drives me — I do not worry, I go with instinct and the drive to express what I feel.

Most would identify my work as Surrealism. My paintings are not exact nor are they perfection — each subject is hinted or disguised in ways to make the viewer work and subtract from the painting what they feel or see. It's not my intention to paint pretty pictures; it's my intention to connect with them and let them identify with what is front of them.

Creating and Painting for over 30 years.

— Carlos González (Gzo)`

async function main() {
  const email = process.env.ADMIN_EMAIL
  const passwordHash = process.env.ADMIN_PASSWORD_HASH

  if (!email || !passwordHash) {
    throw new Error(
      'ADMIN_EMAIL and ADMIN_PASSWORD_HASH must be set in your .env before seeding.\n' +
        'Run: npm run hash-password <your-password>  to generate the hash.'
    )
  }

  await prisma.user.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash },
  })
  console.log('✓ Admin user created/updated:', email)

  await prisma.siteContent.upsert({
    where: { key: 'bio' },
    update: {},
    create: { key: 'bio', value: BIO },
  })
  console.log('✓ Bio seeded')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
