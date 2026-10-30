import {invalidateCatalogue, unwrap} from "@/api/client";
import {supabase} from "@/api/supabase";
import {ORDER_COLUMNS, type OrderRow} from "@/api/rows";
import type {Order} from "@/api/types";
import {mapOrderRow} from "@/helpers/rows";

export type PlaceOrderInput = {
    items: {bookId: string; quantity: number}[];
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    deliveryMethod: "courier" | "pickup";
    city: string;
    address: string;
    note: string;
    paymentMethod: "cash" | "card";
    promoCode?: string;
};

export type PlacedOrder = {id: string; number: string; total: number};

/** Places the order in one database transaction: prices and stock are checked on the server, never trusted from here. */
export const placeOrder = async (input: PlaceOrderInput): Promise<PlacedOrder> => {
    const response = await supabase.rpc("place_order", {
        items: input.items.map((item) => ({book_id: item.bookId, quantity: item.quantity})),
        first_name: input.firstName,
        last_name: input.lastName,
        email: input.email,
        phone: input.phone,
        delivery_method: input.deliveryMethod,
        city: input.city,
        address: input.address,
        note: input.note,
        payment_method: input.paymentMethod,
        promo_code: input.promoCode?.trim() || null,
    });
    const [row] = unwrap(response as {data: {order_id: string; order_number: string; order_total: number | string}[] | null; error: typeof response.error});
    invalidateCatalogue();
    return {id: row.order_id, number: row.order_number, total: Number(row.order_total)};
};

/** The signed-in reader's orders, newest first. */
export const getMyOrders = async (): Promise<Order[]> => {
    const response = await supabase.from("orders").select(ORDER_COLUMNS).order("created_at", {ascending: false}).returns<OrderRow[]>();
    return unwrap(response).map(mapOrderRow);
};

/** The buyer cancels an order that is still "new"; the copies go back in stock. Fails with TOO_LATE once it is being prepared. */
export const cancelOrder = async (orderId: string) => {
    const {error} = await supabase.rpc("cancel_order", {p_order_id: orderId});
    if (error) unwrap({data: null, error});
    invalidateCatalogue();
};

/** The percentage a promo code takes off right now; 0 when it is unknown, switched off, expired or used up. */
export const checkPromo = async (code: string): Promise<number> => {
    const {data, error} = await supabase.rpc("check_promo", {p_code: code.trim()});
    if (error) unwrap({data: null, error});
    return typeof data === "number" ? data : 0;
};
