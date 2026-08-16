
export type ProductVariant = {
  id: string;
  productId: string;
  name: string;
  sku: string;
  priceDelta: number;
  inStock: boolean;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  tags: string[];
  inStock: boolean;
  createdAt: string;
  variants: ProductVariant[];
};

/**
 * Why `createdAt` is a string and not a Date:
 *
 * A Date object cannot cross the server-to-client boundary — it isn't
 * serializable, so passing one as a prop from a Server Component to a Client
 * Component fails. Keeping it as an ISO string means the type is safe to pass
 * anywhere. Parse to a Date only at the point of formatting.
 *
 * You'll hit this properly in Phase 3, Problem 5.
 */


export type ProductSort = "newest" | "price-asc" | "price-desc" | "name";

export type GetProductsOptions = {
  /** Filter by category *slug* (e.g. "electronics"), not categoryId. */
  category?: string;
  /** Case-insensitive match against name and description. */
  search?: string;
  /** Only products with this tag. */
  tag?: string;
  inStockOnly?: boolean;
  sort?: ProductSort;
  /** 1-based. Values below 1 are clamped to 1. */
  page?: number;
  /** Clamped to PRODUCT_PAGE_SIZE_MAX. */
  pageSize?: number;
};

/**
 * Paginated result. Returning the metadata alongside the items means the
 * caller never has to run a second count query, and Phase 8's paginated
 * endpoint can return this almost verbatim.
 */
export type ProductListResult = {
  items: Product[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};


// Write these from the seed files in `data/`. Two rules carried over from the
// spec, both of which matter later:
//
//   - User.role must be a LITERAL UNION: "admin" | "editor" | "viewer".
//     Never `string`. Phase 12 relies on this for exhaustive role checks, and
//     `string` would let a typo compile.
//
//   - Doc.slug is a string[] — the path segments. The docs index page has an
//     empty array, which is what the [[...slug]] route resolves to for /docs.
//

export type Category = { 
    id: string;
    slug: string;
    name: string;
    description: string;
};

export type Post = {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    body: string;
    authorId: string;
    publishedAt: string,
    tags: string[];
};


export type User = { 
    id: string;
    username: string;
    name: string;
    email: string;
    passwordHash: string;
    role: "admin" | "editor" | "viewer";
    createdAt: string
}

export type Doc = {
    slug: string[];
    title: string;
    body: string;
}

/**
 * A User with the password removed.
 *
 * `Omit<User, "passwordHash">` means "the User type, minus that one field".
 * We use this everywhere a page displays a user, so the password can never
 * accidentally get sent to the browser.
 */
export type PublicUser = Omit<User, "passwordHash">;
