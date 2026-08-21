
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


/**
 * The three roles, extracted into their own type.
 *
 * You had this union written inline inside `User`. Pulling it out means:
 *   - other files can import and use it (layouts, session helpers, guards)
 *   - there's ONE place to edit when a role is added
 *   - function signatures can say `role: Role` instead of repeating the union
 *
 * Keep it a literal union, never `string`. With `string`, a typo like
 * "admni" compiles fine and silently never matches.
 */
export type Role = "admin" | "editor" | "viewer";

export type User = {
    id: string;
    username: string;
    name: string;
    email: string;
    passwordHash: string;
    role: Role;
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
