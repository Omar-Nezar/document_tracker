// types that are shared between backed and frontend should go here
import type { PettyCashTransaction } from '../../server/src/db/schema/pettyCashTransactions.schema';

export type Transaction = PettyCashTransaction;