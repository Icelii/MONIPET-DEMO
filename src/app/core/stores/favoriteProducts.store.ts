import { signal } from '@angular/core';
import Swal from 'sweetalert2';

const STORAGE_KEY = 'favorites';

function loadFavs(): number[] {
  const json = localStorage.getItem(STORAGE_KEY);
  return json ? JSON.parse(json) : [];
}

const favList = signal<number[]>(loadFavs());

function saveCart(cart: number[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

export function addTofavList(id: number) {
  favList.update(current => {
    if (current.includes(id)) return current;
    const updated = [...current, id];
    saveCart(updated);
    showToast('success', 'Artículo agregado a favoritos');
    return updated;
  });
}

export function removeFromfavList(id: number) {
  favList.update(current => {
    const updated = current.filter(item => item !== id);
    saveCart(updated);
    showToast('warning', 'Artículo eliminadao de favoritos');
    return updated;
  });
}

export function clearfavList() {
  favList.set([]);
  showToast('success', 'Se vació la lista de favoritos.');
  localStorage.removeItem(STORAGE_KEY);
}

export function usefavList() {
  return favList;
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