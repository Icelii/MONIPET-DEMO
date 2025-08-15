export interface PetBase {
    breed_id: number;
    name: string;
    birthday: string;
    gender: string;
    spayed: number;
    size: string;
    weight: number;
    height: number;
    description: string;
    status: string;
    id_adopter: number;
}

export interface storePetData extends PetBase {
    id_adopter: number;
    status: string;
    photo: File;
}
