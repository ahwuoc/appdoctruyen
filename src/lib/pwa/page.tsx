"use client";
import React, { useState, useEffect } from "react";

const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function urlBase64ToUint8Array(base64String: string) {
    if (!base64String) {
        console.error("❌ VAPID key rỗng!");
        return new Uint8Array();
    }
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export default function Page() {
    const [sub, setSub] = useState<PushSubscription | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [installPrompt, setInstallPrompt] = useState<Event | null>(null);
    const [pwaStatus, setPwaStatus] = useState({
        serviceWorker: false,
        pushManager: false,
        notifications: false,
        manifest: false,
    });

    useEffect(() => {
        // Kiểm tra điều kiện PWA
        setPwaStatus({
            serviceWorker: "serviceWorker" in navigator,
            pushManager: "PushManager" in window,
            notifications: "Notification" in window,
            manifest: !!document.querySelector('link[rel="manifest"]'),
        });

        // Lắng nghe sự kiện Install Prompt
        const handleInstallPrompt = (e: Event) => {
            e.preventDefault();
            setInstallPrompt(e);
            console.log("📲 Install PWA prompt sẵn sàng nha bro!");
        };
        window.addEventListener("beforeinstallprompt", handleInstallPrompt);
        window.addEventListener("appinstalled", () => {
            console.log("🎉 PWA đã được cài vào máy!");
        });

        return () => {
            window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
            window.removeEventListener("appinstalled", () => { });
        };
    }, []);

    const requestPermissionAndSubscribe = async () => {
        if (!pwaStatus.serviceWorker || !pwaStatus.pushManager) {
            setError("❌ Browser không hỗ trợ SW/Push!");
            return;
        }

        const permission = await Notification.requestPermission();
        console.log("Permission:", permission);
        if (permission !== "granted") {
            setError("❌ Chưa cấp quyền notification, bật đi bro!");
            return;
        }

        try {
            const registration = await navigator.serviceWorker.ready;
            console.log("✅ SW active:", registration.active);

            let subscription = await registration.pushManager.getSubscription();
            if (!vapidPublicKey) {
                setError("❌ VAPID key không có!");
                return;
            }
            console.log("VAPID key:", vapidPublicKey);

            if (!subscription) {
                console.log("📢 Chưa có sub, subscribe nào...");
                subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
                });
                console.log("🎉 Subscribed:", subscription);
                console.log("Endpoint:", subscription.endpoint);
                console.log("Full subscription:", JSON.stringify(subscription));
            }
            setSub(subscription);
        } catch (err) {
            console.error("❌ Lỗi đăng ký SW:", err);
            setError(`Lỗi: ${err}`);
        }
    };

    const installPWA = async () => {
        if (!installPrompt) {
            console.log("❌ Chưa có prompt để cài PWA, check SW và manifest nha!");
            return;
        }
        const promptEvent = installPrompt as BeforeInstallPromptEvent;

        promptEvent.prompt();
        const { outcome } = await promptEvent.userChoice;
        if (outcome === "accepted") {
            console.log("✅ Bro đã cài PWA!");
        } else {
            console.log("❌ Bro từ chối cài PWA!");
        }
        setInstallPrompt(null);
    };

    return (
        <div className="bg-gray-500 p-4">
            <h1 className="text-white text-2xl">📲 PWA Ready</h1>

            <h2 className="text-white text-xl mt-4">🔍 Kiểm tra điều kiện PWA:</h2>
            <ul className="text-white">
                <li>✅ Service Worker: {pwaStatus.serviceWorker ? "Hỗ trợ" : "Không hỗ trợ"}</li>
                <li>✅ Push Manager: {pwaStatus.pushManager ? "Hỗ trợ" : "Không hỗ trợ"}</li>
                <li>✅ Notifications: {pwaStatus.notifications ? "Hỗ trợ" : "Không hỗ trợ"}</li>
                <li>✅ Manifest: {pwaStatus.manifest ? "Tìm thấy" : "Không tìm thấy"}</li>
            </ul>

            {error ? <p style={{ color: "red" }}>{error}</p> : null}

            {sub ? (
                <p className="text-green-300">✅ Đã đăng ký Push</p>
            ) : (
                <>
                    <p className="text-yellow-300">⏳ Chưa có Push Subscription...</p>
                    <button
                        onClick={requestPermissionAndSubscribe}
                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Bật Notification Nào Bro!
                    </button>
                </>
            )}

            {installPrompt && (
                <button
                    onClick={installPWA}
                    className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                    Cài PWA Vào Máy Nào Bro!
                </button>
            )}
            <button
                onClick={installPWA}
                className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
                Cài PWA Vào Máy Nào Bro!
            </button>ds
        </div>
    );
}
