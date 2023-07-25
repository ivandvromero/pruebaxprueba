import { IFindPeps } from '../interfaces/find-peps.interface';

export const pepsWithPendingStatus: IFindPeps[] = [
  {
    id: '1',
    date: '2023-10-09',
    email: 'mafercaballero@email.com',
    name: 'Maria Fernanda Caballero',
    identification: 'C.C 94723058',
    phone: '301 430 8765',
    status: 'PENDING',
    comment: 'Este es un comentario de prueba',
  },
  {
    id: '2',
    date: '2023-10-09',
    email: 'mauricio@email.com',
    name: 'Mauricio Llanos Villanueva',
    identification: 'C.C 834586903',
    phone: '301 098 8565',
    status: 'PENDING',
    comment: 'Este es un comentario de prueba',
  },
  {
    id: '3',
    date: '2023-10-09',
    email: 'salinaseve@email.com',
    name: 'Salinas Evelyn',
    identification: 'C.C 089276498',
    phone: '301 098 8565',
    status: 'PENDING',
    comment: 'Este es un comentario de prueba',
  },
];
