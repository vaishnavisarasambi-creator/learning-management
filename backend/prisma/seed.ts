import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create roles first
  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: { name: 'ADMIN' },
  });
  
  const studentRole = await prisma.role.upsert({
    where: { name: 'STUDENT' },
    update: {},
    create: { name: 'STUDENT' },
  });
  
  const instructorRole = await prisma.role.upsert({
    where: { name: 'INSTRUCTOR' },
    update: {},
    create: { name: 'INSTRUCTOR' },
  });

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@lms.com' },
    update: {},
    create: {
      email: 'admin@lms.com',
      password_hash: adminPassword,
      name: 'Admin User',
      role_id: adminRole.id,
    },
  });

  // Create sample subject: Java Programming
  const javaSubject = await prisma.subject.upsert({
    where: { slug: 'java-programming' },
    update: {},
    create: {
      title: 'Java Programming',
      slug: 'java-programming',
      description: 'Learn Java from basics to advanced concepts. This comprehensive course covers variables, data types, OOP principles, and more.',
      is_published: true,
    },
  });

  // Create sections for Java
  const basicsSection = await prisma.section.create({
    data: {
      subject_id: javaSubject.id,
      title: 'Java Basics',
      order_index: 0,
    },
  });

  const oopSection = await prisma.section.create({
    data: {
      subject_id: javaSubject.id,
      title: 'Object-Oriented Programming',
      order_index: 1,
    },
  });

  // Create videos for Basics section
  await prisma.video.createMany({
    data: [
      {
        section_id: basicsSection.id,
        title: 'Introduction to Java',
        description: 'Get started with Java programming language. Learn what Java is and why you should learn it.',
        youtube_url: 'https://www.youtube.com/watch?v=eIrMbAQSU34',
        order_index: 0,
        duration_seconds: 600,
      },
      {
        section_id: basicsSection.id,
        title: 'Variables and Data Types',
        description: 'Learn about different data types in Java and how to declare variables.',
        youtube_url: 'https://www.youtube.com/watch?v=grEKMHGYyns',
        order_index: 1,
        duration_seconds: 900,
      },
      {
        section_id: basicsSection.id,
        title: 'Control Flow Statements',
        description: 'Understand if-else statements, loops, and switch cases in Java.',
        youtube_url: 'https://www.youtube.com/watch?v=t6gmQaTMTIw',
        order_index: 2,
        duration_seconds: 750,
      },
    ],
  });

  // Create videos for OOP section
  await prisma.video.createMany({
    data: [
      {
        section_id: oopSection.id,
        title: 'Classes and Objects',
        description: 'Learn the fundamentals of classes and objects in Java.',
        youtube_url: 'https://www.youtube.com/watch?v=IUqKuGNasdM',
        order_index: 0,
        duration_seconds: 800,
      },
      {
        section_id: oopSection.id,
        title: 'Inheritance',
        description: 'Understand inheritance and how to extend classes in Java.',
        youtube_url: 'https://www.youtube.com/watch?v=9JpNY-XAseg',
        order_index: 1,
        duration_seconds: 850,
      },
      {
        section_id: oopSection.id,
        title: 'Polymorphism',
        description: 'Learn about method overloading and overriding in Java.',
        youtube_url: 'https://www.youtube.com/watch?v=PrDzv3NO8hY',
        order_index: 2,
        duration_seconds: 700,
      },
    ],
  });

  // Create another sample subject: Python Programming
  const pythonSubject = await prisma.subject.upsert({
    where: { slug: 'python-programming' },
    update: {},
    create: {
      title: 'Python Programming',
      slug: 'python-programming',
      description: 'Master Python programming from scratch. Perfect for beginners and experienced developers.',
      is_published: true,
    },
  });

  const pythonBasics = await prisma.section.create({
    data: {
      subject_id: pythonSubject.id,
      title: 'Python Fundamentals',
      order_index: 0,
    },
  });

  await prisma.video.createMany({
    data: [
      {
        section_id: pythonBasics.id,
        title: 'Python Introduction',
        description: 'Introduction to Python programming language.',
        youtube_url: 'https://www.youtube.com/watch?v=rfscVS0vtbw',
        order_index: 0,
        duration_seconds: 2700,
      },
      {
        section_id: pythonBasics.id,
        title: 'Variables and Data Types in Python',
        description: 'Learn about Python data types and variable declaration.',
        youtube_url: 'https://www.youtube.com/watch?v=Z1Yd7upQsXY',
        order_index: 1,
        duration_seconds: 1200,
      },
    ],
  });

  // Create Web Development Course
  const webDevSubject = await prisma.subject.upsert({
    where: { slug: 'web-development-fundamentals' },
    update: {},
    create: {
      title: 'Web Development Fundamentals',
      slug: 'web-development-fundamentals',
      description: 'Learn the fundamentals of web development including HTML, CSS, and JavaScript.',
      is_published: true,
    },
  });

  const webBasics = await prisma.section.create({
    data: {
      subject_id: webDevSubject.id,
      title: 'Getting Started with Web Development',
      order_index: 0,
    },
  });

  await prisma.video.createMany({
    data: [
      {
        section_id: webBasics.id,
        title: 'Introduction to Web Development',
        description: 'A comprehensive introduction to web development for beginners. Learn the basics of how the web works and what skills you need to become a web developer.',
        youtube_url: 'https://www.youtube.com/watch?v=7wnove7K-ZQ',
        order_index: 0,
        duration_seconds: 1800,
      },
    ],
  });

  console.log('Seed data created successfully!');
  console.log('Admin user: admin@lms.com / admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
