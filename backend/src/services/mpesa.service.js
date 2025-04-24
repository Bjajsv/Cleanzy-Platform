import axios from 'axios';
import { generateToken } from '../utils/mpesa.utils';

export class MpesaService {
    constructor() {
        this.baseUrl = process.env.MPESA_API_URL;
        this.consumerKey = process.env.MPESA_CONSUMER_KEY;
        this.consumerSecret = process.env.MPESA_CONSUMER_SECRET;
        this.passkey = process.env.MPESA_PASSKEY;
        this.shortcode = process.env.MPESA_SHORTCODE;
    }

    async initiatePayment(phoneNumber, amount, orderId) {
        try {
            const token = await this.getAccessToken();
            const timestamp = this.generateTimestamp();
            const password = this.generatePassword(timestamp);

            const response = await axios.post(
                `${this.baseUrl}/stkpush/v1/processrequest`,
                {
                    BusinessShortCode: this.shortcode,
                    Password: password,
                    Timestamp: timestamp,
                    TransactionType: 'CustomerPayBillOnline',
                    Amount: amount,
                    PartyA: phoneNumber,
                    PartyB: this.shortcode,
                    PhoneNumber: phoneNumber,
                    CallBackURL: `${process.env.API_URL}/payments/mpesa/callback`,
                    AccountReference: orderId,
                    TransactionDesc: `Payment for order ${orderId}`
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            return {
                checkoutRequestId: response.data.CheckoutRequestID,
                merchantRequestId: response.data.MerchantRequestID
            };
        } catch (error) {
            console.error('M-Pesa payment initiation failed:', error);
            throw new Error('Failed to initiate M-Pesa payment');
        }
    }

    async getAccessToken() {
        try {
            const auth = Buffer.from(
                `${this.consumerKey}:${this.consumerSecret}`
            ).toString('base64');

            const response = await axios.get(
                `${this.baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
                {
                    headers: {
                        Authorization: `Basic ${auth}`
                    }
                }
            );

            return response.data.access_token;
        } catch (error) {
            console.error('M-Pesa token generation failed:', error);
            throw new Error('Failed to generate M-Pesa access token');
        }
    }

    generateTimestamp() {
        return new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    }

    generatePassword(timestamp) {
        return Buffer.from(
            `${this.shortcode}${this.passkey}${timestamp}`
        ).toString('base64');
    }
}

export const mpesaService = new MpesaService(); 