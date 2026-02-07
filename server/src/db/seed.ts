import { db } from "../config/database.js";
import { categories, products, productCategories, carousels, blogs, users } from "./schema.js";
import { eq } from "drizzle-orm";
import * as dotenv from "dotenv";
import { auth } from "../config/auth.js";

dotenv.config();

async function seed() {
    console.log("🌱 Seeding database...");

    try {
        // Clear existing data for clean re-seed
        // Create Admin User
        console.log("👤 Creating admin user...");
        try {
            await auth.api.signUpEmail({
                body: {
                    email: "admin@honeyouby.com",
                    password: "adminho12",
                    name: "Admin HoneyOuby",
                }
            });
            console.log("✅ Admin user created: admin@honeyouby.com / adminho12");
        } catch (e) {
            console.log("ℹ️ Admin user might already exist");
        }

        // Force update role to owner
        await db.update(users)
            .set({ role: "owner" })
            .where(eq(users.email, "admin@honeyouby.com"));
        console.log("👑 Admin role assigned");

        console.log("🗑️ Clearing existing product categories...");
        await db.delete(productCategories);

        // Seed categories
        const categoryData = [
            { name: "Best Seller", slug: "best-seller" },
            { name: "Original", slug: "original" },
            { name: "Sweet", slug: "sweet" },
        ];

        for (const cat of categoryData) {
            await db.insert(categories).values(cat).onConflictDoNothing();
        }

        // Get category IDs
        const allCategories = await db.select().from(categories);
        const categoryMap = new Map(allCategories.map((c) => [c.name, c.id]));
        console.log(`✅ Categories ready: ${allCategories.map(c => c.name).join(", ")}`);

        // Product data with their categories
        const productData = [
            {
                name: "Cilembu Choco Lava",
                slug: "cilembu-choco-lava",
                description: "Ubi Cilembu panggang dengan topping cokelat lumer yang melimpah dan taburan cokelat parut.",
                price: 28000,
                stock: 100,
                image: "/menu-choco.png",
                categories: ["Best Seller", "Sweet"],
            },
            {
                name: "Cilembu Taro Dream",
                slug: "cilembu-taro-dream",
                description: "Perpaduan unik Ubi Cilembu dengan saus Taro creamy dan parutan keju gurih.",
                price: 30000,
                stock: 100,
                image: "/menu-taro.png",
                categories: ["Sweet"],
            },
            {
                name: "Cilembu Matcha Bliss",
                slug: "cilembu-matcha-bliss",
                description: "Sensasi rasa teh hijau premium berpadu dengan manisnya Ubi Cilembu dan topping Oreo crumble.",
                price: 32000,
                stock: 100,
                image: "/menu-matcha.png",
                categories: ["Best Seller", "Sweet"],
            },
            {
                name: "Cilembu Original Honey",
                slug: "cilembu-original-honey",
                description: "Keaslian rasa Ubi Cilembu yang manis alami seperti madu, dipanggang sempurna.",
                price: 25000,
                stock: 100,
                image: "/menu-original.png",
                categories: ["Original"],
            },
            {
                name: "Cilembu Berry Sweet",
                slug: "cilembu-berry-sweet",
                description: "Manis segar saus strawberry creamy di atas Ubi Cilembu hangat.",
                price: 30000,
                stock: 100,
                image: "/menu-strawberry.png",
                categories: ["Best Seller", "Sweet"],
            },
            {
                name: "Cilembu Tiramissu Delight",
                slug: "cilembu-tiramissu-delight",
                description: "Kelezatan Ubi Cilembu berpadu dengan cream tiramisu lembut dan taburan cocoa powder.",
                price: 30000,
                stock: 0,
                image: "/menu-tiramissu.png",
                categories: ["Sweet"],
            },
        ];

        // Get existing products
        const existingProducts = await db.select().from(products);
        console.log(`🔍 Found ${existingProducts.length} existing products in DB`);
        const productMap = new Map(existingProducts.map((p) => [p.slug, p.id]));

        // Insert products and categories
        for (const p of productData) {
            const { categories: cats, ...productInfo } = p;

            let productId = productMap.get(p.slug);
            console.log(`Processing ${p.name} (slug: ${p.slug}). Found ID: ${productId}`);

            if (!productId) {
                // Insert new product
                const [newProduct] = await db
                    .insert(products)
                    .values(productInfo)
                    .returning();
                productId = newProduct.id;
                console.log(`Pressed Insert for ${p.name}`);
            } else {
                // Update existing product to ensure image/price/desc are up to date
                await db.update(products)
                    .set(productInfo)
                    .where(eq(products.id, productId));
                console.log(`🔄 Updated product: ${p.name} with image: ${productInfo.image}`);
            }

            // Add product categories
            for (const catName of cats) {
                const categoryId = categoryMap.get(catName);
                if (categoryId && productId) {
                    await db
                        .insert(productCategories)
                        .values({ productId, categoryId })
                        .onConflictDoNothing();
                }
            }
        }

        console.log(`✅ Linked products with categories`);

        // Seed carousels
        const carouselData = [
            {
                title: "Sweet Honey Delight",
                description: "Experience the authentic taste of Cilembu.",
                backgroundColor: "bg-amber-100",
                image: "/new-product-bg.jpg",
                sortOrder: 1,
            },
            {
                title: "New Cheese Special",
                description: "Melty cheesy goodness meet sweet potato.",
                backgroundColor: "bg-yellow-100",
                image: "/new-product-bg.jpg",
                sortOrder: 2,
            },
            {
                title: "Family Party Pack",
                description: "Get 20% off for bundle purchase!",
                backgroundColor: "bg-orange-100",
                image: "/new-product-bg.jpg",
                sortOrder: 3,
            },
        ];

        await db.insert(carousels).values(carouselData).onConflictDoNothing();
        console.log(`✅ Inserted carousels`);


        // Clear existing blogs to update content
        console.log("🗑️ Clearing existing blogs...");
        await db.delete(blogs);

        // Seed blogs with rich content
        const blogData = [
            {
                title: "5 Manfaat Ajaib Ubi Cilembu untuk Kesehatan Tubuh",
                slug: "manfaat-ubi-cilembu-untuk-kesehatan-tubuh",
                excerpt: "Ternyata manisnya Ubi Cilembu menyimpan segudang manfaat kesehatan. Simak 5 khasiat utamanya di sini!",
                content: `Siapa sangka dibalik rasa manis legitnya, Ubi Cilembu menyimpan sejuta manfaat bagi kesehatan? Ubi khas Sumedang ini bukan sekadar camilan enak, tapi juga superfood lokal yang kaya nutrisi.

1. Sumber Energi Alami yang Sehat
Ubi Cilembu kaya akan karbohidrat kompleks yang memberikan energi tahan lama. Berbeda dengan gula pasir yang bikin gula darah melonjak cepat, manisnya ubi ini lebih ramah bagi tubuh jika dikonsumsi dalam batas wajar. Cocok banget buat kamu yang butuh tenaga ekstra untuk aktivitas seharian!

2. Tinggi Serat untuk Pencernaan Lancar
Punya masalah pencernaan? Ubi Cilembu solusinya! Kandungan seratnya yang tinggi membantu melancarkan buang air besar dan menjaga kesehatan usus. Makan satu buah ubi cilembu panggang sudah cukup memenuhi sebagian kebutuhan serat harianmu.

3. Kaya Vitamin A untuk Mata Sehat
Warna oranye atau kuning pada daging ubi menandakan kandungan beta-karoten yang tinggi. Tubuh akan mengubah beta-karoten ini menjadi Vitamin A, yang sangat penting untuk menjaga kesehatan mata dan meningkatkan sistem kekebalan tubuh.

4. Antioksidan Alami
Ubi Cilembu mengandung senyawa antioksidan yang membantu melawan radikal bebas dalam tubuh. Ini artinya, rutin mengonsumsi ubi bisa membantu mencegah penuaan dini dan menekan risiko penyakit kronis.

5. Mendukung Program Diet
Rasa manisnya yang alami membuatmu merasa kenyang lebih lama dan mengurangi keinginan untuk ngemil makanan manis buatan lainnya. Jadi, Ubi Cilembu bisa jadi teman setia buat kamu yang lagi program menurunkan berat badan!

Jadi, jangan ragu lagi untuk menjadikan HoneyOuby sebagai camilan sehat harianmu. Enak dapat, sehat juga dapat!`,
                image: "/new-product-bg.jpg",
                isPublished: true,
                publishedAt: new Date("2026-02-01"),
            },
            {
                title: "Kenapa Ubi Cilembu Mengeluarkan Madu? Ini Jawabannya!",
                slug: "kenapa-ubi-cilembu-mengeluarkan-madu",
                excerpt: "Pernah penasaran kenapa Ubi Cilembu bisa melelehkan cairan manis seperti madu saat dipanggang? Yuk cari tahu rahasianya.",
                content: `Salah satu keajaiban kuliner Indonesia adalah Ubi Cilembu. Saat dipanggang alias dioven, ubi ini mengeluarkan cairan kental yang manis dan lengket menyerupai madu. Fenomena inilah yang membuatnya dijuluki "Ubi Madu". Tapi, dari mana asalnya cairan tersebut?

Rahasia Proses Kimia Alami
Cairan "madu" ini sebenarnya adalah getah pati ubi yang mengalami proses karamelisasi saat dipanaskan. Ubi Cilembu memiliki kandungan gula alami yang sangat tinggi dibandingkan jenis ubi lainnya. Saat dipanggang dalam suhu oven yang tepat (sekitar 180-200 derajat Celcius), pati di dalamnya luluh menjadi gula sederhana dan mencari jalan keluar melalui pori-pori kulit ubi.

Kenapa Hanya Ubi Cilembu?
Uniknya, tekstur dan rasa madu ini hanya bisa maksimal jika ubi ditanam di tanah desa Cilembu, Sumedang. Konon, kondisi tanah dan iklim mikro di sana sangat spesifik. Pernah ada percobaan menanam bibit Ubi Cilembu di daerah lain, hasilnya? Bentuknya sama, tapi rasa madunya hilang atau berkurang drastis!

Proses Penyimpanan (Curing)
Sebelum dipanggang, Ubi Cilembu harus melalui proses "curing" atau penyimpanan pasca-panen selama 2-4 minggu. Proses ini bertujuan mengurangi kadar air dan meningkatkan kadar gula. Inilah yang membuat "madu"-nya keluar melimpah saat dipanggang.

Di HoneyOuby, kami memastikan hanya menggunakan Ubi Cilembu asli dari petani terbaik di Sumedang yang telah melewati proses curing sempurna. Hasilnya? Ubi panggang yang super lembut, manis, dan lumer di mulut!`,
                image: "/new-product-bg.jpg",
                isPublished: true,
                publishedAt: new Date("2026-01-29"),
            },
            {
                title: "DIY: Kreasi Topping Ubi Cilembu Kekinian",
                slug: "kreasi-topping-ubi-cilembu-kekinian",
                excerpt: "Bosan makan ubi polosan? Coba 3 ide topping kekinian ini yang bikin Ubi Cilembu jadi dessert mewah!",
                content: `Ubi Cilembu original memang sudah enak, tapi kalau dikasih sentuhan topping kekinian? Wah, rasanya jadi next level! HoneyOuby punya beberapa inspirasi topping yang bisa kamu coba sendiri di rumah atau pesan langsung di menu kami.

1. Choco Lava & Cheese
Perpaduan manis dan gurih yang nggak pernah salah! Belah ubi cilembu hangat, siram dengan saus cokelat lumer, lalu beri parutan keju cheddar atau mozzarella di atasnya. Panas ubi akan melelehkan keju, menciptakan sensasi rasa yang creamy, manis, dan gurih sekaligus. Dijamin nagih!

2. Matcha Oreo Crumble
Buat pecinta teh hijau, ini wajib coba. Glaze ubi dengan saus matcha kental, lalu taburkan remah-remah biskuit Oreo. Rasa pahit-manis khas matcha menyeimbangkan manis legitnya ubi. Tekstur crunchy dari Oreo bikin setiap gigitan makin asyik.

3. Tiramisu Delight
Ingin rasa yang lebih elegan? Padukan ubi cilembu dengan krim tiramisu dan taburan bubuk kakao. Rasa kopi yang lembut berpadu sempurna dengan karamel alami ubi. Cocok banget dinikmati sore hari bareng secangkir kopi hangat.

Semua varian topping ini tersedia juga di menu HoneyOuby lho! Kami menggunakan bahan-bahan premium untuk memastikan rasanya pas dan nggak bikin eneg. Penasaran? Yuk cobain sekarang!`,
                image: "/new-product-bg.jpg",
                isPublished: true,
                publishedAt: new Date("2026-01-25"),
            },
        ];

        await db.insert(blogs).values(blogData);
        console.log(`✅ Inserted ${blogData.length} rich content blogs`);

        console.log("✅ Seeding completed successfully!");
    } catch (error) {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    }

    process.exit(0);
}

seed();
