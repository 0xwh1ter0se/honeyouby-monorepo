import { db } from "../config/database.js";
import { products, productCategories, categories } from "../db/schema.js";
import { eq, ilike, and, inArray } from "drizzle-orm";
import slugify from "slugify";
import { ApiError } from "../middleware/errorHandler.js";

export interface CreateProductInput {
    name: string;
    description?: string;
    price: number;
    stock?: number;
    image?: string;
    categoryIds?: number[];
}

export interface UpdateProductInput extends Partial<CreateProductInput> { }

export class ProductService {
    // Get all products with optional filters
    async getProducts(options: {
        category?: string;
        search?: string;
        page?: number;
        limit?: number;
        activeOnly?: boolean;
    }) {
        const { category, search, page = 1, limit = 20, activeOnly = true } = options;
        const offset = (page - 1) * limit;

        let query = db
            .select({
                id: products.id,
                name: products.name,
                slug: products.slug,
                description: products.description,
                price: products.price,
                stock: products.stock,
                image: products.image,
                isActive: products.isActive,
                createdAt: products.createdAt,
            })
            .from(products);

        const conditions = [];

        if (activeOnly) {
            conditions.push(eq(products.isActive, true));
        }

        if (search) {
            conditions.push(ilike(products.name, `%${search}%`));
        }

        if (conditions.length > 0) {
            query = query.where(and(...conditions)) as typeof query;
        }

        const result = await query.limit(limit).offset(offset);

        // Get categories for each product
        const productIds = result.map((p) => p.id);
        const productCats = await db
            .select({
                productId: productCategories.productId,
                categoryName: categories.name,
            })
            .from(productCategories)
            .innerJoin(categories, eq(productCategories.categoryId, categories.id))
            .where(inArray(productCategories.productId, productIds));

        // Group categories by product
        const catsByProduct = productCats.reduce((acc, pc) => {
            if (!acc[pc.productId]) acc[pc.productId] = [];
            acc[pc.productId].push(pc.categoryName);
            return acc;
        }, {} as Record<number, string[]>);

        // Filter by category if specified
        let filteredResult = result;
        if (category) {
            filteredResult = result.filter((p) =>
                catsByProduct[p.id]?.some(
                    (c) => c.toLowerCase() === category.toLowerCase()
                )
            );
        }

        return filteredResult.map((p) => ({
            ...p,
            category: catsByProduct[p.id] || [],
        }));
    }

    // Get single product by slug
    async getProductBySlug(slug: string) {
        const [product] = await db
            .select()
            .from(products)
            .where(eq(products.slug, slug));

        if (!product) {
            throw ApiError.notFound("Product not found");
        }

        // Get categories
        const productCats = await db
            .select({ name: categories.name })
            .from(productCategories)
            .innerJoin(categories, eq(productCategories.categoryId, categories.id))
            .where(eq(productCategories.productId, product.id));

        return {
            ...product,
            category: productCats.map((c) => c.name),
        };
    }

    // Create new product (admin)
    async createProduct(input: CreateProductInput) {
        const slug = slugify(input.name, { lower: true, strict: true });

        const [product] = await db
            .insert(products)
            .values({
                name: input.name,
                slug,
                description: input.description,
                price: input.price,
                stock: input.stock || 0,
                image: input.image,
            })
            .returning();

        // Add categories
        if (input.categoryIds && input.categoryIds.length > 0) {
            await db.insert(productCategories).values(
                input.categoryIds.map((categoryId) => ({
                    productId: product.id,
                    categoryId,
                }))
            );
        }

        return product;
    }

    // Update product (admin)
    async updateProduct(id: number, input: UpdateProductInput) {
        const updateData: Record<string, unknown> = { updatedAt: new Date() };

        if (input.name !== undefined) {
            updateData.name = input.name;
            updateData.slug = slugify(input.name, { lower: true, strict: true });
        }
        if (input.description !== undefined) updateData.description = input.description;
        if (input.price !== undefined) updateData.price = input.price;
        if (input.stock !== undefined) updateData.stock = input.stock;
        if (input.image !== undefined) updateData.image = input.image;

        const [product] = await db
            .update(products)
            .set(updateData)
            .where(eq(products.id, id))
            .returning();

        if (!product) {
            throw ApiError.notFound("Product not found");
        }

        // Update categories if provided
        if (input.categoryIds !== undefined) {
            await db
                .delete(productCategories)
                .where(eq(productCategories.productId, id));

            if (input.categoryIds.length > 0) {
                await db.insert(productCategories).values(
                    input.categoryIds.map((categoryId) => ({
                        productId: id,
                        categoryId,
                    }))
                );
            }
        }

        return product;
    }

    // Delete product (admin)
    async deleteProduct(id: number) {
        const [deleted] = await db
            .delete(products)
            .where(eq(products.id, id))
            .returning();

        if (!deleted) {
            throw ApiError.notFound("Product not found");
        }

        return deleted;
    }
}

export const productService = new ProductService();
