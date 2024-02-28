const fs = require('fs');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');

dotenv.config({ path: '../../config/index.ts' });

const prisma = new PrismaClient();

const products = JSON.parse(fs.readFileSync('src/_data/products.data.json', 'utf-8'));

const loadData = async () => {
  try {
    await prisma.product.createMany({
      data: products
    });
    console.log('✅ Data Loaded ...');
    process.exit();
  } catch (error) {
    console.error('❌ Failed to seed data', error);
  }
};

const deleteData = async () => {
  try {
    await prisma.product.deleteMany();

    console.log('✅ Data Destroyed ...');
    process.exit();
  } catch (error) {
    console.error('❌ Failed to destroy data', error);
  }
};

if (process.argv[2] === '-i') {
  void loadData();
} else if (process.argv[2] === '-d') {
  void deleteData();
}
