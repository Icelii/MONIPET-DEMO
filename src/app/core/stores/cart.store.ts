import { signal } from "@angular/core";
import Swal from "sweetalert2";

const STORAGE_KEY = 'cart';

interface CartItem {
    id: number;
    quantity: number;
};

function loadCart(): CartItem[] {
    const json = localStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : [];
}

const productCart = signal<CartItem[]>(loadCart());

function saveCart(cart: CartItem[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

export function addToProductCart(id: number, quantity: number = 1) {
    productCart.update(current => {
        const index = current.findIndex(item => item.id === id);

        let updated: CartItem[];
        let cantidadAgregada = quantity;

        if (index !== -1) {
            updated = current.map((item, i) =>
                i === index ? { ...item, quantity: item.quantity + quantity } : item
            );
        } else {
            updated = [...current, { id, quantity }];
        }

        saveCart(updated);

        // Mostrar mensaje
        if (cantidadAgregada === 1) {
            showToast('success', `Se agregó 1 producto a tu bolsa`);
        } else {
            showToast('success', `Se agregaron ${cantidadAgregada} productos a tu bolsa`);
        }

        return updated;
    });
}
export function updateProductQuantity(id: number, quantity: number) {
    if (quantity <= 0) {
        removeFromProductCart(id);
        return;
    }

    productCart.update(current => {
        const updated = current.map(item =>
            item.id === id ? { ...item, quantity } : item
        );

        saveCart(updated);
        return updated;
    });
}

export function removeFromProductCart(id: number) {
    productCart.update(current => {
        const itemToRemove = current.find(item => item.id === id);

        if (!itemToRemove) return current;

        const updated = current.filter(item => item.id !== id);

        saveCart(updated);

        if (itemToRemove.quantity === 1) {
            showToast('info', `Se quitó 1 producto de tu bolsa`);
        } else {
            showToast('info', `Se quitaron ${itemToRemove.quantity} productos de tu bolsa`);
        }

        return updated;
    });
}

export function clearCart() {
    productCart.set([]);
    showToast('success', 'Se vació tu bolsa.');
    localStorage.removeItem(STORAGE_KEY);
}

export function useProductCart() {
    return productCart;
}

function showToast(icon: 'success' | 'info' | 'warning' | 'error', title: string) {
  const Toast = Swal.mixin({
    toast: true,
    position: "bottom-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: false,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });

  Toast.fire({ icon, title });
}