import { InMemoryDbService } from "angular-in-memory-web-api";
import { Category } from './pages/categories/shared/category.model';

export class InMemoryDatabase implements InMemoryDbService {

    createDb() {
        const categories: Category[] = [
            { id: 1, name: "Lazer", description: "Cinema, praia" },
            { id: 2, name: "Saúde", description: "Plano de Saúde e Remédios" },
            { id: 3, name: "Salário", description: "Recebimento de Salário" },
            { id: 4, name: "Cartão de Crédito", description: "Nubank" },
            { id: 5, name: "Poupança", description: "Itaú" },
            { id: 6, name: "Moradia", description: "Água, Energia" }
        ]

        return { categories }
    }
}