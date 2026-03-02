import { signal } from "@angular/core";
import userInfo from '../../../../public/json/userInfo.json';

export const currentUser = signal<any | null>(userInfo);
