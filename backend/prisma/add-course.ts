import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create React Development Course
  const reactSubject = await prisma.subject.upsert({
    where: { slug: 'react-development' },
    update: {},
    create: {
      title: 'React Development',
      slug: 'react-development',
      description: 'Learn React from scratch and build modern web applications. This course covers React fundamentals, components, hooks, and best practices.',
      is_published: true,
    },
  });

  console.log('Created subject:', reactSubject.title);

  // Check if section already exists
  let reactBasics = await prisma.section.findFirst({
    where: {
      subject_id: reactSubject.id,
      order_index: 0,
    },
  });

  if (!reactBasics) {
    reactBasics = await prisma.section.create({
      data: {
        subject_id: reactSubject.id,
        title: 'Introduction to React',
        order_index: 0,
      },
    });
  }

  console.log('Created section:', reactBasics.title);

  // Check if video already exists
  const existingVideo = await prisma.video.findFirst({
    where: {
      section_id: reactBasics.id,
      order_index: 0,
    },
  });

  if (!existingVideo) {
    await prisma.video.create({
      data: {
        section_id: reactBasics.id,
        title: 'React Tutorial for Beginners',
        description: 'A comprehensive React tutorial for beginners. Learn the fundamentals of React including components, JSX, state, props, and how to build interactive user interfaces.',
        youtube_url: 'https://www.youtube.com/watch?v=F4zr1aMevB4',
        order_index: 0,
        duration_seconds: 5400,
      },
    });
    console.log('Created video: React Tutorial for Beginners');
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
