import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Update thumbnails for all subjects using YouTube video thumbnails
  // YouTube thumbnail format: https://img.youtube.com/vi/{VIDEO_ID}/maxresdefault.jpg

  const updates = [
    {
      slug: 'react-development',
      thumbnail: 'https://img.youtube.com/vi/F4zr1aMevB4/maxresdefault.jpg',
    },
    {
      slug: 'java-programming-basics',
      thumbnail: 'https://img.youtube.com/vi/eIrMbAQSU34/maxresdefault.jpg',
    },
    {
      slug: 'web-development-fundamentals',
      thumbnail: 'https://img.youtube.com/vi/7wnove7K-ZQ/maxresdefault.jpg',
    },
    {
      slug: 'python-programming',
      thumbnail: 'https://img.youtube.com/vi/rfscVS0vtbw/maxresdefault.jpg',
    },
    {
      slug: 'java-programming',
      thumbnail: 'https://img.youtube.com/vi/eIrMbAQSU34/maxresdefault.jpg',
    },
  ];

  for (const update of updates) {
    const result = await prisma.subject.update({
      where: { slug: update.slug },
      data: { thumbnail: update.thumbnail },
    });
    console.log(`Updated thumbnail for: ${result.title}`);
  }

  console.log('All thumbnails updated successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
