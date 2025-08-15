import { signal } from '@angular/core';
import Swal from 'sweetalert2';

const STORAGE_KEY = 'adoptionCart';

function loadCart(): number[] {
  const json = localStorage.getItem(STORAGE_KEY);
  return json ? JSON.parse(json) : [];
}

const adoptionCart = signal<number[]>(loadCart());

function saveCart(cart: number[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

export function addToAdoptionCart(id: number) {
  adoptionCart.update(current => {
    if (current.includes(id)) return current;
    const updated = [...current, id];
    saveCart(updated);
    showToast('success', 'Mascota agregada a la lista de adopción');
    return updated;
  });
}

export function removeFromAdoptionCart(id: number) {
  adoptionCart.update(current => {
    const updated = current.filter(item => item !== id);
    saveCart(updated);
    showToast('warning', 'Mascota eliminada de la lista');
    return updated;
  });
}

export function clearAdoptionCart() {
  adoptionCart.set([]);
  showToast('success', 'Se vació la lista de mascotas.');
  localStorage.removeItem(STORAGE_KEY);
}

export function useAdoptionCart() {
  return adoptionCart;
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