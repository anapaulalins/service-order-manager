import { create } from 'zustand';

export interface Product {
  id: string;
  clientName: string;
  phoneNumber: string;
  cpf: string;
  address: string;
  isExternalService: boolean;
  equipmentName: string;
  serialNumber: string;
  defectDescription: string;
  budget: string;
  status: 'Em andamento' | 'Completo';
}

interface ProductState {
  products: Product[];
  addProduct: (product: Product) => void;
  removeProduct: (id: string) => void;
  clearProducts: () => void;
}

const useProductStore = create<ProductState>((set) => ({
  products: [],
  addProduct: (product) =>
    set((state) => ({
      products: [...state.products, product],
    })),
  removeProduct: (id) =>
    set((state) => ({
      products: state.products.filter((product) => product.id !== id),
    })),
  clearProducts: () => set(() => ({ products: [] })),
}));

export default useProductStore;
