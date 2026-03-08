import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create Java Programming Course
  const javaSubject = await prisma.subject.upsert({
    where: { slug: 'java-programming-basics' },
    update: {},
    create: {
      title: 'Java Programming Basics',
      slug: 'java-programming-basics',
      description: 'Learn Java programming from scratch. This course covers all the fundamentals you need to get started with Java.',
      is_published: true,
    },
  });

  console.log('Created subject:', javaSubject.title);

  // Check if section already exists
  let javaBasics = await prisma.section.findFirst({
    where: {
      subject_id: javaSubject.id,
      order_index: 0,
    },
  });

  if (!javaBasics) {
    javaBasics = await prisma.section.create({
      data: {
        subject_id: javaSubject.id,
        title: 'Introduction to Java',
        order_index: 0,
      },
    });
  }

  console.log('Created section:', javaBasics.title);

  // Check if video already exists
  const existingVideo = await prisma.video.findFirst({
    where: {
      section_id: javaBasics.id,
      order_index: 0,
    },
  });

  if (!existingVideo) {
    await prisma.video.create({
      data: {
        section_id: javaBasics.id,
        title: 'Java Tutorial for Beginners',
        description: 'A comprehensive Java tutorial for beginners. Learn the basics of Java programming language and start your coding journey.',
        youtube_url: 'https://www.youtube.com/watch?v=eIrMbAQSU34',
        order_index: 0,
        duration_seconds: 3600,
      },
    });
    console.log('Created video: Java Tutorial for Beginners');
  } else {
    console.log('Video already exists');
  }

  console.log('Course added successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
