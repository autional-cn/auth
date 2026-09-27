import { pushVapidPublicKey } from '../generated/api';
import { extractItem } from '../utils/response';
import { urlBase64ToUint8Array } from '../utils/browser';

export async function getVapidPublicKey(): Promise<string> {
	const res = await pushVapidPublicKey();
	const data = extractItem(res) as { public_key?: string } | null;
	if (!data?.public_key) {
		throw new Error('Failed to get VAPID public key');
	}
	return data.public_key;
}

export async function subscribeBrowserPush(
	vapidPublicKey: string,
): Promise<PushSubscription | null> {
	if (!('serviceWorker' in navigator) || !('PushManager' in window)) return null;
	const registration = await navigator.serviceWorker.ready;
	const existing = await registration.pushManager.getSubscription();
	if (existing) return existing;
	try {
		return await registration.pushManager.subscribe({
			userVisibleOnly: true,
			applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
		});
	} catch (err) {
		console.error('Push subscription failed:', err);
		return null;
	}
}

export async function unsubscribeBrowserPush(): Promise<boolean> {
	if (!('serviceWorker' in navigator)) return false;
	const registration = await navigator.serviceWorker.ready;
	const sub = await registration.pushManager.getSubscription();
	if (sub) {
		await sub.unsubscribe();
		return true;
	}
	return false;
}
