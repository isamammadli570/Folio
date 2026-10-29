import type {Language} from "@/i18n/resources";
import type {CategoryId, Ornament} from "@/constants/catalog";

/** Text stored in every site language. The database keeps the same shape (one column per language or a JSON column). */
export type Localized = Record<Language, string>;

export type AuthorQuote = {
    /** The words in the language the author wrote them. */
    text: string;
    /** BCP 47 tag of `text`, so screen readers and fonts pick the right script ("grc" is Ancient Greek). */
    lang: string;
    translation: Localized;
};

export type Author = {
    id: string;
    name: Localized;
    /** Negative years are BCE. */
    born: number;
    died: number;
    /** The dates are approximate ("c. 50 – 135"). */
    approx?: boolean;
    movement: Localized;
    bio: Localized;
    quote?: AuthorQuote;
    /** Position in the home spotlight; authors without it are not shown there. */
    featured?: number;
    /** Optional cut-out bust (transparent webp). Without it the marble medallion is drawn. */
    portrait?: string;
    /** Optional old engraving or painting from the author's world, shown in the hero's half-circle behind the text. */
    scene?: string;
};

export type BookTag = "bestseller" | "new";

export type Book = {
    id: string;
    authorId: string;
    category: CategoryId;
    title: Localized;
    description: Localized;
    price: number;
    /** The price before a discount; only set while the book is on sale. */
    oldPrice?: number;
    stock: number;
    pages: number;
    /** Year of first publication or composition; negative is BCE. */
    year: number;
    approxYear?: boolean;
    ornament: Ornament;
    tag?: BookTag;
    /** Optional photo of a real edition. Without it the classic-edition cover is drawn. */
    coverImage?: string;
};

export type BookWithAuthor = Book & {author: Author};

export type OrderStatus = "new" | "processing" | "shipped" | "delivered" | "cancelled";

export type OrderItem = {bookId: string; title: Localized; unitPrice: number; quantity: number};

export type Order = {
    id: string;
    number: string;
    status: OrderStatus;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    deliveryMethod: "courier" | "pickup";
    city: string;
    address: string;
    note: string;
    paymentMethod: "cash" | "card";
    subtotal: number;
    shipping: number;
    total: number;
    /** ISO timestamp. */
    createdAt: string;
    items: OrderItem[];
};

export type Profile = {id: string; fullName: string; phone: string};

export type Address = {id: string; label: string; city: string; line: string; note: string; isDefault: boolean};
