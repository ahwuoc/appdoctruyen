'use server';

import webpush from 'web-push';
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const validPrivateKey = process.env.VAPID_PRIVATE_KEY;


webpush.setVapidDetails(
    'mailto:delb1k98@example.com',
    vapidPublicKey!,
    validPrivateKey!
);

interface WebPushSubscription {
    endpoint: string;
    keys: {
        p256dh: string;
        auth: string;
    };
}

let subscription: WebPushSubscription | null = null;

export async function subscribeUser(sub: WebPushSubscription) {
    subscription = sub;
    return { success: true };
}

export async function unsubscribeUser() {
    subscription = null;
    return { success: true };
}

export async function sendNotification(message: string) {
    if (!subscription) {
        throw new Error('No subscription available');
    }

    try {
        await webpush.sendNotification(
            subscription,
            JSON.stringify({
                title: 'mimi',
                body: message,
                icon: '/icon-192x192.png',
            })
        );
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to send notification' };
    }
}
