import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { Request, Response } from 'express';
import { join } from 'node:path';

import {
  Account,
  ApiErrorResponse,
  ApiResponse,
  Beneficiary,
  Card,
  CreateBeneficiaryPayload,
  CreateTransferPayload,
  Transaction,
  Transfer,
  UpdateBeneficiaryPayload,
  UpdateCardPayload,
} from './app/core/models/banking';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

const account: Account = {
  id: 'acc-ana',
  holderName: 'Ana Souza',
  branch: '0001',
  number: '45892-1',
  balance: 8420.9,
  currency: 'BRL',
  incomeThisMonth: 12840,
  outcomeThisMonth: 4219.3,
};

const transactions: Transaction[] = [
  {
    id: 'txn-001',
    description: 'Pix recebido',
    counterparty: 'Marina Lopes',
    amount: 1240,
    type: 'credit',
    status: 'completed',
    category: 'Pix',
    occurredAt: '2026-06-04T12:42:00.000Z',
  },
  {
    id: 'txn-002',
    description: 'Pagamento cartão final 4482',
    counterparty: 'Banking Card',
    amount: 382.19,
    type: 'debit',
    status: 'processing',
    category: 'Cartão',
    occurredAt: '2026-06-03T21:10:00.000Z',
  },
  {
    id: 'txn-003',
    description: 'Transferência enviada',
    counterparty: 'Ricardo Alves',
    amount: 740,
    type: 'debit',
    status: 'scheduled',
    category: 'Transferência',
    occurredAt: '2026-06-03T14:05:00.000Z',
  },
  {
    id: 'txn-004',
    description: 'Salário',
    counterparty: 'Empresa Aurora LTDA',
    amount: 10500,
    type: 'credit',
    status: 'completed',
    category: 'Renda',
    occurredAt: '2026-06-01T13:00:00.000Z',
  },
];

let beneficiaries: Beneficiary[] = [
  {
    id: 'ben-marina',
    name: 'Marina Lopes',
    bank: 'Banco Verde',
    document: '123.456.789-09',
    pixKey: 'marina@email.dev',
    status: 'active',
    createdAt: '2026-05-12T13:30:00.000Z',
  },
  {
    id: 'ben-ricardo',
    name: 'Ricardo Alves',
    bank: 'Banco Cinza',
    document: '987.654.321-00',
    pixKey: '+5511999990000',
    status: 'active',
    createdAt: '2026-05-20T16:15:00.000Z',
  },
  {
    id: 'ben-julia',
    name: 'Julia Martins',
    bank: 'Instituição Ameixa',
    document: '456.789.123-10',
    pixKey: '45678912310',
    status: 'pending',
    createdAt: '2026-06-02T10:20:00.000Z',
  },
];

let cards: Card[] = [
  {
    id: 'card-4482',
    holderName: 'Ana Souza',
    finalDigits: '4482',
    type: 'physical',
    status: 'active',
    limit: 6500,
    availableLimit: 4800,
    dueDay: 10,
    recentPurchases: [
      {
        id: 'pur-4482-001',
        description: 'Assinatura mensal',
        merchant: 'Cloud Finance',
        amount: 89.9,
        status: 'approved',
        occurredAt: '2026-06-03T18:22:00.000Z',
      },
      {
        id: 'pur-4482-002',
        description: 'Mercado',
        merchant: 'Mercado Central',
        amount: 241.35,
        status: 'approved',
        occurredAt: '2026-06-02T21:10:00.000Z',
      },
      {
        id: 'pur-4482-003',
        description: 'Aplicativo de transporte',
        merchant: 'Mobilidade Urbana',
        amount: 32.8,
        status: 'processing',
        occurredAt: '2026-06-01T23:40:00.000Z',
      },
    ],
  },
  {
    id: 'card-2190',
    holderName: 'Ana Souza',
    finalDigits: '2190',
    type: 'virtual',
    status: 'blocked',
    limit: 2500,
    availableLimit: 2500,
    dueDay: 10,
    recentPurchases: [
      {
        id: 'pur-2190-001',
        description: 'Compra online',
        merchant: 'Livraria Digital',
        amount: 126.4,
        status: 'approved',
        occurredAt: '2026-05-30T14:25:00.000Z',
      },
    ],
  },
];

const sendData = <T>(response: Response<ApiResponse<T>>, data: T, message?: string): void => {
  response.json({ data, message });
};

const sendNotFound = (response: Response<ApiErrorResponse>, message: string): void => {
  response.status(404).json({ error: { code: 'not_found', message } });
};

app.use(express.json());

app.get('/api/account', (_request, response: Response<ApiResponse<Account>>) => {
  sendData(response, account);
});

app.get('/api/transactions', (_request, response: Response<ApiResponse<Transaction[]>>) => {
  sendData(response, transactions);
});

app.get(
  '/api/transactions/:id',
  (
    request: Request<{ id: string }>,
    response: Response<ApiResponse<Transaction> | ApiErrorResponse>,
  ) => {
    const transaction = transactions.find((item) => item.id === request.params.id);

    if (!transaction) {
      sendNotFound(response as Response<ApiErrorResponse>, 'Transação não encontrada.');
      return;
    }

    sendData(response as Response<ApiResponse<Transaction>>, transaction);
  },
);

app.get('/api/beneficiaries', (_request, response: Response<ApiResponse<Beneficiary[]>>) => {
  sendData(response, beneficiaries);
});

app.get(
  '/api/beneficiaries/:id',
  (
    request: Request<{ id: string }>,
    response: Response<ApiResponse<Beneficiary> | ApiErrorResponse>,
  ) => {
    const beneficiary = beneficiaries.find((item) => item.id === request.params.id);

    if (!beneficiary) {
      sendNotFound(response as Response<ApiErrorResponse>, 'Favorecido não encontrado.');
      return;
    }

    sendData(response as Response<ApiResponse<Beneficiary>>, beneficiary);
  },
);

app.post(
  '/api/beneficiaries',
  (
    request: Request<Record<string, never>, ApiResponse<Beneficiary>, CreateBeneficiaryPayload>,
    response: Response<ApiResponse<Beneficiary>>,
  ) => {
    const beneficiary: Beneficiary = {
      id: `ben-${Date.now()}`,
      name: request.body.name,
      bank: request.body.bank,
      document: request.body.document,
      pixKey: request.body.pixKey,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    beneficiaries = [beneficiary, ...beneficiaries];
    response.status(201);
    sendData(response, beneficiary, 'Favorecido criado com sucesso.');
  },
);

app.put(
  '/api/beneficiaries/:id',
  (
    request: Request<
      { id: string },
      ApiResponse<Beneficiary> | ApiErrorResponse,
      UpdateBeneficiaryPayload
    >,
    response: Response<ApiResponse<Beneficiary> | ApiErrorResponse>,
  ) => {
    const beneficiary = beneficiaries.find((item) => item.id === request.params.id);

    if (!beneficiary) {
      sendNotFound(response as Response<ApiErrorResponse>, 'Favorecido não encontrado.');
      return;
    }

    const updated: Beneficiary = { ...beneficiary, ...request.body };
    beneficiaries = beneficiaries.map((item) => (item.id === updated.id ? updated : item));
    sendData(response as Response<ApiResponse<Beneficiary>>, updated, 'Favorecido atualizado.');
  },
);

app.delete(
  '/api/beneficiaries/:id',
  (
    request: Request<{ id: string }>,
    response: Response<ApiResponse<{ id: string }> | ApiErrorResponse>,
  ) => {
    const exists = beneficiaries.some((item) => item.id === request.params.id);

    if (!exists) {
      sendNotFound(response as Response<ApiErrorResponse>, 'Favorecido não encontrado.');
      return;
    }

    beneficiaries = beneficiaries.filter((item) => item.id !== request.params.id);
    sendData(
      response as Response<ApiResponse<{ id: string }>>,
      { id: request.params.id },
      'Favorecido removido.',
    );
  },
);

app.post(
  '/api/transfers',
  (
    request: Request<
      Record<string, never>,
      ApiResponse<Transfer> | ApiErrorResponse,
      CreateTransferPayload
    >,
    response: Response<ApiResponse<Transfer> | ApiErrorResponse>,
  ) => {
    const beneficiary = beneficiaries.find((item) => item.id === request.body.beneficiaryId);

    if (!beneficiary) {
      sendNotFound(
        response as Response<ApiErrorResponse>,
        'Favorecido da transferência não encontrado.',
      );
      return;
    }

    const now = new Date().toISOString();
    const transfer: Transfer = {
      id: `trf-${Date.now()}`,
      beneficiaryId: beneficiary.id,
      amount: request.body.amount,
      description: request.body.description,
      status: 'completed',
      receiptCode: `BD-${Date.now()}`,
      createdAt: now,
    };

    // Reflete a transferência na conta e no extrato (dados em memória).
    account.balance -= transfer.amount;
    account.outcomeThisMonth += transfer.amount;
    transactions.unshift({
      id: transfer.id,
      description: 'Transferência Pix enviada',
      counterparty: beneficiary.name,
      amount: transfer.amount,
      type: 'debit',
      status: 'completed',
      category: 'Transferência',
      occurredAt: now,
    });

    response.status(201);
    sendData(
      response as Response<ApiResponse<Transfer>>,
      transfer,
      'Transferência criada com sucesso.',
    );
  },
);

app.get('/api/cards', (_request, response: Response<ApiResponse<Card[]>>) => {
  sendData(response, cards);
});

app.put(
  '/api/cards/:id',
  (
    request: Request<{ id: string }, ApiResponse<Card> | ApiErrorResponse, UpdateCardPayload>,
    response: Response<ApiResponse<Card> | ApiErrorResponse>,
  ) => {
    const card = cards.find((item) => item.id === request.params.id);

    if (!card) {
      sendNotFound(response as Response<ApiErrorResponse>, 'Cartão não encontrado.');
      return;
    }

    const updated: Card = { ...card, ...request.body };
    cards = cards.map((item) => (item.id === updated.id ? updated : item));
    sendData(response as Response<ApiResponse<Card>>, updated, 'Cartão atualizado.');
  },
);

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
