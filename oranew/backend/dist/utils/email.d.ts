export interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}
export declare const sendEmail: (options: EmailOptions) => Promise<void>;
export declare const getWelcomeEmailTemplate: (name: string) => string;
export declare const getOrderConfirmationTemplate: (orderNumber: string, totalAmount: number) => string;
//# sourceMappingURL=email.d.ts.map