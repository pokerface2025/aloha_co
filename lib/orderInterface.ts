export interface Order {
    _id?: string;
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    address?: string;
    apartment?: string;
    city?: string;
    department?: string;
    postalCode?: string;
    saveInfo?: boolean;
    shippingMethod?: string;
    productsSubtotal?: number;
    shippingCost?: number;
    shippingMode?: string;
    shippingNote?: string;
    status?: BoldPaymentStatusType;
    notes?: string;
    items?: OrderItem[];
    paymentReferenceId?: string;
    callbackUrl?: string;
    imgUrl?: string;
}


export const BoldPaymentStatus = {
    ACTIVE: "El link está disponible para ser pagado. Esto puede suceder porque no se ha iniciado un pago o porque un pago anterior falló y el link está listo para ser usado nuevamente.",
    PROCESSING: "El pago está en curso y aún no se ha completado la transacción.",
    PAID: "El pago se ha realizado con éxito.",
    APPROVED: "El pago ha sido aprobado por el sistema de pagos, pero aún no se ha completado la transacción.",
    REJECTED: "El pago fue rechazado.",
    CANCELLED: "El pago fue cancelado por el usuario o fue fallido.",
    EXPIRED: "El link está vencido y no puede ser pagado."
};

export type BoldPaymentStatusType = keyof typeof BoldPaymentStatus;

export interface OrderItem {
    productId: string;
    variantSku: string;
    size: string;
    color: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
}